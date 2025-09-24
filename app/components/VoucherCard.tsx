import { Image, StyleSheet, Text, View } from "react-native";

interface VoucherCardProps {
  title: string;
  points: number;
  image: string;
}

export default function VoucherCard({ title, points, image }: VoucherCardProps) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: image }} style={styles.image} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.points}>{points} pontos</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    width: 200,
  },
  image: {
    width: 140,
    height: 140,
    borderRadius: 16,
    marginBottom: 12,
    backgroundColor: '#ffd33d',
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  points: {
    color: '#ffd33d',
    fontSize: 16,
    marginTop: 4,
  },
});
