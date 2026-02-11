import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useUserStatsContext } from "../../contexts/UserStatsContext";

interface VoucherCardProps {
  title: string;
  points: number;
  image?: string;
  emoji?: string;
  compact?: boolean;
  voucherId?: string;
}

export default function VoucherCard({
  title,
  points,
  image,
  emoji = "🎁",
  compact = false,
  voucherId = title.toLowerCase().replace(/\s+/g, "-"),
}: VoucherCardProps) {
  const { stats, redeemVoucher } = useUserStatsContext();

  const handleRedeem = () => {
    if (stats.totalPoints < points) {
      Alert.alert(
        "Insufficient Points",
        `You need ${points} points to redeem this voucher. You currently have ${stats.totalPoints} points.`,
      );
      return;
    }

    Alert.alert(
      "Redeem Voucher",
      `Are you sure you want to redeem "${title}" for ${points} points?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Redeem",
          onPress: async () => {
            const success = await redeemVoucher(points, { voucherId, title });
            if (success) {
              Alert.alert(
                "Success!",
                `You have successfully redeemed "${title}"! Remaining points: ${
                  stats.totalPoints - points
                }`,
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

  const canAfford = stats.totalPoints >= points;

  if (compact) {
    return (
      <View style={styles.compactCard}>
        <View style={styles.compactImageContainer}>
          <Text style={styles.compactEmoji}>{emoji}</Text>
        </View>
        <View style={styles.compactContent}>
          <Text style={styles.compactTitle}>{title}</Text>
          <Text style={styles.compactPoints}>{points} pts</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <Text style={styles.emoji}>{emoji}</Text>
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.points}>{points} pontos</Text>
      <TouchableOpacity
        style={[styles.redeemButton, !canAfford && styles.redeemButtonDisabled]}
        onPress={handleRedeem}
        disabled={!canAfford}
      >
        <Text
          style={[
            styles.redeemButtonText,
            !canAfford && styles.redeemButtonTextDisabled,
          ]}
        >
          {canAfford ? "Redeem" : "Not enough points"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    width: 200,
    padding: 12,
  },
  imageContainer: {
    width: 140,
    height: 140,
    borderRadius: 16,
    marginBottom: 12,
    backgroundColor: "#ffd33d",
    justifyContent: "center",
    alignItems: "center",
  },
  emoji: {
    fontSize: 60,
  },
  title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  points: {
    color: "#ffd33d",
    fontSize: 16,
    marginTop: 4,
    marginBottom: 12,
  },
  redeemButton: {
    backgroundColor: "#ffd33d",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    minWidth: 120,
  },
  redeemButtonDisabled: {
    backgroundColor: "#353a40",
  },
  redeemButtonText: {
    color: "#25292e",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
  redeemButtonTextDisabled: {
    color: "#aaa",
  },
  compactCard: {
    flexDirection: "row",
    alignItems: "center",
    width: 140,
    backgroundColor: "#353a40",
    borderRadius: 12,
    padding: 8,
  },
  compactImageContainer: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: "#ffd33d",
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  compactEmoji: {
    fontSize: 28,
  },
  compactContent: {
    flex: 1,
  },
  compactTitle: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 2,
  },
  compactPoints: {
    color: "#ffd33d",
    fontSize: 12,
    fontWeight: "bold",
  },
});
