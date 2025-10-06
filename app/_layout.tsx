import { Stack } from "expo-router";
import { UserStatsProvider } from "./contexts/UserStatsContext";

export default function RootLayout() {
  return (
    <UserStatsProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </UserStatsProvider>
  );
}
