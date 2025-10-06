import React, { createContext, useContext } from "react";
import { useUserStats } from "../hooks/useUserStats";

interface UserStatsContextType {
  stats: {
    tasksCompleted: number;
    totalPoints: number;
    vouchersRedeemed: number;
  };
  loading: boolean;
  addCompletedTask: (points: number) => void;
  redeemVoucher: (cost: number) => boolean;
  resetStats: () => void;
}

const UserStatsContext = createContext<UserStatsContextType | undefined>(
  undefined
);

export const UserStatsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const statsData = useUserStats();

  return (
    <UserStatsContext.Provider value={statsData}>
      {children}
    </UserStatsContext.Provider>
  );
};

export const useUserStatsContext = () => {
  const context = useContext(UserStatsContext);
  if (context === undefined) {
    throw new Error(
      "useUserStatsContext must be used within a UserStatsProvider"
    );
  }
  return context;
};
