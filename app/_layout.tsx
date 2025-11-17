import { Stack } from "expo-router";
import { FeaturedVouchersProvider } from "../contexts/FeaturedVouchersContext";
import { UserStatsProvider } from "../contexts/UserStatsContext";
import { ErrorBoundary } from "./components/ErrorBoundary";

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <UserStatsProvider>
        <FeaturedVouchersProvider>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="edit-profile" options={{ headerShown: false }} />
          </Stack>
        </FeaturedVouchersProvider>
      </UserStatsProvider>
    </ErrorBoundary>
  );
}
