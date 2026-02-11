import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";
import { FIREBASE_AUTH } from "../../FirebaseConfig";

export default function TabLayout() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  React.useEffect(() => {
    const unsubscribe = FIREBASE_AUTH.onAuthStateChanged((user) => {
      setIsAuthenticated(!!user);
    });
    return unsubscribe;
  }, []);

  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: "#ffd33d",
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#25292e",
          display: Platform.OS === "web" || isAuthenticated ? "flex" : "none",
        },
        tabBarIcon: ({ color, size }) => {
          let iconName:
            | "home-outline"
            | "gift-outline"
            | "person-outline"
            | "settings-outline" = "home-outline";
          if (route.name === "index") {
            iconName = "home-outline";
          } else if (route.name === "rewards") {
            iconName = "gift-outline";
          } else if (route.name === "profile") {
            iconName = "person-outline";
          } else if (route.name === "settings") {
            iconName = "settings-outline";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
        }}
      />
      <Tabs.Screen
        name="rewards"
        options={{
          title: "Rewards",
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
        }}
      />
    </Tabs>
  );
}
