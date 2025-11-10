import { FIREBASE_AUTH } from "@/FirebaseConfig";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { updateProfile } from "firebase/auth";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function EditProfile() {
  const [user, setUser] = useState(FIREBASE_AUTH.currentUser);
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = FIREBASE_AUTH.onAuthStateChanged((user) => {
      setUser(user);
      setDisplayName(user?.displayName || "");
    });

    return unsubscribe;
  }, []);

  const getInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase();
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      await updateProfile(user, {
        displayName: displayName.trim() || null,
      });

      Alert.alert(
        "Success",
        "Profile updated successfully!",
        [{ text: "OK", onPress: () => router.back() }]
      );
    } catch (error) {
      console.error("Error updating profile:", error);
      Alert.alert("Error", "Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No user found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleCancel}>
          <Ionicons name="arrow-back" size={24} color="#ffd33d" />
        </TouchableOpacity>
        <Text style={styles.title}>Edit Profile</Text>
        <TouchableOpacity 
          style={styles.saveButton} 
          onPress={handleSaveProfile}
          disabled={isLoading}
        >
          <Text style={styles.saveButtonText}>
            {isLoading ? "Saving..." : "Save"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Avatar Section */}
      <View style={styles.avatarSection}>
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
          <TouchableOpacity style={styles.editAvatarButton}>
            <Ionicons name="camera" size={20} color="#ffd33d" />
          </TouchableOpacity>
        </View>
        <Text style={styles.changePhotoText}>Change Photo</Text>
      </View>

      {/* Form Section */}
      <View style={styles.formSection}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Display Name</Text>
          <TextInput
            style={styles.input}
            value={displayName}
            onChangeText={setDisplayName}
            placeholder="Enter your display name"
            placeholderTextColor="#888"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[styles.input, styles.disabledInput]}
            value={user.email || ""}
            editable={false}
            placeholderTextColor="#666"
          />
          <Text style={styles.helperText}>Email cannot be changed</Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Member Since</Text>
          <TextInput
            style={[styles.input, styles.disabledInput]}
            value={user.metadata.creationTime ? 
              new Date(user.metadata.creationTime).toLocaleDateString() : "N/A"
            }
            editable={false}
            placeholderTextColor="#666"
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "#353a40",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#ffd33d",
  },
  saveButtonText: {
    color: "#25292e",
    fontSize: 16,
    fontWeight: "600",
  },
  avatarSection: {
    alignItems: "center",
    paddingVertical: 30,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 12,
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
    backgroundColor: "#ffd33d",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#25292e",
  },
  editAvatarButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#353a40",
    borderRadius: 20,
    padding: 8,
    borderWidth: 2,
    borderColor: "#25292e",
  },
  changePhotoText: {
    color: "#ffd33d",
    fontSize: 16,
    fontWeight: "500",
  },
  formSection: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#353a40",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#fff",
    borderWidth: 1,
    borderColor: "transparent",
  },
  disabledInput: {
    backgroundColor: "#2a2d32",
    color: "#888",
  },
  helperText: {
    fontSize: 12,
    color: "#888",
    marginTop: 4,
  },
  errorText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    marginTop: 100,
  },
});