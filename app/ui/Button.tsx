import { StyleSheet, Text, TouchableOpacity, TouchableOpacityProps } from "react-native";

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: "primary" | "secondary" | "danger";
  size?: "small" | "medium" | "large";
}

export default function Button({
  title,
  variant = "primary",
  size = "medium",
  style,
  ...props
}: ButtonProps) {
  const getButtonStyle = () => {
    const baseStyle = [styles.button, styles[size]];
    
    switch (variant) {
      case "secondary":
        return [...baseStyle, styles.secondary];
      case "danger":
        return [...baseStyle, styles.danger];
      default:
        return [...baseStyle, styles.primary];
    }
  };

  const getTextStyle = () => {
    const baseStyle = [styles.text, styles[`${size}Text`]];
    
    switch (variant) {
      case "secondary":
        return [...baseStyle, styles.secondaryText];
      case "danger":
        return [...baseStyle, styles.dangerText];
      default:
        return [...baseStyle, styles.primaryText];
    }
  };

  return (
    <TouchableOpacity style={[getButtonStyle(), style]} {...props}>
      <Text style={getTextStyle()}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  
  // Sizes
  small: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  medium: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  large: {
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  
  // Variants
  primary: {
    backgroundColor: "#fff",
  },
  secondary: {
    backgroundColor: "#353a40",
  },
  danger: {
    backgroundColor: "#ff6b6b",
  },
  
  // Text styles
  text: {
    fontWeight: "bold",
  },
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
  },
  
  primaryText: {
    color: "#25292e",
  },
  secondaryText: {
    color: "#fff",
  },
  dangerText: {
    color: "#fff",
  },
});