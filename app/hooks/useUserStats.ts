import { useState } from "react";

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
  const [loading, setLoading] = useState(false);

  // Salvar estatísticas (por enquanto apenas no state)
  const saveStats = (newStats: UserStats) => {
    setStats(newStats);
  };

  // Adicionar task completada
  const addCompletedTask = (points: number) => {
    const newStats = {
      ...stats,
      tasksCompleted: stats.tasksCompleted + 1,
      totalPoints: stats.totalPoints + points,
    };
    saveStats(newStats);
  };

  // Resgatar voucher
  const redeemVoucher = (cost: number) => {
    if (stats.totalPoints >= cost) {
      const newStats = {
        ...stats,
        totalPoints: stats.totalPoints - cost,
        vouchersRedeemed: stats.vouchersRedeemed + 1,
      };
      saveStats(newStats);
      return true; // Sucesso
    }
    return false; // Pontos insuficientes
  };

  // Resetar estatísticas
  const resetStats = () => {
    const resetStats = {
      tasksCompleted: 0,
      totalPoints: 0,
      vouchersRedeemed: 0,
    };
    saveStats(resetStats);
  };

  return {
    stats,
    loading,
    addCompletedTask,
    redeemVoucher,
    resetStats,
  };
};
