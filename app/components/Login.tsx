import { FIREBASE_AUTH } from "@/FirebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Analytics } from "../../utils/analytics";
import { Button, Input } from "../ui/components";
import Signup from "./Signup";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const auth = FIREBASE_AUTH;

  const signIn = async () => {
    // Limpar mensagem de erro anterior
    setErrorMessage("");
    
    // Validações básicas
    if (!email.trim()) {
      setErrorMessage("Please enter your email address.");
      return;
    }
    
    if (!password.trim()) {
      setErrorMessage("Please enter your password.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      Analytics.login('email');
      // Login successful - AuthManager will handle the navigation
    } catch (error: any) {
      console.error("Login error:", error);
      let errorMessage =
        "Login failed. Please check your credentials and try again.";

      if (error.code === "auth/invalid-credential") {
        errorMessage = "Invalid email or password. Please verify your credentials. If you don't have an account, click 'Sign Up' below.";
      } else if (error.code === "auth/user-not-found") {
        errorMessage = "No account found with this email address.";
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "Incorrect password. Please try again.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Please enter a valid email address.";
      } else if (error.code === "auth/user-disabled") {
        errorMessage = "This account has been disabled.";
      } else if (error.code === "auth/too-many-requests") {
        errorMessage = "Too many failed login attempts. Please try again later.";
      }

      setErrorMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (showSignup) {
    return <Signup onBackToLogin={() => setShowSignup(false)} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>

      <Input
        placeholder="Email"
        autoCapitalize="none"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          if (errorMessage) setErrorMessage(""); // Limpar erro ao digitar
        }}
        keyboardType="email-address"
      />

      <Input
        placeholder="Password"
        autoCapitalize="none"
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          if (errorMessage) setErrorMessage(""); // Limpar erro ao digitar
        }}
        secureTextEntry={true}
      />

      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}

      {loading ? (
        <ActivityIndicator size="large" color="#fff" />
      ) : (
        <>
          <Button
            title="Login"
            onPress={signIn}
            style={{ marginTop: 20 }}
          />

          <TouchableOpacity
            onPress={() => setShowSignup(true)}
            style={styles.signupLink}
          >
            <Text style={styles.signupText}>
              Don&apos;t have an account? <Text style={styles.signupTextBold}>Sign Up</Text>
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
    color: "#fff",
    textAlign: "center",
    marginBottom: 40,
  },

  errorText: {
    color: "#ff6b6b",
    fontSize: 14,
    textAlign: "center",
    marginTop: 10,
    backgroundColor: "rgba(255, 107, 107, 0.1)",
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 107, 107, 0.3)",
  },
  signupLink: {
    marginTop: 20,
    alignItems: "center",
  },
  signupText: {
    color: "#aaa",
    fontSize: 16,
  },
  signupTextBold: {
    color: "#fff",
    fontWeight: "bold",
  },
});
