import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

interface LoadingStateProps {
  text?: string;
  size?: "small" | "large";
  color?: string;
  centered?: boolean;
}

export default function LoadingState({
  text = "Loading...",
  size = "large",
  color = "#fff",
  centered = true,
}: LoadingStateProps) {
  if (centered) {
    return (
      <View style={styles.centeredContainer}>
        <View style={styles.content}>
          <ActivityIndicator size={size} color={color} />
          {text && <Text style={[styles.text, { color }]}>{text}</Text>}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.content}>
      <ActivityIndicator size={size} color={color} />
      {text && <Text style={[styles.text, { color }]}>{text}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
    gap: 12,
  },
  text: {
    fontSize: 16,
    textAlign: "center",
  },
});