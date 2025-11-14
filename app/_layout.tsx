import { Stack } from "expo-router";
import { FeaturedVouchersProvider } from "../contexts/FeaturedVouchersContext";
import { UserStatsProvider } from "../contexts/UserStatsContext";

export default function RootLayout() {
  return (
    <UserStatsProvider>
      <FeaturedVouchersProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="edit-profile" options={{ headerShown: false }} />
        </Stack>
      </FeaturedVouchersProvider>
    </UserStatsProvider>
  );
}
