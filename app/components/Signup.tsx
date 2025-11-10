import { FIREBASE_AUTH } from "@/FirebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface SignupProps {
  onBackToLogin: () => void;
}

export default function Signup({ onBackToLogin }: SignupProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const auth = FIREBASE_AUTH;

  const signUp = async () => {
    if (password !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters long!");
      return;
    }

    setLoading(true);
    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      // Account created successfully - AuthManager will handle the navigation
    } catch (error: any) {
      console.error("Signup error:", error);
      let errorMessage = "Signup failed. Please try again.";

      if (error.code === "auth/email-already-in-use") {
        errorMessage =
          "Email is already registered. Please use a different email.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Please enter a valid email address.";
      } else if (error.code === "auth/weak-password") {
        errorMessage =
          "Password is too weak. Please choose a stronger password.";
      }

      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#CCCCCC"
        autoCapitalize="none"
        value={email}
        onChangeText={(text) => setEmail(text)}
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#CCCCCC"
        autoCapitalize="none"
        value={password}
        onChangeText={(text) => setPassword(text)}
        secureTextEntry={true}
      />

      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        placeholderTextColor="#CCCCCC"
        autoCapitalize="none"
        value={confirmPassword}
        onChangeText={(text) => setConfirmPassword(text)}
        secureTextEntry={true}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#ffd33d" />
      ) : (
        <>
          <TouchableOpacity style={styles.signupButton} onPress={signUp}>
            <Text style={styles.signupButtonText}>Create Account</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.backButton} onPress={onBackToLogin}>
            <Text style={styles.backButtonText}>
              Already have an account? Login
            </Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    marginHorizontal: 20,
    width: "80%",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffd33d",
    textAlign: "center",
    marginBottom: 40,
  },
  input: {
    marginVertical: 8,
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    padding: 15,
    color: "#fff",
    backgroundColor: "#353a40",
    fontSize: 16,
  },
  signupButton: {
    backgroundColor: "#ffd33d",
    paddingVertical: 15,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
  },
  signupButtonText: {
    color: "#25292e",
    fontSize: 18,
    fontWeight: "bold",
  },
  backButton: {
    marginTop: 20,
    alignItems: "center",
  },
  backButtonText: {
    color: "#ffd33d",
    fontSize: 16,
    textDecorationLine: "underline",
  },
});
