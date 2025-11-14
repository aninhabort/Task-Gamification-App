import { StyleSheet, Text, View, ViewProps } from "react-native";

interface StatCardProps extends ViewProps {
  title: string;
  value: string | number;
  subtitle?: string;
}

export default function StatCard({ title, value, subtitle, style, ...props }: StatCardProps) {
  return (
    <View style={[styles.card, style]} {...props}>
      <Text style={styles.value}>{typeof value === 'number' ? value.toLocaleString() : value}</Text>
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderColor: "#454b52",
    borderWidth: 2,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 80,
    backgroundColor: "transparent",
  },
  value: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 6,
  },
  title: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    lineHeight: 18,
  },
  subtitle: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    marginTop: 4,
  },
});