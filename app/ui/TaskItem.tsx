import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, TouchableOpacityProps, View } from "react-native";

interface TaskItemProps extends TouchableOpacityProps {
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconBackgroundColor?: string;
  completed?: boolean;
}

export default function TaskItem({
  title,
  subtitle,
  icon,
  iconBackgroundColor = "#3E4246",
  completed = false,
  style,
  ...props
}: TaskItemProps) {
  return (
    <TouchableOpacity style={[styles.container, style]} {...props}>
      <View style={[styles.iconContainer, { backgroundColor: iconBackgroundColor }]}>
        <Ionicons 
          name={completed ? "checkmark" : icon} 
          size={20} 
          color="#fff" 
        />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  content: {
    flex: 1,
  },
  title: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  subtitle: {
    color: "#99A1C2",
    fontSize: 14,
  },
});