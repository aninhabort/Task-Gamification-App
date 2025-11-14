import { FIREBASE_AUTH } from "@/FirebaseConfig";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useUserStatsContext } from "../../contexts/UserStatsContext";
import { Task, UserDataService } from "../../services/UserDataService";

interface UserProfileProps {
  onLogout: () => void;
}

export default function UserProfile({ onLogout }: UserProfileProps) {
  const [user, setUser] = useState(FIREBASE_AUTH.currentUser);
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const { stats } = useUserStatsContext();

  const navigateToSettings = () => {
    router.push("/(tabs)/settings");
  };

  const navigateToEditProfile = () => {
    router.push("/edit-profile");
  };

  const refreshUserData = async () => {
    const currentUser = FIREBASE_AUTH.currentUser;
    if (currentUser) {
      await currentUser.reload();
      setUser({ ...currentUser });
    }
  };

  const loadCompletedTasks = async (userId: string) => {
    try {
      setLoadingTasks(true);
      const tasks = await UserDataService.getCompletedTasks(userId);
      setCompletedTasks(tasks);
    } catch (error) {
      console.error('Error loading completed tasks:', error);
      setCompletedTasks([]);
    } finally {
      setLoadingTasks(false);
    }
  };

  useEffect(() => {
    const unsubscribe = FIREBASE_AUTH.onAuthStateChanged((user) => {
      setUser(user);
      if (user) {
        loadCompletedTasks(user.uid);
      } else {
        setCompletedTasks([]);
        setLoadingTasks(false);
      }
    });

    return unsubscribe;
  }, []);

  // Recarregar dados do usuário quando a tela ganhar foco (volta da edição)
  useFocusEffect(
    useCallback(() => {
      refreshUserData();
    }, [])
  );

  const getInitials = (name: string) => {
    if (!name) return "U";
    
    const words = name.trim().split(' ');
    if (words.length === 1) {
      // Se for só uma palavra, pega as duas primeiras letras
      return words[0].substring(0, 2).toUpperCase();
    } else {
      // Se for múltiplas palavras, pega a primeira letra de cada palavra (máximo 2)
      return words
        .slice(0, 2)
        .map(word => word.charAt(0))
        .join('')
        .toUpperCase();
    }
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#fff" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header with settings button */}
      <View style={styles.header}>
        <View style={styles.spacer} />
        <TouchableOpacity style={styles.settingsIconButton} onPress={navigateToSettings}>
          <Ionicons name="settings-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Profile Section */}
      <View style={styles.profileSection}>
        <View style={styles.avatarContainer}>
          {user.photoURL ? (
            <Image source={{ uri: user.photoURL }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>
                {getInitials(user.displayName || user.email?.split('@')[0] || "User")}
              </Text>
            </View>
          )}
          <TouchableOpacity style={styles.editProfileButton} onPress={navigateToEditProfile}>
            <Ionicons name="pencil-outline" size={16} color="#fff" />
          </TouchableOpacity>
        </View>

        <Text style={styles.userName}>
          {user.displayName || user.email?.split("@")[0] || "User"}
        </Text>
        <Text style={styles.userHandle}>
          @{user.email?.split("@")[0] || "user"}
        </Text>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.totalPoints.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Points</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.tasksCompleted}</Text>
          <Text style={styles.statLabel}>Tasks{'\n'}Completed</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statNumber}>89</Text>
          <Text style={styles.statLabel}>Streak</Text>
        </View>
      </View>

      {/* Task History Section */}
      <View style={styles.taskHistorySection}>
        <Text style={styles.sectionTitle}>Task History</Text>
        
        {loadingTasks ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#fff" />
            <Text style={styles.loadingTasksText}>Loading tasks...</Text>
          </View>
        ) : completedTasks.length > 0 ? (
          completedTasks.slice(0, 5).map((task) => (
            <View key={task.id} style={styles.taskItem}>
              <View style={styles.taskIcon}>
                <Ionicons name="checkmark" size={16} color="#fff" />
              </View>
              <View style={styles.taskContent}>
                <Text style={styles.taskTitle}>{task.title}</Text>
                <Text style={styles.taskStatus}>
                  Completed • {task.points} pts
                </Text>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyStateContainer}>
            <Ionicons name="clipboard-outline" size={48} color="#666" />
            <Text style={styles.emptyStateTitle}>No Tasks Yet</Text>
            <Text style={styles.emptyStateSubtitle}>
              Complete some tasks to see your history here
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
    paddingHorizontal: 10,
    paddingTop: 60,
    width: "100%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  spacer: {
    flex: 1,
  },
  settingsIconButton: {
    padding: 8,
  },
  profileSection: {
    alignItems: "center",
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#25292e",
  },
  userName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
  },
  userHandle: {
    fontSize: 16,
    color: "#888",
    marginBottom: 20,
  },
  editProfileButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#353a40",
    padding: 6,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#25292e",
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
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  statCard: {
    borderRadius: 12,
    borderColor: "#454b52",
    borderWidth: 2,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    marginHorizontal: 4,
    minHeight: 80,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 6,
  },
  statLabel: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    lineHeight: 18,
  },
  taskHistorySection: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  taskItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  taskIcon: {
    marginRight: 20,
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 6,
  },
  taskStatus: {
    fontSize: 14,
    color: "#888",
  },
  emptyStateContainer: {
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    lineHeight: 20,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    gap: 12,
  },
  loadingTasksText: {
    fontSize: 14,
    color: "#888",
  },
});
