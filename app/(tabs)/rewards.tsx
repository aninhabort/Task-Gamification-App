import { useRef, useState } from "react";
import {
  Alert,
  Animated,
  Modal,
  PanResponder,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useUserStatsContext } from "../../contexts/UserStatsContext";

interface Voucher {
  id: string;
  title: string;
  points: number;
  category: string;
  description: string;
}

// Componente para item com swipe
const SwipeableRewardItem = ({
  voucher,
  onAddToFeatured,
  onRedeem,
  stats,
}: {
  voucher: Voucher;
  onAddToFeatured: (voucher: Voucher) => void;
  onRedeem: (voucher: Voucher) => void;
  stats: any;
}) => {
  const pan = useRef(new Animated.Value(0)).current;
  const [showStarIcon, setShowStarIcon] = useState(false);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return Math.abs(gestureState.dx) > 20 && Math.abs(gestureState.dy) < 50;
      },
      onPanResponderGrant: () => {
        pan.setOffset((pan as any)._value);
      },
      onPanResponderMove: (evt, gestureState) => {
        if (gestureState.dx > 0) {
          // Only allow swipe to the right
          pan.setValue(gestureState.dx);
          setShowStarIcon(gestureState.dx > 60);
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        pan.flattenOffset();

        if (gestureState.dx > 80) {
          // Trigger add to featured
          Animated.spring(pan, {
            toValue: 0,
            useNativeDriver: false,
          }).start();
          setShowStarIcon(false);
          onAddToFeatured(voucher);
        } else {
          // Snap back
          Animated.spring(pan, {
            toValue: 0,
            useNativeDriver: false,
          }).start();
          setShowStarIcon(false);
        }
      },
    }),
  ).current;

  return (
    <View style={styles.swipeContainer}>
      {/* Background with star icon */}
      <View style={styles.swipeBackground}>
        <Animated.View
          style={[
            styles.starIconContainer,
            {
              opacity: showStarIcon ? 1 : 0,
              transform: [
                {
                  scale: showStarIcon ? 1 : 0.5,
                },
              ],
            },
          ]}
        >
          <Text style={styles.starIcon}>⭐</Text>
          <Text style={styles.starText}>Add to Featured</Text>
        </Animated.View>
      </View>

      {/* Main content */}
      <Animated.View
        style={[
          styles.rewardItem,
          {
            transform: [
              {
                translateX: pan,
              },
            ],
          },
        ]}
        {...panResponder.panHandlers}
      >
        <View style={styles.rewardIconContainer}>
          <Text style={styles.rewardIcon}>
            {voucher.category === "Café / Snack Break"
              ? "☕"
              : voucher.category === "Lazer"
                ? "🎬"
                : voucher.category === "Self-Care"
                  ? "💆"
                  : voucher.category === "Educação"
                    ? "📚"
                    : voucher.category === "Fitness"
                      ? "💪"
                      : voucher.category === "Tecnologia"
                        ? "💻"
                        : voucher.category === "Mystery Box"
                          ? "🎁"
                          : voucher.category === "Premium / Raro"
                            ? "💎"
                            : voucher.category === "Community Reward"
                              ? "🏆"
                              : voucher.category === "Charity / Good Deed"
                                ? "❤️"
                                : "🎁"}
          </Text>
        </View>
        <View style={styles.rewardContent}>
          <Text style={styles.rewardTitle}>{voucher.title}</Text>
          <Text style={styles.rewardPoints}>{voucher.points} points</Text>
        </View>
        <View style={styles.rewardActions}>
          <TouchableOpacity
            style={styles.featureButton}
            onPress={() => onAddToFeatured(voucher)}
          >
            <Text style={styles.featureButtonText}>⭐</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.redeemButton,
              stats.totalPoints < voucher.points && styles.redeemButtonDisabled,
            ]}
            onPress={() => onRedeem(voucher)}
            disabled={stats.totalPoints < voucher.points}
          >
            <Text
              style={[
                styles.redeemButtonText,
                stats.totalPoints < voucher.points &&
                  styles.redeemButtonTextDisabled,
              ]}
            >
              Redeem
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
};

export default function RewardScreen() {
  const { stats, redeemVoucher } = useUserStatsContext();

  const [showAddModal, setShowAddModal] = useState(false);
  const [voucherTitle, setVoucherTitle] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState("Café / Snack Break");

  const [featuredVouchers, setFeaturedVouchers] = useState<Voucher[]>([
    {
      id: "featured-1",
      title: "Mystery Box Especial",
      points: 1000,
      category: "Mystery Box",
      description:
        "Voucher aleatório (qualquer categoria) - Pode vir algo comum ou raro",
    },
    {
      id: "featured-2",
      title: "Experiência Premium",
      points: 2000,
      category: "Premium / Raro",
      description: "Voucher grande, experiência, assinatura anual",
    },
    {
      id: "featured-3",
      title: "Spa Day",
      points: 500,
      category: "Self-Care",
      description: "Voucher de skincare, massagem, produto de beleza",
    },
    {
      id: "featured-4",
      title: "Curso Online Premium",
      points: 700,
      category: "Educação",
      description: "Ebook, curso curto, desconto em app de estudo",
    },
  ]);

  const [allVouchers, setAllVouchers] = useState<Voucher[]>([
    {
      id: "1",
      title: "Voucher de café",
      points: 150,
      category: "Café / Snack Break",
      description: "Voucher de café, doce, ou snack",
    },
    {
      id: "2",
      title: "Aluguel de filme",
      points: 300,
      category: "Lazer",
      description: "Aluguel de filme, assinatura curta, item digital",
    },
    {
      id: "3",
      title: "Produto de beleza",
      points: 500,
      category: "Self-Care",
      description: "Voucher de skincare, massagem, produto de beleza",
    },
    {
      id: "4",
      title: "Curso online",
      points: 700,
      category: "Educação",
      description: "Ebook, curso curto, desconto em app de estudo",
    },
  ]);

  const handleRedeemVoucher = (voucher: Voucher) => {
    if (stats.totalPoints < voucher.points) {
      Alert.alert(
        "Insufficient Points",
        `You need ${voucher.points} points to redeem this voucher. You currently have ${stats.totalPoints} points.`,
      );
      return;
    }

    Alert.alert(
      "Redeem Voucher",
      `Are you sure you want to redeem "${voucher.title}" for ${voucher.points}?`,
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
                `You have successfully redeemed "${voucher.title}"!`,
              );
            } else {
              Alert.alert(
                "Error",
                "Failed to redeem voucher. Please try again.",
              );
            }
          },
        },
      ],
    );
  };

  const calculateVoucherPoints = (category: string, title: string): number => {
    const basePoints = {
      "Café / Snack Break": 150,
      Lazer: 300,
      "Self-Care": 500,
      Educação: 700,
      Fitness: 900,
      Tecnologia: 1200,
      "Mystery Box": 1000,
      "Premium / Raro": 2000,
      "Community Reward": 100,
      "Charity / Good Deed": 300,
    };

    return basePoints[category as keyof typeof basePoints] || 150;
  };

  const addNewVoucher = () => {
    setShowAddModal(true);
  };

  const handleCreateVoucher = () => {
    if (!voucherTitle.trim()) {
      Alert.alert("Error", "Please enter a voucher title");
      return;
    }

    createVoucher(voucherTitle.trim(), selectedCategory);
    setShowAddModal(false);
    setVoucherTitle("");
    setSelectedCategory("Café / Snack Break");
  };

  const createVoucher = (title: string, category: string) => {
    const points = calculateVoucherPoints(category, title);
    const newVoucher: Voucher = {
      id: Date.now().toString(),
      title: title.trim(),
      points,
      category,
      description: `${title} - ${category} voucher worth ${points} points`,
    };

    setAllVouchers((prev) => [...prev, newVoucher]);

    Alert.alert(
      "Voucher Created!",
      `"${title}" has been added with ${points} points based on the ${category} category.`,
    );
  };

  const addToFeatured = (voucher: Voucher) => {
    // Check if voucher is already featured
    const isAlreadyFeatured = featuredVouchers.some(
      (fv) => fv.id === voucher.id,
    );

    if (isAlreadyFeatured) {
      Alert.alert(
        "Already Featured",
        "This voucher is already in the Featured section!",
      );
      return;
    }

    // Limit featured vouchers to 6
    if (featuredVouchers.length >= 6) {
      Alert.alert(
        "Featured Limit Reached",
        "You can only have 6 featured vouchers. Remove one first to add a new one.",
      );
      return;
    }

    setFeaturedVouchers((prev) => [
      ...prev,
      { ...voucher, id: `featured-${voucher.id}` },
    ]);

    Alert.alert(
      "Added to Featured!",
      `"${voucher.title}" has been added to the Featured section.`,
    );
  };

  const removeFromFeatured = (voucherId: string) => {
    Alert.alert(
      "Remove from Featured",
      "Are you sure you want to remove this voucher from the Featured section?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            setFeaturedVouchers((prev) =>
              prev.filter((v) => v.id !== voucherId),
            );
            Alert.alert("Removed!", "Voucher removed from Featured section.");
          },
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Featured Section */}
        <View style={styles.featuredSection}>
          <Text style={styles.featuredTitle}>Featured</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.featuredContent}
          >
            {featuredVouchers.map((voucher) => (
              <TouchableOpacity
                key={voucher.id}
                style={styles.featuredCard}
                onPress={() => handleRedeemVoucher(voucher)}
              >
                <View style={styles.featuredImageContainer}>
                  <Text style={styles.featuredImageText}>
                    {voucher.category === "Café / Snack Break"
                      ? "☕"
                      : voucher.category === "Lazer"
                        ? "🎬"
                        : voucher.category === "Self-Care"
                          ? "💆"
                          : voucher.category === "Educação"
                            ? "📚"
                            : voucher.category === "Fitness"
                              ? "💪"
                              : voucher.category === "Tecnologia"
                                ? "💻"
                                : voucher.category === "Mystery Box"
                                  ? "🎁"
                                  : voucher.category === "Premium / Raro"
                                    ? "💎"
                                    : voucher.category === "Community Reward"
                                      ? "🏆"
                                      : voucher.category ===
                                          "Charity / Good Deed"
                                        ? "❤️"
                                        : "🎁"}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.removeFeaturedButton}
                  onPress={() => removeFromFeatured(voucher.id)}
                >
                  <Text style={styles.removeFeaturedText}>✕</Text>
                </TouchableOpacity>
                <View style={styles.featuredInfo}>
                  <Text style={styles.featuredPoints}>{voucher.title}</Text>
                  <Text style={styles.featuredLabel}>
                    {voucher.points} points
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* All Rewards Section */}
        <View style={styles.allRewardsSection}>
          <View style={styles.allRewardsHeader}>
            <Text style={styles.allRewardsTitle}>All Rewards</Text>
            <TouchableOpacity style={styles.addButton} onPress={addNewVoucher}>
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
          </View>

          {allVouchers.map((voucher) => (
            <SwipeableRewardItem
              key={voucher.id}
              voucher={voucher}
              onAddToFeatured={addToFeatured}
              onRedeem={handleRedeemVoucher}
              stats={stats}
            />
          ))}
        </View>
      </ScrollView>

      {/* Add Voucher Modal */}
      <Modal
        visible={showAddModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View
          style={styles.modalOverlay}
          pointerEvents="box-none"
          accessible={false}
        >
          <View style={styles.modalContainer} accessible={true}>
            <Text style={styles.modalTitle}>Add New Voucher</Text>

            <Text style={styles.modalLabel}>Title:</Text>
            <TextInput
              style={styles.modalInput}
              value={voucherTitle}
              onChangeText={setVoucherTitle}
              placeholder="Enter voucher title"
              placeholderTextColor="#888"
            />

            <Text style={styles.modalLabel}>Category:</Text>
            <View style={styles.categoryContainer}>
              <Pressable
                style={[
                  styles.categoryButton,
                  selectedCategory === "Café / Snack Break" &&
                    styles.categorySelected,
                ]}
                onPress={() => setSelectedCategory("Café / Snack Break")}
              >
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategory === "Café / Snack Break" &&
                      styles.categoryTextSelected,
                  ]}
                >
                  Café / Snack Break
                </Text>
                <Text
                  style={[
                    styles.categoryPoints,
                    selectedCategory === "Café / Snack Break" &&
                      styles.categoryPointsSelected,
                  ]}
                >
                  150 pts
                </Text>
              </Pressable>

              <Pressable
                style={[
                  styles.categoryButton,
                  selectedCategory === "Lazer" && styles.categorySelected,
                ]}
                onPress={() => setSelectedCategory("Lazer")}
              >
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategory === "Lazer" && styles.categoryTextSelected,
                  ]}
                >
                  Lazer
                </Text>
                <Text
                  style={[
                    styles.categoryPoints,
                    selectedCategory === "Lazer" &&
                      styles.categoryPointsSelected,
                  ]}
                >
                  300 pts
                </Text>
              </Pressable>

              <Pressable
                style={[
                  styles.categoryButton,
                  selectedCategory === "Self-Care" && styles.categorySelected,
                ]}
                onPress={() => setSelectedCategory("Self-Care")}
              >
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategory === "Self-Care" &&
                      styles.categoryTextSelected,
                  ]}
                >
                  Self-Care
                </Text>
                <Text
                  style={[
                    styles.categoryPoints,
                    selectedCategory === "Self-Care" &&
                      styles.categoryPointsSelected,
                  ]}
                >
                  500 pts
                </Text>
              </Pressable>

              <Pressable
                style={[
                  styles.categoryButton,
                  selectedCategory === "Educação" && styles.categorySelected,
                ]}
                onPress={() => setSelectedCategory("Educação")}
              >
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategory === "Educação" &&
                      styles.categoryTextSelected,
                  ]}
                >
                  Educação
                </Text>
                <Text
                  style={[
                    styles.categoryPoints,
                    selectedCategory === "Educação" &&
                      styles.categoryPointsSelected,
                  ]}
                >
                  700 pts
                </Text>
              </Pressable>

              <Pressable
                style={[
                  styles.categoryButton,
                  selectedCategory === "Fitness" && styles.categorySelected,
                ]}
                onPress={() => setSelectedCategory("Fitness")}
              >
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategory === "Fitness" &&
                      styles.categoryTextSelected,
                  ]}
                >
                  Fitness
                </Text>
                <Text
                  style={[
                    styles.categoryPoints,
                    selectedCategory === "Fitness" &&
                      styles.categoryPointsSelected,
                  ]}
                >
                  900 pts
                </Text>
              </Pressable>

              <Pressable
                style={[
                  styles.categoryButton,
                  selectedCategory === "Tecnologia" && styles.categorySelected,
                ]}
                onPress={() => setSelectedCategory("Tecnologia")}
              >
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategory === "Tecnologia" &&
                      styles.categoryTextSelected,
                  ]}
                >
                  Tecnologia
                </Text>
                <Text
                  style={[
                    styles.categoryPoints,
                    selectedCategory === "Tecnologia" &&
                      styles.categoryPointsSelected,
                  ]}
                >
                  1200 pts
                </Text>
              </Pressable>

              <Pressable
                style={[
                  styles.categoryButton,
                  selectedCategory === "Mystery Box" && styles.categorySelected,
                ]}
                onPress={() => setSelectedCategory("Mystery Box")}
              >
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategory === "Mystery Box" &&
                      styles.categoryTextSelected,
                  ]}
                >
                  Mystery Box
                </Text>
                <Text
                  style={[
                    styles.categoryPoints,
                    selectedCategory === "Mystery Box" &&
                      styles.categoryPointsSelected,
                  ]}
                >
                  1000 pts
                </Text>
              </Pressable>

              <Pressable
                style={[
                  styles.categoryButton,
                  selectedCategory === "Premium / Raro" &&
                    styles.categorySelected,
                ]}
                onPress={() => setSelectedCategory("Premium / Raro")}
              >
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategory === "Premium / Raro" &&
                      styles.categoryTextSelected,
                  ]}
                >
                  Premium / Raro
                </Text>
                <Text
                  style={[
                    styles.categoryPoints,
                    selectedCategory === "Premium / Raro" &&
                      styles.categoryPointsSelected,
                  ]}
                >
                  2000 pts
                </Text>
              </Pressable>

              <Pressable
                style={[
                  styles.categoryButton,
                  selectedCategory === "Community Reward" &&
                    styles.categorySelected,
                ]}
                onPress={() => setSelectedCategory("Community Reward")}
              >
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategory === "Community Reward" &&
                      styles.categoryTextSelected,
                  ]}
                >
                  Community Reward
                </Text>
                <Text
                  style={[
                    styles.categoryPoints,
                    selectedCategory === "Community Reward" &&
                      styles.categoryPointsSelected,
                  ]}
                >
                  100 pts
                </Text>
              </Pressable>

              <Pressable
                style={[
                  styles.categoryButton,
                  selectedCategory === "Charity / Good Deed" &&
                    styles.categorySelected,
                ]}
                onPress={() => setSelectedCategory("Charity / Good Deed")}
              >
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategory === "Charity / Good Deed" &&
                      styles.categoryTextSelected,
                  ]}
                >
                  Charity / Good Deed
                </Text>
                <Text
                  style={[
                    styles.categoryPoints,
                    selectedCategory === "Charity / Good Deed" &&
                      styles.categoryPointsSelected,
                  ]}
                >
                  300 pts
                </Text>
              </Pressable>
            </View>

            <View style={styles.modalButtons}>
              <Pressable
                style={styles.modalSaveButton}
                onPress={handleCreateVoucher}
              >
                <Text style={styles.modalSaveButtonText}>Create</Text>
              </Pressable>
              <Pressable
                style={styles.modalCancelButton}
                onPress={() => {
                  setShowAddModal(false);
                  setVoucherTitle("");
                  setSelectedCategory("Café / Snack Break");
                }}
              >
                <Text style={styles.modalCancelButtonText}>Cancel</Text>
              </Pressable>
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
  },
  featuredSection: {
    paddingHorizontal: 28,
    marginBottom: 40,
  },
  featuredTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
  },
  featuredContent: {
    paddingRight: 28,
  },
  featuredCard: {
    width: 180,
    height: 220,
    backgroundColor: "#D4B896",
    borderRadius: 16,
    marginRight: 16,
    overflow: "hidden",
  },
  featuredImageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#D4B896",
  },
  featuredImageText: {
    fontSize: 40,
  },
  featuredInfo: {
    padding: 16,
    backgroundColor: "#D4B896",
  },
  featuredPoints: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#25292e",
    marginBottom: 4,
  },
  featuredLabel: {
    fontSize: 14,
    color: "#25292e",
  },
  allRewardsSection: {
    paddingHorizontal: 28,
    paddingBottom: 40,
  },
  allRewardsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  allRewardsTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ffd33d",
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#25292e",
  },
  rewardItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#353a40",
    borderRadius: 12,
    padding: 16,
  },
  rewardIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: "#D4B896",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  rewardIcon: {
    fontSize: 24,
  },
  rewardContent: {
    flex: 1,
  },
  rewardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 4,
  },
  rewardPoints: {
    fontSize: 14,
    color: "#888",
  },
  redeemButton: {
    backgroundColor: "#ffd33d",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
  redeemButtonDisabled: {
    backgroundColor: "#666",
  },
  redeemButtonText: {
    color: "#25292e",
    fontSize: 14,
    fontWeight: "600",
  },
  redeemButtonTextDisabled: {
    color: "#999",
  },
  rewardActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  featureButton: {
    backgroundColor: "#4a5568",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  featureButtonText: {
    fontSize: 18,
    color: "#ffd33d",
  },
  removeFeaturedButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  removeFeaturedText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  scrollView: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#353a40",
    borderRadius: 16,
    padding: 24,
    width: "90%",
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 24,
  },
  modalLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 8,
  },
  modalInput: {
    backgroundColor: "#25292e",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#fff",
    marginBottom: 20,
  },
  categoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  categoryButton: {
    backgroundColor: "#25292e",
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 12,
    width: "48%",
    alignItems: "center",
  },
  categorySelected: {
    backgroundColor: "#ffd33d",
  },
  categoryText: {
    fontSize: 13,
    color: "#fff",
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 4,
  },
  categoryTextSelected: {
    color: "#25292e",
  },
  categoryPoints: {
    fontSize: 11,
    color: "#888",
    fontWeight: "400",
    textAlign: "center",
  },
  categoryPointsSelected: {
    color: "#25292e",
    opacity: 0.8,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  modalSaveButton: {
    backgroundColor: "#ffd33d",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1,
    alignItems: "center",
  },
  modalSaveButtonText: {
    color: "#25292e",
    fontSize: 16,
    fontWeight: "600",
  },
  modalCancelButton: {
    backgroundColor: "#666",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    flex: 1,
    alignItems: "center",
  },
  modalCancelButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  swipeContainer: {
    position: "relative",
    marginBottom: 12,
  },
  swipeBackground: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: "#2d6a4f",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "flex-start",
    paddingLeft: 20,
  },
  starIconContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  starIcon: {
    fontSize: 24,
    color: "#ffd33d",
  },
  starText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});
