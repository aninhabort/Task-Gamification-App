import { User } from 'firebase/auth';
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from 'firebase/firestore';
import { FIRESTORE_DB } from '../FirebaseConfig';
import { LocalStorageService } from './LocalStorageService';

export interface UserData {
  uid: string;
  email: string;
  displayName?: string;
  stats: {
    tasksCompleted: number;
    totalPoints: number;
    vouchersRedeemed: number;
  };
  createdAt: string;
  lastLoginAt: string;
}

export interface Task {
  id: string;
  title: string;
  points: number;
  type: string;
  urgency: string;
  userId: string;
  createdAt: string;
  completed?: boolean;
  completedAt?: string;
}

export interface RedeemedVoucher {
  id: string;
  voucherId: string;
  title: string;
  points: number;
  userId: string;
  redeemedAt: string;
}

export class UserDataService {
  // Configurações do modo de operação
  private static useLocalFallback = true; // Definir como true para usar armazenamento local

  // Testar conectividade com Firestore
  static async testConnection(): Promise<boolean> {
    try {
      const testRef = doc(FIRESTORE_DB, 'test', 'connection');
      await getDoc(testRef);
      this.useLocalFallback = false;
      return true;
    } catch (error: any) {
      console.error('UserDataService - Firestore connection failed, using local storage fallback');
      console.error('UserDataService - Connection error code:', error?.code);
      console.error('UserDataService - Connection error message:', error?.message);
      this.useLocalFallback = true;
      return false;
    }
  }

  // Criar ou atualizar dados do usuário
  static async createOrUpdateUser(user: User): Promise<void> {
    try {
      const userRef = doc(FIRESTORE_DB, 'users', user.uid);
      const userDoc = await getDoc(userRef);
      
      const now = new Date().toISOString();
      
      if (!userDoc.exists()) {
        // Criar novo usuário
        const userData: UserData = {
          uid: user.uid,
          email: user.email || '',
          ...(user.displayName && { displayName: user.displayName }),
          stats: {
            tasksCompleted: 0,
            totalPoints: 0,
            vouchersRedeemed: 0,
          },
          createdAt: now,
          lastLoginAt: now,
        };
        await setDoc(userRef, userData);
      } else {
        // Atualizar último login
        const updateData: any = {
          lastLoginAt: now,
        };
        if (user.displayName) {
          updateData.displayName = user.displayName;
        }
        await updateDoc(userRef, updateData);
      }
    } catch (error) {
      console.error('Error creating/updating user:', error);
      throw error;
    }
  }

  // Buscar dados do usuário (com fallback local)
  static async getUserData(userId: string): Promise<UserData | null> {
    try {
      
      // Se estiver usando modo local, buscar no LocalStorage
      if (this.useLocalFallback) {
        return await LocalStorageService.getUserData(userId);
      }
      
      const userRef = doc(FIRESTORE_DB, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        return userDoc.data() as UserData;
      }
      
      return null;
    } catch (error: any) {
      console.error('UserDataService - Error fetching user data from Firestore, trying local');
      console.error('UserDataService - Firestore error:', error?.code, error?.message);
      
      // Em caso de erro, tentar armazenamento local
      try {
        return await LocalStorageService.getUserData(userId);
      } catch (localError) {
        console.error('UserDataService - Local storage also failed:', localError);
        return null;
      }
    }
  }

  // Atualizar estatísticas do usuário (com fallback local)
  static async updateUserStats(userId: string, stats: UserData['stats']): Promise<void> {
    try {
      
      // Se estiver usando modo local, atualizar no LocalStorage
      if (this.useLocalFallback) {
        return await LocalStorageService.updateUserStats(userId, stats);
      }
      
      const userRef = doc(FIRESTORE_DB, 'users', userId);
      await updateDoc(userRef, { 
        stats,
        lastUpdatedAt: new Date().toISOString()
      });
    } catch (error: any) {
      console.error('UserDataService - Error updating stats in Firestore, trying local');
      console.error('UserDataService - Firestore error:', error?.code, error?.message);
      
      // Em caso de erro, tentar armazenamento local
      try {
        await LocalStorageService.updateUserStats(userId, stats);
      } catch (localError) {
        console.error('UserDataService - Local storage update also failed:', localError);
        throw error;
      }
    }
  }

  // Verificar se o usuário está autenticado
  static async verifyAuth(): Promise<boolean> {
    const { FIREBASE_AUTH } = await import('../FirebaseConfig');
    const user = FIREBASE_AUTH.currentUser;
    
    if (user) {
      try {
        const token = await user.getIdToken();
        return !!token;
      } catch (error) {
        console.error('UserDataService - Error getting auth token:', error);
        return false;
      }
    }
    return false;
  }

  // Adicionar nova task (com fallback local)
  static async addTask(userId: string, task: Omit<Task, 'id' | 'userId' | 'createdAt'>): Promise<string> {
    try {
      
      // Se estiver usando modo local, usar LocalStorage
      if (this.useLocalFallback) {
        return await LocalStorageService.addTask(userId, task);
      }
      
      // Verificar autenticação primeiro
      const isAuthenticated = await this.verifyAuth();
      if (!isAuthenticated) {
        return await LocalStorageService.addTask(userId, task);
      }
      
      const tasksRef = collection(FIRESTORE_DB, 'tasks');
      const newTask = {
        ...task,
        userId,
        createdAt: new Date().toISOString(),
        completed: false,
      };
      const docRef = await addDoc(tasksRef, newTask);
      return docRef.id;
    } catch (error: any) {
      console.error('UserDataService - Error adding task to Firestore, trying local storage');
      console.error('UserDataService - Error code:', error?.code);
      console.error('UserDataService - Error message:', error?.message);
      
      // Em caso de erro do Firestore, tentar armazenamento local
      try {
        return await LocalStorageService.addTask(userId, task);
      } catch (localError) {
        console.error('UserDataService - Local storage also failed:', localError);
        throw new Error('Não foi possível salvar a task. Tente novamente.');
      }
    }
  }

  // Retry logic para operações do Firestore
  static async retryOperation<T>(operation: () => Promise<T>, maxRetries: number = 3): Promise<T> {
    let lastError: any;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error: any) {
        lastError = error;
        console.error(`UserDataService - Attempt ${attempt} failed:`, error?.code, error?.message);
        
        // Se for erro de rede/conexão, esperar antes de tentar novamente
        if (error?.code === 'unavailable' || error?.code === 'deadline-exceeded') {
          const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000); // Exponential backoff
          await new Promise(resolve => setTimeout(resolve, delay));
        } else {
          // Se não for erro de conexão, não tentar novamente
          throw error;
        }
      }
    }
    
    throw lastError;
  }

  // Buscar tasks do usuário (com fallback local)
  static async getUserTasks(userId: string): Promise<Task[]> {
    try {
      
      // Se estiver usando modo local, buscar no LocalStorage
      if (this.useLocalFallback) {
        return await LocalStorageService.getUserTasks(userId);
      }
      
      const tasks = await this.retryOperation(async () => {
        const tasksRef = collection(FIRESTORE_DB, 'tasks');
        const q = query(tasksRef, where('userId', '==', userId), where('completed', '==', false));
        const querySnapshot = await getDocs(q);
        
        
        const tasks: Task[] = [];
        querySnapshot.forEach((doc) => {
          tasks.push({ id: doc.id, ...doc.data() } as Task);
        });
        
        return tasks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      });
      
      return tasks;
    } catch (error: any) {
      console.error('UserDataService - Error fetching from Firestore, trying local storage');
      console.error('UserDataService - Firestore error:', error?.code, error?.message);
      
      // Em caso de erro, tentar armazenamento local
      try {
        return await LocalStorageService.getUserTasks(userId);
      } catch (localError) {
        console.error('UserDataService - Local storage also failed:', localError);
        return []; // Retornar array vazio em caso de falha total
      }
    }
  }

  // Completar task (com fallback local)
  static async completeTask(taskId: string, userId?: string): Promise<void> {
    try {
      
      // Se estiver usando modo local, usar LocalStorage
      if (this.useLocalFallback && userId) {
        return await LocalStorageService.completeTask(userId, taskId);
      }
      
      const taskRef = doc(FIRESTORE_DB, 'tasks', taskId);
      await updateDoc(taskRef, { 
        completed: true,
        completedAt: new Date().toISOString()
      });
    } catch (error: any) {
      console.error('UserDataService - Error completing task in Firestore:', error);
      
      // Em caso de erro e se temos userId, tentar local
      if (userId) {
        try {
          return await LocalStorageService.completeTask(userId, taskId);
        } catch (localError) {
          console.error('UserDataService - Local storage completion also failed:', localError);
        }
      }
      
      throw error;
    }
  }

  // Resgatar voucher
  static async redeemVoucher(userId: string, voucher: Omit<RedeemedVoucher, 'id' | 'userId' | 'redeemedAt'>): Promise<string> {
    try {
      const vouchersRef = collection(FIRESTORE_DB, 'redeemedVouchers');
      const newVoucher = {
        ...voucher,
        userId,
        redeemedAt: new Date().toISOString(),
      };
      const docRef = await addDoc(vouchersRef, newVoucher);
      return docRef.id;
    } catch (error) {
      console.error('Error redeeming voucher:', error);
      throw error;
    }
  }

  // Buscar vouchers resgatados do usuário
  static async getUserRedeemedVouchers(userId: string): Promise<RedeemedVoucher[]> {
    try {
      const vouchersRef = collection(FIRESTORE_DB, 'redeemedVouchers');
      const q = query(vouchersRef, where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      
      const vouchers: RedeemedVoucher[] = [];
      querySnapshot.forEach((doc) => {
        vouchers.push({ id: doc.id, ...doc.data() } as RedeemedVoucher);
      });
      
      return vouchers.sort((a, b) => new Date(b.redeemedAt).getTime() - new Date(a.redeemedAt).getTime());
    } catch (error) {
      console.error('Error fetching redeemed vouchers:', error);
      throw error;
    }
  }

  // Buscar tarefas completadas (com fallback local)
  static async getCompletedTasks(userId: string): Promise<Task[]> {
    try {
      // Se estiver usando modo local, usar LocalStorage
      if (this.useLocalFallback) {
        return await LocalStorageService.getCompletedTasks(userId);
      }
      
      const tasksRef = collection(FIRESTORE_DB, 'tasks');
      const q = query(tasksRef, where('userId', '==', userId), where('completed', '==', true));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Task));
    } catch (error: any) {
      console.error('UserDataService - Error fetching completed tasks from Firestore:', error);
      
      // Em caso de erro, tentar local storage
      try {
        return await LocalStorageService.getCompletedTasks(userId);
      } catch (localError) {
        console.error('UserDataService - Local storage also failed:', localError);
        return []; // Retornar array vazio em caso de falha total
      }
    }
  }

  // Resetar dados do usuário (para testes)
  static async resetUserData(userId: string): Promise<void> {
    try {
      // Se estiver usando modo local, resetar apenas no armazenamento local
      if (this.useLocalFallback) {
        await LocalStorageService.updateUserStats(userId, {
          tasksCompleted: 0,
          totalPoints: 0,
          vouchersRedeemed: 0,
        });
        await LocalStorageService.clearUserActivityData(userId);
        return;
      }

      // Resetar estatísticas
      await this.updateUserStats(userId, {
        tasksCompleted: 0,
        totalPoints: 0,
        vouchersRedeemed: 0,
      });

      // Deletar todas as tasks do usuário
      const tasksRef = collection(FIRESTORE_DB, 'tasks');
      const tasksQuery = query(tasksRef, where('userId', '==', userId));
      const tasksSnapshot = await getDocs(tasksQuery);
      
      const deleteTaskPromises = tasksSnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deleteTaskPromises);

      // Deletar todos os vouchers resgatados
      const vouchersRef = collection(FIRESTORE_DB, 'redeemedVouchers');
      const vouchersQuery = query(vouchersRef, where('userId', '==', userId));
      const vouchersSnapshot = await getDocs(vouchersQuery);
      
      const deleteVoucherPromises = vouchersSnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deleteVoucherPromises);

      // Limpar caches locais se existirem
      try {
        await LocalStorageService.clearUserActivityData(userId);
      } catch (localError) {
        console.error('UserDataService - Local activity data cleanup failed:', localError);
      }
    } catch (error) {
      console.error('Error resetting user data:', error);
      throw error;
    }
  }
}
