import { FIREBASE_AUTH } from "@/FirebaseConfig";
import { onAuthStateChanged, User } from "firebase/auth";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import Login from "./Login";
import UserProfile from "./UserProfile";

export default function AuthManager() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const handleLogout = () => {
    setUser(null);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ffd33d" />
      </View>
    );
  }

  if (user) {
    return <UserProfile onLogout={handleLogout} />;
  }

  return <Login />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: "#25292e",
    justifyContent: "center",
    alignItems: "center",
  },
});
