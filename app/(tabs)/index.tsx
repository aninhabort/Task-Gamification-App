import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SwipeListView } from 'react-native-swipe-list-view';
import TaskCard from "../components/TaskCard";
import VoucherCard from "../components/VoucherCard";

export interface TasksProps {
  title: string;
  points: number;
  type?: string;
}

export default function HomeScreen() {
  const [modalVisible, setModalVisible] = React.useState(false);
  const [taskTitle, setTaskTitle] = React.useState("");
  const [urgency, setUrgency] = React.useState("normal");
  const [taskType, setTaskType] = React.useState("study");
  const [tasks, setTasks] = React.useState<TasksProps[]>([]);

  function handleCompleteTask(idx: number) {
    setTasks(tasks => tasks.filter((_, i) => i !== idx));
  }

  function calculatePoints(urgency: string) {
    switch (urgency) {
      case "high": return 100;
      case "medium": return 50;
      default: return 20;
    }
  }

  function handleAddTask() {
    if (!taskTitle) return;
    const points = calculatePoints(urgency);
    setTasks([...tasks, { title: taskTitle, points, type: taskType }]);
    setTaskTitle("");
    setUrgency("normal");
    setTaskType("study");
    setModalVisible(false);
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
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
                style={[styles.urgencyButton, urgency === "normal" && { backgroundColor: '#ffd33d' }]}
                onPress={() => setUrgency("normal")}
              >
                <Text style={[styles.urgencyText, urgency === "normal" && { color: '#25292e' }]}>Normal</Text>
              </Pressable>
              <Pressable
                style={[styles.urgencyButton, urgency === "medium" && { backgroundColor: '#ff9800' }]}
                onPress={() => setUrgency("medium")}
              >
                <Text style={[styles.urgencyText, urgency === "medium" && { color: '#fff' }]}>Medium</Text>
              </Pressable>
              <Pressable
                style={[styles.urgencyButton, urgency === "high" && { backgroundColor: '#ff3b30' }]}
                onPress={() => setUrgency("high")}
              >
                <Text style={[styles.urgencyText, urgency === "high" && { color: '#fff' }]}>High</Text>
              </Pressable>
            </View>
            <Text style={styles.label}>Type:</Text>
            <View style={styles.typeContainer}>
              <Pressable
                style={[styles.typeButton, taskType === "health" && { backgroundColor: '#4BB543' }]}
                onPress={() => setTaskType("health")}
              >
                <Text style={[styles.typeText, taskType === "health" && { color: '#fff' }]}>Health</Text>
              </Pressable>
              <Pressable
                style={[styles.typeButton, taskType === "study" && { backgroundColor: '#2196f3' }]}
                onPress={() => setTaskType("study")}
              >
                <Text style={[styles.typeText, taskType === "study" && { color: '#fff' }]}>Study</Text>
              </Pressable>
              <Pressable
                style={[styles.typeButton, taskType === "work" && { backgroundColor: '#9c27b0' }]}
                onPress={() => setTaskType("work")}
              >
                <Text style={[styles.typeText, taskType === "work" && { color: '#fff' }]}>Work</Text>
              </Pressable>
            </View>

            <View style={styles.saveAndCancelButtonContainer}>
              <Pressable style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
              <Pressable style={styles.saveButton} onPress={handleAddTask}>
                <Text style={styles.saveButtonText}>Add</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
      <SwipeListView
        data={tasks}
        keyExtractor={(_, idx) => String(idx)}
        renderItem={({ item }) => (
          <TaskCard
            title={item.title}
            points={item.points}
            type={item.type}
          />
        )}
        renderHiddenItem={({ index }) => (
          <View style={styles.rowBack}>
            <TouchableOpacity style={styles.completeButton} onPress={() => handleCompleteTask(index)}>
              <Text style={styles.completeButtonText}>Concluir</Text>
            </TouchableOpacity>
          </View>
        )}
        rightOpenValue={-100}
        disableRightSwipe
        style={styles.tasksScroll}
  />

  <View style={styles.vouchersSection}>
        <Text style={styles.text}>Vouchers</Text>
        <ScrollView horizontal style={styles.vouchersScroll} showsHorizontalScrollIndicator={false}>
          <VoucherCard title="Discount Voucher" points={100} image="https://via.placeholder.com/150" />
          <VoucherCard title="Coffee Voucher" points={80} image="https://via.placeholder.com/150/ffd33d/25292e" />
          <VoucherCard title="Book Voucher" points={120} image="https://via.placeholder.com/150/353a40/ffd33d" />
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    justifyContent: 'flex-start',
    paddingTop: 60,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 16,
  },
  text: {
    color: '#fff',
    fontSize: 24,
    marginBottom: 24,
  },
  tasksScroll: {
    maxHeight: 440,
    marginBottom: 16,
  },
  vouchersSection: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 32,
  },
  vouchersScroll: {
    flexGrow: 0,
  },
  addButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#25292e',
    padding: 24,
    borderRadius: 16,
    width: '90%',
    alignItems: 'stretch',
  },
  modalTitle: {
    color: '#ffd33d',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#353a40',
    color: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  label: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 8,
  },
  urgencyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  urgencyButton: {
    backgroundColor: '#353a40',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  urgencySelected: {
    backgroundColor: '#ffd33d',
  },
  typeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  typeButton: {
    backgroundColor: '#353a40',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  typeSelected: {
    backgroundColor: '#ffd33d',
  },
  typeText: {
    color: '#25292e',
    fontWeight: 'bold',
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: '#4BB543',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingRight: 2,
    marginTop: 8,
    borderRadius: 12,
  },
  completeButton: {
    backgroundColor: '#4BB543',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  completeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  saveAndCancelButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
    gap: 16,
  },
  saveButton: {
    backgroundColor: '#ffd33d',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    width: 100,
  },
  saveButtonText: {
    color: '#25292e',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: '#353a40',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    width: 100,
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  button: {
    fontSize: 20,
    textDecorationLine: 'underline',
    color: '#fff'
  },
  urgencyText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#25292e',
    marginHorizontal: 8,
  }
});