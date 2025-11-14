import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Alert, Image, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useFeaturedVouchers } from "../../contexts/FeaturedVouchersContext";
import { useUserStatsContext } from "../../contexts/UserStatsContext";

interface Voucher {
  id: string;
  title: string;
  points: number;
  category: string;
  description: string;
}

export default function RewardScreen() {
  const { stats, redeemVoucher } = useUserStatsContext();
  const { featuredVouchers } = useFeaturedVouchers();
  
  // Estados do modal
  const [modalVisible, setModalVisible] = useState(false);
  const [newVoucherTitle, setNewVoucherTitle] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Café / Snack Break");
  const [allVouchers, setAllVouchers] = useState<Voucher[]>([
    { id: '1', title: 'Mystery Box Especial', points: 1000, category: 'Mystery Box', description: 'Voucher aleatório (qualquer categoria) - Pode vir algo comum ou raro' },
    { id: '2', title: 'Comprar 1 Livro', points: 300, category: 'Educação', description: 'Voucher para compra de um livro físico ou digital' },
    { id: '3', title: 'Spa Day', points: 500, category: 'Self-Care', description: 'Voucher de skincare, massagem, produto de beleza' },
    { id: '4', title: 'Free Coffee', points: 100, category: 'Café / Snack Break', description: 'Voucher para café grátis' },
    { id: '5', title: 'Cinema Ticket', points: 250, category: 'Lazer', description: 'Ingresso de cinema para um filme' },
    { id: '6', title: 'Gym Day Pass', points: 150, category: 'Fitness', description: 'Passe de um dia na academia' }
  ]);
  
  // Valores de pontos por categoria
  const categoryPoints: Record<string, number> = {
    'Café / Snack Break': 100,
    'Lazer': 250,
    'Self-Care': 500,
    'Educação': 300,
    'Fitness': 150,
    'Tecnologia': 800,
    'Mystery Box': 1000,
    'Premium / Raro': 2000,
    'Community Reward': 150,
    'Charity / Good Deed': 200
  };
  
  const categories = Object.keys(categoryPoints);

  // Função para gerar imagem baseada na categoria
  const getVoucherImage = (category: string) => {
    const imageMap: Record<string, string> = {
      'Café / Snack Break': 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=300&h=300&fit=crop&crop=center',
      'Lazer': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop&crop=center',
      'Self-Care': 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=300&h=300&fit=crop&crop=center',
      'Educação': 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=300&fit=crop&crop=center',
      'Fitness': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop&crop=center',
      'Tecnologia': 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=300&h=300&fit=crop&crop=center',
      'Mystery Box': 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=300&fit=crop&crop=center',
      'Premium / Raro': 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=300&h=300&fit=crop&crop=center',
      'Community Reward': 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=300&h=300&fit=crop&crop=center',
      'Charity / Good Deed': 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=300&h=300&fit=crop&crop=center'
    };
    return imageMap[category] || 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=300&fit=crop&crop=center';
  };

  const handleAddVoucher = () => {
    if (!newVoucherTitle.trim()) {
      Alert.alert("Error", "Please enter a voucher title");
      return;
    }

    const newVoucher: Voucher = {
      id: Date.now().toString(),
      title: newVoucherTitle.trim(),
      points: categoryPoints[selectedCategory],
      category: selectedCategory,
      description: `Voucher for ${newVoucherTitle.trim()}`
    };

    setAllVouchers(prev => [...prev, newVoucher]);
    setNewVoucherTitle("");
    setModalVisible(false);
    
    Alert.alert(
      "Success!",
      `"${newVoucher.title}" has been added to the rewards list with ${newVoucher.points} points.`
    );
  };

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

  return (
    <View style={styles.container}>
      {/* Featured Section */}
      <View style={styles.featuredSection}>
        <View style={styles.featuredHeader}>
          <Text style={styles.featuredTitle}>Featured</Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => setModalVisible(true)}
          >
            <Ionicons name="add" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.featuredContainer}
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
                <Text style={styles.featuredCardTitle} numberOfLines={1}>{voucher.title}</Text>
                <Text style={styles.featuredCardPoints}>{voucher.points} points</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* All Rewards Section */}
      <View style={styles.allRewardsSection}>
        <Text style={styles.allRewardsTitle}>All Rewards</Text>
        
        <ScrollView showsVerticalScrollIndicator={false}>
          {allVouchers.map((voucher) => (
            <View key={voucher.id} style={styles.rewardItem}>
              <View style={styles.rewardIconContainer}>
                <Image 
                  source={{ uri: getVoucherImage(voucher.category) }}
                  style={styles.rewardIcon}
                  resizeMode="cover"
                />
              </View>
              <View style={styles.rewardInfo}>
                <Text style={styles.rewardTitle}>{voucher.title}</Text>
                <Text style={styles.rewardPoints}>{voucher.points} points</Text>
              </View>
              <TouchableOpacity 
                style={[styles.redeemButton, stats.totalPoints < voucher.points && styles.redeemButtonDisabled]}
                onPress={() => handleRedeemVoucher(voucher)}
                disabled={stats.totalPoints < voucher.points}
              >
                <Text style={[styles.redeemButtonText, stats.totalPoints < voucher.points && styles.redeemButtonTextDisabled]}>
                  Redeem
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Add Voucher Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Voucher</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Voucher Title</Text>
              <TextInput
                style={styles.textInput}
                value={newVoucherTitle}
                onChangeText={setNewVoucherTitle}
                placeholder="Enter voucher title..."
                placeholderTextColor="#888"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Category ({categoryPoints[selectedCategory]} points)</Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.categoryScroll}
              >
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.categoryChip,
                      selectedCategory === category && styles.categoryChipSelected
                    ]}
                    onPress={() => setSelectedCategory(category)}
                  >
                    <Text style={[
                      styles.categoryChipText,
                      selectedCategory === category && styles.categoryChipTextSelected
                    ]}>
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
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
                style={styles.addVoucherButton}
                onPress={handleAddVoucher}
              >
                <Text style={styles.addVoucherButtonText}>Add Voucher</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  featuredSection: {
    marginBottom: 40,
  },
  featuredHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },
  featuredTitle: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
  },
  featuredContainer: {
    paddingRight: 20,
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
  featuredCardPoints: {
    fontSize: 14,
    color: "#99A1C2",
  },
  featuredCardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 8,
  },
  allRewardsSection: {
    flex: 1,
  },
  allRewardsTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  rewardItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  rewardIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    overflow: "hidden",
    marginRight: 20,
    backgroundColor: "#E8D5C4",
  },
  rewardIcon: {
    width: "100%",
    height: "100%",
  },
  rewardInfo: {
    flex: 1,
  },
  rewardTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  rewardPoints: {
    color: "#888",
    fontSize: 14,
  },
  redeemButton: {
    backgroundColor: "#333",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginLeft: 10,
  },
  redeemButtonDisabled: {
    backgroundColor: "#333",
  },
  redeemButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  redeemButtonTextDisabled: {
    color: "#666",
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
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
  addVoucherButton: {
    flex: 1,
    backgroundColor: "#fff",
    paddingVertical: 12,
    borderRadius: 8,
    marginLeft: 8,
  },
  addVoucherButtonText: {
    color: "#1a1a1a",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});