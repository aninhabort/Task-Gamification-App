import { FIREBASE_AUTH } from '@/FirebaseConfig';
import { useCallback, useEffect, useState } from 'react';
import { UserData, UserDataService } from '../services/UserDataService';

interface UserStats {
  tasksCompleted: number;
  totalPoints: number;
  vouchersRedeemed: number;
}

export const useUserStats = () => {
  const [stats, setStats] = useState<UserStats>({
    tasksCompleted: 0,
    totalPoints: 0,
    vouchersRedeemed: 0,
  });
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);

  // Carregar dados do usuário autenticado
  useEffect(() => {
    const unsubscribe = FIREBASE_AUTH.onAuthStateChanged(async (user) => {
      
      if (user) {
        try {
          setLoading(true);
          await UserDataService.createOrUpdateUser(user);
          
          const data = await UserDataService.getUserData(user.uid);
          
          if (data) {
            setUserData(data);
            setStats(data.stats);
          } else {
            const defaultStats = {
              tasksCompleted: 0,
              totalPoints: 0,
              vouchersRedeemed: 0,
            };
            setStats(defaultStats);
            
            // Criar dados padrão do usuário
            const defaultUserData: UserData = {
              uid: user.uid,
              email: user.email || '',
              ...(user.displayName && { displayName: user.displayName }),
              stats: defaultStats,
              createdAt: new Date().toISOString(),
              lastLoginAt: new Date().toISOString(),
            };
            await UserDataService.updateUserStats(user.uid, defaultStats);
            setUserData(defaultUserData);
          }
        } catch (error) {
          console.error('useUserStats - Error loading user data:', error);
          // Em caso de erro, tentar carregar dados locais
          await loadLocalStatsIfNeeded();
        } finally {
          setLoading(false);
        }
      } else {
        // Usuário não autenticado - tentar carregar dados locais salvos
        await loadLocalStatsIfNeeded();
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  // Função para carregar estatísticas locais quando não há usuário autenticado
  const loadLocalStatsIfNeeded = async () => {
    try {
      const { LocalStorageService } = await import('../services/LocalStorageService');
      const localUserData = await LocalStorageService.getUserData('local-user');
      
      if (localUserData && localUserData.stats) {
        setStats(localUserData.stats);
        setUserData(localUserData);
      } else {
        const defaultStats = {
          tasksCompleted: 0,
          totalPoints: 0,
          vouchersRedeemed: 0,
        };
        setStats(defaultStats);
        setUserData(null);
      }
    } catch (error) {
      console.error('useUserStats - Error loading local stats:', error);
      setStats({
        tasksCompleted: 0,
        totalPoints: 0,
        vouchersRedeemed: 0,
      });
      setUserData(null);
    }
  };

  // Salvar estatísticas no Firestore
    const saveStats = useCallback(async (newStats: UserStats) => {
    
    // Sempre salvar localmente como backup
    try {
      const { LocalStorageService } = await import('../services/LocalStorageService');
      const userId = userData?.uid || 'local-user';
      await LocalStorageService.updateUserStats(userId, newStats);
    } catch (localError) {
      console.error('useUserStats - Error saving local stats:', localError);
    }

    // Tentar salvar no Firebase se usuário estiver autenticado
    if (userData) {
      try {
        await UserDataService.updateUserStats(userData.uid, newStats);
      } catch (error) {
        console.error('useUserStats - Error saving Firebase stats:', error);
      }
    } else {
    }

    // Sempre atualizar o estado local
    setStats(newStats);
  }, [userData]);

  // Adicionar task completada
  const addCompletedTask = async (points: number) => {
    
    const newStats = {
      ...stats,
      tasksCompleted: stats.tasksCompleted + 1,
      totalPoints: stats.totalPoints + points,
    };
    
    await saveStats(newStats);
  };

  // Resgatar voucher
  const redeemVoucher = async (cost: number, voucherData: { voucherId: string; title: string }) => {
    
    const user = FIREBASE_AUTH.currentUser;
    if (!user) {
      return false;
    }

    if (stats.totalPoints >= cost) {
      try {
        
        // Salvar voucher resgatado
        await UserDataService.redeemVoucher(user.uid, {
          voucherId: voucherData.voucherId,
          title: voucherData.title,
          points: cost,
        });

        // Atualizar estatísticas
        const newStats = {
          ...stats,
          totalPoints: stats.totalPoints - cost,
          vouchersRedeemed: stats.vouchersRedeemed + 1,
        };
        
        await saveStats(newStats);
        return true;
      } catch (error) {
        console.error('useUserStats - Error redeeming voucher:', error);
        return false;
      }
    } else {
    }
    return false; // Pontos insuficientes
  };

  // Resetar estatísticas
  const resetStats = async () => {
    
    const user = FIREBASE_AUTH.currentUser;
    if (user) {
      try {
        await UserDataService.resetUserData(user.uid);
        
        const resetStatsData = {
          tasksCompleted: 0,
          totalPoints: 0,
          vouchersRedeemed: 0,
        };
        
        setStats(resetStatsData);
        if (userData) {
          setUserData({ ...userData, stats: resetStatsData });
        }
      } catch (error) {
        console.error('Error resetting stats:', error);
      }
    }
  };

  return {
    stats,
    loading,
    userData,
    addCompletedTask,
    redeemVoucher,
    resetStats,
  };
};
