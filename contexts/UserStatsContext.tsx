import React, { createContext, useContext } from 'react';
import { useUserStats } from '../hooks/useUserStats';
import { useUserTasks } from '../hooks/useUserTasks';
import { Task, UserData } from '../services/UserDataService';

interface UserStatsContextType {
  stats: {
    tasksCompleted: number;
    totalPoints: number;
    vouchersRedeemed: number;
  };
  loading: boolean;
  userData: UserData | null;
  addCompletedTask: (points: number) => void;
  redeemVoucher: (cost: number, voucherData: { voucherId: string; title: string }) => Promise<boolean>;
  resetStats: () => void;
  tasks: Task[];
  tasksLoading: boolean;
  addTask: (taskData: { title: string; points: number; type: string; urgency: string }) => void;
  completeTask: (taskId: string) => void;
  reloadTasks: () => void;
  addSampleTasks: () => Promise<void>; // Para debugging
}

const UserStatsContext = createContext<UserStatsContextType | undefined>(undefined);

export const UserStatsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const statsData = useUserStats();
  const tasksData = useUserTasks();

  // Debug: log dos dados que vêm dos hooks
  React.useEffect(() => {
  }, [statsData.stats, statsData.userData, statsData.loading]);

  React.useEffect(() => {
  }, [tasksData.tasks]);

  const contextValue: UserStatsContextType = {
    ...statsData,
    tasks: tasksData.tasks,
    tasksLoading: tasksData.loading,
    addTask: tasksData.addTask,
    completeTask: tasksData.completeTask,
    reloadTasks: tasksData.reloadTasks,
    addSampleTasks: tasksData.addSampleTasks,
  };

  return (
    <UserStatsContext.Provider value={contextValue}>
      {children}
    </UserStatsContext.Provider>
  );
};

export const useUserStatsContext = () => {
  const context = useContext(UserStatsContext);
  if (context === undefined) {
    throw new Error('useUserStatsContext must be used within a UserStatsProvider');
  }
  return context;
};
