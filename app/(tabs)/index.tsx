import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import {
  Alert,
  Image,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useFeaturedVouchers } from "../../contexts/FeaturedVouchersContext";
import { useUserStatsContext } from "../../contexts/UserStatsContext";
import { FIREBASE_AUTH } from "../../FirebaseConfig";
import Login from "../components/Login";


interface Voucher {
  id: string;
  title: string;
  points: number;
  category: string;
  description: string;
}

export default function HomeScreen() {
  const [modalVisible, setModalVisible] = React.useState(false);
  const [taskTitle, setTaskTitle] = React.useState("");
  const [urgency, setUrgency] = React.useState("normal");
  const [taskType, setTaskType] = React.useState("study");
  const {
    stats,
    addCompletedTask,
    tasks,
    addTask,
    completeTask,
    redeemVoucher,
  } = useUserStatsContext();

  // Usar o contexto compartilhado dos Featured Vouchers
  const { featuredVouchers } = useFeaturedVouchers();

  // Função para gerar imagem baseada na categoria
  const getVoucherImage = (category: string) => {
    const imageMap: Record<string, string> = {
      "Café / Snack Break":
        "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=300&h=300&fit=crop&crop=center",
      Lazer:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop&crop=center",
      "Self-Care":
        "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=300&h=300&fit=crop&crop=center",
      Educação:
        "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=300&fit=crop&crop=center",
      Fitness:
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop&crop=center",
      Tecnologia:
        "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=300&h=300&fit=crop&crop=center",
      "Mystery Box":
        "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=300&fit=crop&crop=center",
      "Premium / Raro":
        "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=300&h=300&fit=crop&crop=center",
      "Community Reward":
        "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=300&h=300&fit=crop&crop=center",
      "Charity / Good Deed":
        "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=300&h=300&fit=crop&crop=center",
    };
    return (
      imageMap[category] ||
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=300&fit=crop&crop=center"
    );
  };

  // Debug: log para verificar se as tasks estão sendo carregadas
  React.useEffect(() => {}, [tasks, stats]);

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

  const handleRedeemVoucher = (voucher: Voucher) => {
    if (stats.totalPoints < voucher.points) {
      Alert.alert(
        "Insufficient Points",
        `You need ${voucher.points} points to redeem this voucher. You currently have ${stats.totalPoints} points.`
      );
      return;
    }

    Alert.alert(
      "Redeem Voucher",
      `Are you sure you want to redeem "${voucher.title}" for ${voucher.points} points?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Redeem",
          onPress: async () => {
            const success = await redeemVoucher(voucher.points, {
              voucherId: voucher.id,
              title: voucher.title,
            });

            if (success) {
              Alert.alert(
                "Success!",
                `You have successfully redeemed "${voucher.title}"!`
              );
            } else {
              Alert.alert(
                "Error",
                "Failed to redeem voucher. Please try again."
              );
            }
          },
        },
      ]
    );
  };

  // Se o usuário não estiver autenticado, mostrar tela de login
  if (!authUser) {
    return (
      <View
        style={[
          styles.loginContainer,
          Platform.OS === "web" && styles.webLoginContainer,
        ]}
      >
        <Login />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header com add button */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Tasks List */}
      <View style={styles.tasksContainer}>
        {tasks.length === 0 ? (
          <View style={styles.emptyTasksContainer}>
            <Ionicons name="clipboard-outline" size={48} color="#666" />
            <Text style={styles.emptyTasksTitle}>Nenhuma tarefa ainda</Text>
            <Text style={styles.emptyTasksSubtitle}>
              Toque no botão + para adicionar sua primeira tarefa
            </Text>
          </View>
        ) : (
          tasks.slice(0, 5).map((task, index) => (
            <TouchableOpacity
              key={task.id}
              style={styles.taskItem}
              onPress={() => handleCompleteTask(task.id, task.points)}
            >
              <View style={styles.taskIcon}>
                <Ionicons 
                  name={
                    task.type === 'health' ? 'fitness-outline' :
                    task.type === 'study' ? 'book-outline' :
                    task.type === 'work' ? 'briefcase-outline' : 'checkmark-circle-outline'
                  } 
                  size={20} 
                  color="#fff" 
                />
              </View>
              <View style={styles.taskInfo}>
                <Text style={styles.taskTitle}>{task.title}</Text>
                <Text style={styles.taskPoints}>{task.points} points</Text>
              </View>
            </TouchableOpacity>
          ))
        )}
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

      {/* Featured Vouchers Section */}
      <View style={styles.featuredVouchersSection}>
        <Text style={styles.sectionTitle}>Featured Vouchers</Text>
        <ScrollView
          horizontal
          style={styles.featuredVouchersScroll}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.featuredVouchersContainer}
        >
          {featuredVouchers.map((voucher) => (
            <TouchableOpacity 
              key={voucher.id} 
              style={styles.featuredCard}
              onPress={() => handleRedeemVoucher(voucher)}
            >
              <View style={styles.featuredImageContainer}>
                <Image 
                  source={{ uri: getVoucherImage(voucher.category) }}
                  style={styles.featuredImage}
                  resizeMode="cover"
                />
              </View>
              <View style={styles.featuredInfo}>
                <Text style={styles.featuredTitle} numberOfLines={1}>{voucher.title}</Text>
                <Text style={styles.featuredPoints}>Redeem with {voucher.points} points</Text>
              </View>
            </TouchableOpacity>
          ))}
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
  webLoginContainer: {
    paddingHorizontal: 40,
    paddingVertical: 20,
  },
  container: {
    flex: 1,
    backgroundColor: "#25292e",
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 30,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  tasksContainer: {
    flex: 1,
    marginBottom: 30,
  },
  taskItem: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  taskIcon: {
    backgroundColor: "#3E4246",
    width: 48,
    height: 48,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  taskPoints: {
    color: "#99A1C2",
    fontSize: 14,
  },
  featuredVouchersSection: {
    marginBottom: 10,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  featuredVouchersScroll: {
    flexGrow: 0,
  },
  featuredVouchersContainer: {
    paddingRight: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#1a1a1a",
    padding: 24,
    borderRadius: 16,
    width: "90%",
    alignItems: "stretch",
  },
  modalTitle: {
    color: "#fff",
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
    backgroundColor: "#fff",
  },
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
    backgroundColor: "#fff",
  },
  typeText: {
    color: "#25292e",
    fontWeight: "bold",
  },
  saveButton: {
    backgroundColor: "#fff",
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
    borderColor: "#fff",
  },
  pointsText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  featuredCard: {
    width: 160,
    marginRight: 16,
    backgroundColor: "transparent",
  },
  featuredImageContainer: {
    width: "100%",
    height: 160,
    borderRadius: 16,
    overflow: "hidden",
  },
  featuredImage: {
    width: "100%",
    height: "100%",
    borderRadius: 16,
  },
  featuredInfo: {
    paddingTop: 12,
    paddingBottom: 8,
  },
  featuredTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 8,
  },
  featuredPoints: {
    fontSize: 14,
    color: "#99A1C2",
  },
  emptyTasksContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyTasksTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  emptyTasksSubtitle: {
    color: "#99A1C2",
    fontSize: 14,
    textAlign: "center",
    paddingHorizontal: 20,
  },
});
