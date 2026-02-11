import { Stack } from "expo-router";
import { useEffect } from "react";
import { UserStatsProvider } from "../contexts/UserStatsContext";
import { initializeWebNavigation } from "../utils/webNavigationFix";

export default function RootLayout() {
  useEffect(() => {
    // Inicializar correções de navegação web apenas uma vez
    initializeWebNavigation();
  }, []);

  return (
    <UserStatsProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </UserStatsProvider>
  );
}
