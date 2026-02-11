import AsyncStorage from "@react-native-async-storage/async-storage";
import { RedeemedVoucher, Task, UserData } from "./UserDataService";

export class LocalStorageService {
  private static readonly KEYS = {
    USER_DATA: "user_data_",
    USER_TASKS: "user_tasks_",
    COMPLETED_TASKS: "completed_tasks_",
    REDEEMED_VOUCHERS: "redeemed_vouchers_",
  };

  static async saveUserData(userId: string, userData: UserData): Promise<void> {
    try {
      const key = this.KEYS.USER_DATA + userId;
      await AsyncStorage.setItem(key, JSON.stringify(userData));
    } catch (error) {
      throw error;
    }
  }

  static async getUserData(userId: string): Promise<UserData | null> {
    try {
      const key = this.KEYS.USER_DATA + userId;
      const data = await AsyncStorage.getItem(key);
      if (data) {
        return JSON.parse(data);
      }
      return null;
    } catch {
      return null;
    }
  }

  static async saveUserTasks(userId: string, tasks: Task[]): Promise<void> {
    try {
      const key = this.KEYS.USER_TASKS + userId;
      await AsyncStorage.setItem(key, JSON.stringify(tasks));
    } catch (error) {
      throw error;
    }
  }

  static async getUserTasks(userId: string): Promise<Task[]> {
    try {
      const key = this.KEYS.USER_TASKS + userId;
      const data = await AsyncStorage.getItem(key);
      if (data) {
        const tasks = JSON.parse(data);
        return tasks;
      }
      return [];
    } catch {
      return [];
    }
  }

  static async addTask(
    userId: string,
    task: Omit<Task, "id" | "userId" | "createdAt">,
  ): Promise<string> {
    try {
      const tasks = await this.getUserTasks(userId);
      const newTask: Task = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9), // ID único
        ...task,
        userId,
        createdAt: new Date().toISOString(),
        completed: false,
      };

      tasks.unshift(newTask);
      await this.saveUserTasks(userId, tasks);

      return newTask.id;
    } catch (error) {
      throw error;
    }
  }

  static async completeTask(userId: string, taskId: string): Promise<void> {
    try {
      const tasks = await this.getUserTasks(userId);
      const taskToComplete = tasks.find((task) => task.id === taskId);

      if (taskToComplete) {
        const completedTask = {
          ...taskToComplete,
          completed: true,
          completedAt: new Date().toISOString(),
        };
        await this.saveCompletedTask(userId, completedTask);
      }
      const updatedTasks = tasks.filter((task) => task.id !== taskId);
      await this.saveUserTasks(userId, updatedTasks);
    } catch (error) {
      throw error;
    }
  }

  static async saveCompletedTask(
    userId: string,
    completedTask: Task,
  ): Promise<void> {
    try {
      const completedTasks = await this.getCompletedTasks(userId);
      const updatedCompletedTasks = [completedTask, ...completedTasks];
      const key = this.KEYS.COMPLETED_TASKS + userId;
      await AsyncStorage.setItem(key, JSON.stringify(updatedCompletedTasks));
    } catch (error) {
      throw error;
    }
  }

  static async getCompletedTasks(userId: string): Promise<Task[]> {
    try {
      const key = this.KEYS.COMPLETED_TASKS + userId;
      const data = await AsyncStorage.getItem(key);
      if (data) {
        const tasks = JSON.parse(data);
        return tasks.sort((a: Task, b: Task) => {
          const dateA = new Date(a.completedAt || a.createdAt).getTime();
          const dateB = new Date(b.completedAt || b.createdAt).getTime();
          return dateB - dateA; // Mais recente primeiro
        });
      }
      return [];
    } catch (error) {
      console.error("Error getting completed tasks from local storage:", error);
      return [];
    }
  }

  static async updateUserStats(
    userId: string,
    stats: UserData["stats"],
  ): Promise<void> {
    try {
      let userData = await this.getUserData(userId);
      if (!userData) {
        // Criar dados básicos do usuário se não existir
        userData = {
          uid: userId,
          email: "local@example.com",
          stats: { tasksCompleted: 0, totalPoints: 0, vouchersRedeemed: 0 },
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
        };
      }

      userData.stats = stats;
      userData.lastLoginAt = new Date().toISOString();

      await this.saveUserData(userId, userData);
    } catch (error) {
      throw error;
    }
  }

  static async redeemVoucher(
    userId: string,
    voucher: Omit<RedeemedVoucher, "id" | "userId" | "redeemedAt">,
  ): Promise<string> {
    try {
      const vouchers = await this.getUserRedeemedVouchers(userId);
      const newVoucher: RedeemedVoucher = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9), // ID único
        ...voucher,
        userId,
        redeemedAt: new Date().toISOString(),
      };

      vouchers.unshift(newVoucher);
      await this.saveUserRedeemedVouchers(userId, vouchers);

      return newVoucher.id;
    } catch (error) {
      throw error;
    }
  }

  static async getUserRedeemedVouchers(
    userId: string,
  ): Promise<RedeemedVoucher[]> {
    try {
      const key = this.KEYS.REDEEMED_VOUCHERS + userId;
      const data = await AsyncStorage.getItem(key);
      if (data) {
        const vouchers = JSON.parse(data);
        return vouchers.sort(
          (a: RedeemedVoucher, b: RedeemedVoucher) =>
            new Date(b.redeemedAt).getTime() - new Date(a.redeemedAt).getTime(),
        );
      }
      return [];
    } catch {
      return [];
    }
  }

  private static async saveUserRedeemedVouchers(
    userId: string,
    vouchers: RedeemedVoucher[],
  ): Promise<void> {
    try {
      const key = this.KEYS.REDEEMED_VOUCHERS + userId;
      await AsyncStorage.setItem(key, JSON.stringify(vouchers));
    } catch (error) {
      throw error;
    }
  }

  static async clearUserData(userId: string): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        this.KEYS.USER_DATA + userId,
        this.KEYS.USER_TASKS + userId,
        this.KEYS.REDEEMED_VOUCHERS + userId,
      ]);
    } catch {
      // Fail silently
    }
  }
}
