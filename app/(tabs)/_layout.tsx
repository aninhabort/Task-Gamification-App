import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: "#ffd33d",
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#25292e",
        },
        tabBarIcon: ({ color, size }) => {
          let iconName: "home-outline" | "gift-outline" | "person-outline" = "home-outline";
          if (route.name === "index") {
            iconName = "home-outline";
          } else if (route.name === "rewards") {
            iconName = "gift-outline";
          } else if (route.name === "profile") {
            iconName = "person-outline";
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
    </Tabs>
  );
}
