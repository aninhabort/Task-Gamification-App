import { Stack } from "expo-router";
import { useEffect } from "react";
import { View } from "react-native";
import { UserStatsProvider } from "../contexts/UserStatsContext";
import { initializeWebNavigation } from "../utils/webNavigationFix";

export default function RootLayout() {
  useEffect(() => {
    initializeWebNavigation();
  }, []);

  return (
    <UserStatsProvider>
      <View accessible={true} style={{ flex: 1 }}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </View>
    </UserStatsProvider>
  );
}
