import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Text, View } from "react-native";
import { TasksProps } from "../(tabs)";


function getIconName(type?: string) {
  switch (type) {
    case "health": return "heart-outline";
    case "study": return "book-outline";
    case "work": return "briefcase-outline";
    default: return "list-outline";
  }
}

export default function TaskCard({ title, points, type }: TasksProps) {
  return (
    <View style={styles.taskCard}>
      <Ionicons name={getIconName(type)} size={32} color="#ffd33d" style={{ marginRight: 12 }} />
      <View style={{ flex: 1 }}>
        <Text style={styles.taskTitle}>{title}</Text>
        <Text style={styles.taskPoints}>{points} pontos</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#353a40',
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  taskTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  taskPoints: {
    color: '#ffd33d',
    fontSize: 16,
    marginTop: 4,
  },
});
