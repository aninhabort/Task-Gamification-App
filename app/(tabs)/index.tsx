import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SwipeListView } from "react-native-swipe-list-view";
import { useUserStatsContext } from "../../contexts/UserStatsContext";
import { FIREBASE_AUTH } from "../../FirebaseConfig";
import Login from "../components/Login";
import TaskCard from "../components/TaskCard";
import VoucherCard from "../components/VoucherCard";

export default function HomeScreen() {
  const [modalVisible, setModalVisible] = React.useState(false);
  const [taskTitle, setTaskTitle] = React.useState("");
  const [urgency, setUrgency] = React.useState("normal");
  const [taskType, setTaskType] = React.useState("study");
  const { stats, addCompletedTask, tasks, addTask, completeTask } = useUserStatsContext();
  
  // Debug: log para verificar se as tasks estão sendo carregadas
  React.useEffect(() => {
  }, [tasks, stats]);

  // Verificar estado de autenticação
  const [authUser, setAuthUser] = React.useState<any>(null);
  
  React.useEffect(() => {
    const unsubscribe = FIREBASE_AUTH.onAuthStateChanged((user: any) => {
      setAuthUser(user);
    });
    return unsubscribe;
  }, []);

  function handleCompleteTask(taskId: string, points: number) {
    addCompletedTask(points);
    completeTask(taskId);
  }



  function calculatePoints(urgency: string) {
    switch (urgency) {
      case "high":
        return 100;
      case "medium":
        return 70;
      default:
        return 50;
    }
  }

  function handleAddTask() {
    if (!taskTitle) return;
    const points = calculatePoints(urgency);
    addTask({ title: taskTitle, points, type: taskType, urgency });
    setTaskTitle("");
    setUrgency("normal");
    setTaskType("study");
    setModalVisible(false);
  }

  // Se o usuário não estiver autenticado, mostrar tela de login
  if (!authUser) {
    return (
      <View style={styles.loginContainer}>
        <Login />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.pointsContainer}>
          <Text style={styles.pointsText}>Points: {stats.totalPoints}</Text>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="add-circle" size={40} color="#ffd33d" />
        </TouchableOpacity>
      </View>
      
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>New Task</Text>
            <TextInput
              style={styles.input}
              placeholder="Put your task here"
              value={taskTitle}
              onChangeText={setTaskTitle}
              placeholderTextColor="#aaa"
            />
            <Text style={styles.label}>Urgency:</Text>
            <View style={styles.urgencyContainer}>
              <Pressable
                style={[
                  styles.urgencyButton,
                  urgency === "normal" && { backgroundColor: "#ffd33d" },
                ]}
                onPress={() => setUrgency("normal")}
              >
                <Text
                  style={[
                    styles.urgencyText,
                    urgency === "normal" && { color: "#25292e" },
                  ]}
                >
                  Normal
                </Text>
              </Pressable>
              <Pressable
                style={[
                  styles.urgencyButton,
                  urgency === "medium" && { backgroundColor: "#ff9800" },
                ]}
                onPress={() => setUrgency("medium")}
              >
                <Text
                  style={[
                    styles.urgencyText,
                    urgency === "medium" && { color: "#fff" },
                  ]}
                >
                  Medium
                </Text>
              </Pressable>
              <Pressable
                style={[
                  styles.urgencyButton,
                  urgency === "high" && { backgroundColor: "#ff3b30" },
                ]}
                onPress={() => setUrgency("high")}
              >
                <Text
                  style={[
                    styles.urgencyText,
                    urgency === "high" && { color: "#fff" },
                  ]}
                >
                  High
                </Text>
              </Pressable>
            </View>
            <Text style={styles.label}>Type:</Text>
            <View style={styles.typeContainer}>
              <Pressable
                style={[
                  styles.typeButton,
                  taskType === "health" && styles.typeSelected,
                ]}
                onPress={() => setTaskType("health")}
              >
                <Text style={styles.typeText}>Health</Text>
              </Pressable>
              <Pressable
                style={[
                  styles.typeButton,
                  taskType === "study" && styles.typeSelected,
                ]}
                onPress={() => setTaskType("study")}
              >
                <Text style={styles.typeText}>Study</Text>
              </Pressable>
              <Pressable
                style={[
                  styles.typeButton,
                  taskType === "work" && styles.typeSelected,
                ]}
                onPress={() => setTaskType("work")}
              >
                <Text style={styles.typeText}>Work</Text>
              </Pressable>
            </View>
            <Pressable style={styles.saveButton} onPress={handleAddTask}>
              <Text style={styles.saveButtonText}>Add</Text>
            </Pressable>
            <Pressable
              style={styles.cancelButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      
      {tasks.length === 0 ? (
        <View style={styles.emptyTasksContainer}>
          <Text style={styles.emptyTasksTitle}>No tasks yet!</Text>
          <Text style={styles.emptyTasksSubtitle}>
            Start by adding your first task using the + button above
          </Text>
          <Text style={styles.emptyTasksHint}>
            Set priorities and earn points by completing tasks!
          </Text>
        </View>
      ) : (
        <SwipeListView
          data={tasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TaskCard title={item.title} points={item.points} type={item.type} />
          )}
          renderHiddenItem={({ item }) => (
            <View style={styles.rowBack}>
              <TouchableOpacity
                style={styles.completeButton}
                onPress={() => handleCompleteTask(item.id, item.points)}
              >
                <Text style={styles.completeButtonText}>Concluir</Text>
              </TouchableOpacity>
            </View>
          )}
          rightOpenValue={-100}
          disableRightSwipe
          style={styles.tasksScroll}
        />
      )}

      <View style={styles.vouchersSection}>
        <Text style={styles.text}>Vouchers</Text>
        <ScrollView
          horizontal
          style={styles.vouchersScroll}
          showsHorizontalScrollIndicator={false}
        >
          <VoucherCard
            title="Discount Voucher"
            points={100}
            image="https://via.placeholder.com/150"
            voucherId="discount-voucher"
          />
          <VoucherCard
            title="Coffee Voucher"
            points={80}
            image="https://via.placeholder.com/150/ffd33d/25292e"
            voucherId="coffee-voucher"
          />
          <VoucherCard
            title="Book Voucher"
            points={120}
            image="https://via.placeholder.com/150/353a40/ffd33d"
            voucherId="book-voucher"
          />
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  loginContainer: {
    flex: 1,
    backgroundColor: "#25292e",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#25292e",
    justifyContent: "flex-start",
    paddingTop: 60,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  text: {
    color: "#fff",
    fontSize: 24,
    marginBottom: 24,
  },
  tasksScroll: {
    maxHeight: 440,
    marginBottom: 16,
  },
  vouchersSection: {
    flex: 1,
    justifyContent: "flex-end",
    marginBottom: 32,
  },
  vouchersScroll: {
    flexGrow: 0,
  },
  addButton: {
    alignItems: "center",
    justifyContent: "center",
    // Remove any TextStyle or ImageStyle properties if present
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#25292e",
    padding: 24,
    borderRadius: 16,
    width: "90%",
    alignItems: "stretch",
  },
  modalTitle: {
    color: "#ffd33d",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#353a40",
    color: "#fff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  label: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 8,
  },
  urgencyContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  urgencyButton: {
    backgroundColor: "#353a40",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  urgencySelected: {
    backgroundColor: "#ffd33d",
  },
  // Removed misplaced TextStyle properties from styles object root
  typeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  typeButton: {
    backgroundColor: "#353a40",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  typeSelected: {
    backgroundColor: "#ffd33d",
  },
  typeText: {
    color: "#25292e",
    fontWeight: "bold",
  },
  rowBack: {
    alignItems: "center",
    backgroundColor: "#4BB543",
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingRight: 2,
    marginTop: 8,
    borderRadius: 12,
  },
  completeButton: {
    backgroundColor: "#4BB543",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  completeButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: "#ffd33d",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 8,
  },
  saveButtonText: {
    color: "#25292e",
    fontWeight: "bold",
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: "#353a40",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  button: {
    fontSize: 20,
    textDecorationLine: "underline",
    color: "#fff",
  },
  urgencyText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#25292e",
    marginHorizontal: 8,
  },
  pointsContainer: {
    backgroundColor: "#353a40",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ffd33d",
  },
  pointsText: {
    color: "#ffd33d",
    fontSize: 16,
    fontWeight: "bold",
  },


  emptyTasksContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    paddingVertical: 40,
  },
  emptyTasksTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffd33d",
    textAlign: "center",
    marginBottom: 16,
  },
  emptyTasksSubtitle: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
    marginBottom: 12,
    lineHeight: 22,
  },
  emptyTasksHint: {
    fontSize: 14,
    color: "#aaa",
    textAlign: "center",
    fontStyle: "italic",
  },
});
