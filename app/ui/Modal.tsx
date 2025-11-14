import { Ionicons } from "@expo/vector-icons";
import { Modal, ModalProps, Pressable, StyleSheet, Text, View } from "react-native";

interface CustomModalProps extends ModalProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

export default function CustomModal({
  title,
  onClose,
  children,
  visible,
  ...props
}: CustomModalProps) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
      {...props}
    >
      <View style={styles.overlay}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <Pressable style={styles.closeButton} onPress={onClose}>
              <Ionicons name="close" size={24} color="#fff" />
            </Pressable>
          </View>
          <View style={styles.body}>{children}</View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(37, 41, 46, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    backgroundColor: "#25292e",
    borderRadius: 16,
    width: "90%",
    maxWidth: 400,
    maxHeight: "80%",
    borderWidth: 1,
    borderColor: "#353a40",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#353a40",
  },
  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  closeButton: {
    padding: 4,
  },
  body: {
    padding: 24,
  },
});