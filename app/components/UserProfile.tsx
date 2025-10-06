import { FIREBASE_AUTH } from "@/FirebaseConfig";
import { signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface UserProfileProps {
  onLogout: () => void;
}

export default function UserProfile({ onLogout }: UserProfileProps) {
  const [user, setUser] = useState(FIREBASE_AUTH.currentUser);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = FIREBASE_AUTH.onAuthStateChanged((user) => {
      setUser(user);
    });

    return unsubscribe;
  }, []);

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          setLoading(true);
          try {
            await signOut(FIREBASE_AUTH);
            onLogout();
          } catch (error) {
            console.error("Logout error:", error);
            Alert.alert("Error", "Failed to logout. Please try again.");
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  const getInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase();
  };

  const formatDate = (date: string | null | undefined) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString();
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#ffd33d" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </View>

      <View style={styles.profileCard}>
        <View style={styles.avatarContainer}>
          {user.photoURL ? (
            <Image source={{ uri: user.photoURL }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>
                {getInitials(user.email || "User")}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.userInfo}>
          <Text style={styles.userName}>
            {user.displayName || user.email?.split("@")[0] || "User"}
          </Text>
          <Text style={styles.userEmail}>{user.email}</Text>
          <Text style={styles.userDetail}>
            Member since: {formatDate(user.metadata.creationTime)}
          </Text>
          <Text style={styles.userDetail}>
            Last login: {formatDate(user.metadata.lastSignInTime)}
          </Text>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>Tasks Completed</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>Total Points</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>Vouchers Redeemed</Text>
        </View>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.editProfileButton}>
          <Text style={styles.editProfileButtonText}>Edit Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingsButton}>
          <Text style={styles.settingsButtonText}>Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.logoutButtonText}>Logout</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffd33d",
  },
  profileCard: {
    backgroundColor: "#353a40",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#ffd33d",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#25292e",
  },
  userInfo: {
    alignItems: "center",
  },
  userName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: "#ffd33d",
    marginBottom: 12,
  },
  userDetail: {
    fontSize: 14,
    color: "#aaa",
    marginBottom: 4,
  },
  loadingText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    marginTop: 16,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  statCard: {
    backgroundColor: "#353a40",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 4,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffd33d",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#aaa",
    textAlign: "center",
  },
  actionButtons: {
    gap: 12,
  },
  editProfileButton: {
    backgroundColor: "#ffd33d",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
  },
  editProfileButtonText: {
    color: "#25292e",
    fontSize: 16,
    fontWeight: "bold",
  },
  settingsButton: {
    backgroundColor: "#353a40",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ffd33d",
  },
  settingsButtonText: {
    color: "#ffd33d",
    fontSize: 16,
    fontWeight: "bold",
  },
  logoutButton: {
    backgroundColor: "#ff3b30",
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: "center",
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
