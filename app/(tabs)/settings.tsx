import Ionicons from "@expo/vector-icons/Ionicons";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { FIREBASE_AUTH } from "../../FirebaseConfig";
import { useUserStatsContext } from "../../contexts/UserStatsContext";

export default function SettingsScreen() {
  const { resetStats } = useUserStatsContext();

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await FIREBASE_AUTH.signOut();
          } catch (error) {
            console.error("Error signing out:", error);
            Alert.alert("Error", "Failed to logout. Please try again.");
          }
        },
      },
    ]);
  };

  const handleResetStats = () => {
    Alert.alert(
      "Reset Statistics",
      "This will permanently delete all your tasks, points, and vouchers. This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Reset All Data",
          style: "destructive",
          onPress: () => {
            resetStats();
            Alert.alert(
              "Success",
              "All statistics have been reset successfully.",
            );
          },
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      <ScrollView style={styles.settingsContainer}>
        {/* Account Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>

          <TouchableOpacity style={styles.settingItem} onPress={handleLogout}>
            <View style={styles.settingLeft}>
              <Ionicons name="log-out-outline" size={24} color="#ff6b6b" />
              <Text style={[styles.settingText, styles.destructiveText]}>
                Logout
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Data Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Management</Text>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={handleResetStats}
          >
            <View style={styles.settingLeft}>
              <Ionicons name="refresh-outline" size={24} color="#ff6b6b" />
              <Text style={[styles.settingText, styles.destructiveText]}>
                Reset All Statistics
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>

          <View style={styles.warningContainer}>
            <Ionicons name="warning-outline" size={16} color="#ff9500" />
            <Text style={styles.warningText}>
              Resetting statistics will permanently delete all your tasks,
              points, and redeemed vouchers.
            </Text>
          </View>
        </View>

        {/* App Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons
                name="information-circle-outline"
                size={24}
                color="#ffd33d"
              />
              <Text style={styles.settingText}>App Version</Text>
            </View>
            <Text style={styles.versionText}>1.0.0</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
    paddingTop: 60,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#ffd33d",
    marginBottom: 24,
    textAlign: "center",
  },
  settingsContainer: {
    flex: 1,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 16,
    paddingLeft: 4,
  },
  settingItem: {
    backgroundColor: "#353a40",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  settingText: {
    fontSize: 16,
    color: "#fff",
    marginLeft: 12,
    flex: 1,
  },
  destructiveText: {
    color: "#ff6b6b",
  },
  versionText: {
    fontSize: 14,
    color: "#aaa",
  },
  warningContainer: {
    backgroundColor: "rgba(255, 149, 0, 0.1)",
    borderRadius: 8,
    padding: 12,
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 149, 0, 0.3)",
  },
  warningText: {
    fontSize: 12,
    color: "#ff9500",
    marginLeft: 8,
    flex: 1,
    lineHeight: 16,
  },
});
