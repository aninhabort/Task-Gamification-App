import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import {
  Alert,
  Image,
  Modal,
  Platform,
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
import { EmptyState } from "../ui";


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
          <EmptyState
            icon="clipboard-outline"
            title="No tasks yet"
            subtitle="Tap the + button to add your first task"
          />
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
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>New Task</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                value={taskTitle}
                onChangeText={setTaskTitle}
                placeholder="Enter your task here..."
                placeholderTextColor="#888"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Urgency ({calculatePoints(urgency)} points)</Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.categoryScroll}
              >
                <TouchableOpacity
                  style={[
                    styles.categoryChip,
                    urgency === "normal" && styles.categoryChipSelected
                  ]}
                  onPress={() => setUrgency("normal")}
                >
                  <Text style={[
                    styles.categoryChipText,
                    urgency === "normal" && styles.categoryChipTextSelected
                  ]}>
                    Normal
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.categoryChip,
                    urgency === "medium" && styles.categoryChipSelected
                  ]}
                  onPress={() => setUrgency("medium")}
                >
                  <Text style={[
                    styles.categoryChipText,
                    urgency === "medium" && styles.categoryChipTextSelected
                  ]}>
                    Medium
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.categoryChip,
                    urgency === "high" && styles.categoryChipSelected
                  ]}
                  onPress={() => setUrgency("high")}
                >
                  <Text style={[
                    styles.categoryChipText,
                    urgency === "high" && styles.categoryChipTextSelected
                  ]}>
                    High
                  </Text>
                </TouchableOpacity>
              </ScrollView>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Category</Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.categoryScroll}
              >
                <TouchableOpacity
                  style={[
                    styles.categoryChip,
                    taskType === "health" && styles.categoryChipSelected
                  ]}
                  onPress={() => setTaskType("health")}
                >
                  <Text style={[
                    styles.categoryChipText,
                    taskType === "health" && styles.categoryChipTextSelected
                  ]}>
                    Health
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.categoryChip,
                    taskType === "study" && styles.categoryChipSelected
                  ]}
                  onPress={() => setTaskType("study")}
                >
                  <Text style={[
                    styles.categoryChipText,
                    taskType === "study" && styles.categoryChipTextSelected
                  ]}>
                    Study
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.categoryChip,
                    taskType === "work" && styles.categoryChipSelected
                  ]}
                  onPress={() => setTaskType("work")}
                >
                  <Text style={[
                    styles.categoryChipText,
                    taskType === "work" && styles.categoryChipTextSelected
                  ]}>
                    Work
                  </Text>
                </TouchableOpacity>
              </ScrollView>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.addTaskButton}
                onPress={handleAddTask}
              >
                <Text style={styles.addTaskButtonText}>Add Task</Text>
              </TouchableOpacity>
            </View>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#2a2a2a",
    borderRadius: 16,
    padding: 24,
    width: "90%",
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  modalTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: "#1a1a1a",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#fff",
    borderWidth: 1,
    borderColor: "#444",
  },
  categoryScroll: {
    maxHeight: 50,
  },
  categoryChip: {
    backgroundColor: "#1a1a1a",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#444",
  },
  categoryChipSelected: {
    backgroundColor: "#fff",
    borderColor: "#fff",
  },
  categoryChipText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
  },
  categoryChipTextSelected: {
    color: "#1a1a1a",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#444",
    paddingVertical: 12,
    borderRadius: 8,
    marginRight: 8,
  },
  cancelButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  addTaskButton: {
    flex: 1,
    backgroundColor: "#fff",
    paddingVertical: 12,
    borderRadius: 8,
    marginLeft: 8,
  },
  addTaskButtonText: {
    color: "#1a1a1a",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },

});
