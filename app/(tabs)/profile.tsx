import { StyleSheet, View } from "react-native";
import AuthManager from "../components/AuthManager";

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <AuthManager />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "#fff",
  },
});
