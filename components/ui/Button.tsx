import { TouchableOpacity, Text, ActivityIndicator, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "@/constants/colors";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "accent";
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

export default function Button({
  title,
  onPress,
  variant = "primary",
  disabled = false,
  loading = false,
  className = "",
}: ButtonProps) {
  const getGradientColors = () => {
    switch (variant) {
      case "primary":
        return [colors.gradient.purple, colors.gradient.pink];
      case "secondary":
        return [colors.gradient.pink, colors.gradient.orange];
      case "accent":
        return [colors.gradient.orange, colors.gradient.yellow];
      default:
        return [colors.gradient.purple, colors.gradient.pink];
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      className={`rounded-2xl overflow-hidden ${
        disabled || loading ? "opacity-50" : ""
      } ${className}`}
      activeOpacity={0.8}
    >
      <View
        className="px-6 py-4 rounded-2xl"
        style={{
          borderWidth: 2,
          borderColor: variant === "primary" 
            ? colors.gradient.purple 
            : variant === "secondary"
            ? colors.gradient.pink
            : colors.gradient.orange,
          backgroundColor: disabled ? "transparent" : "transparent",
        }}
      >
        <View
          className="absolute inset-0 rounded-2xl"
          style={{
            backgroundColor: variant === "primary" 
              ? colors.gradient.purple 
              : variant === "secondary"
              ? colors.gradient.pink
              : colors.gradient.orange,
            opacity: 0.2,
          }}
        />
        <View className="items-center justify-center flex-row">
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Text className="text-white font-bold text-base">{title}</Text>
              <Text className="text-white ml-2 text-lg">→</Text>
            </>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

