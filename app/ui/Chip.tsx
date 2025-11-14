import { Pressable, StyleSheet, Text, ViewStyle } from "react-native";

interface ChipProps {
  label: string;
  selected?: boolean;
  variant?: "default" | "urgency";
  onPress?: () => void;
  style?: ViewStyle;
}

export default function Chip({ 
  label, 
  selected = false, 
  variant = "default",
  style,
  onPress
}: ChipProps) {
  const getChipStyle = () => {
    const baseStyle = [styles.chip];
    
    if (selected) {
      if (variant === "urgency") {
        switch (label.toLowerCase()) {
          case "high":
            return [...baseStyle, styles.highUrgency];
          case "medium":
            return [...baseStyle, styles.mediumUrgency];
          default:
            return [...baseStyle, styles.normalUrgency];
        }
      }
      return [...baseStyle, styles.selected];
    }
    
    return [...baseStyle, styles.default];
  };

  const getTextStyle = () => {
    if (selected && variant === "urgency") {
      return styles.selectedText;
    }
    return selected ? styles.selectedText : styles.defaultText;
  };

  return (
    <Pressable style={[getChipStyle(), style]} onPress={onPress}>
      <Text style={getTextStyle()}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  
  // Default states
  default: {
    backgroundColor: "#353a40",
  },
  selected: {
    backgroundColor: "#fff",
  },
  
  // Urgency variants
  normalUrgency: {
    backgroundColor: "#ffd33d",
  },
  mediumUrgency: {
    backgroundColor: "#ff9800",
  },
  highUrgency: {
    backgroundColor: "#ff3b30",
  },
  
  // Text styles
  defaultText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  selectedText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#25292e",
  },
});