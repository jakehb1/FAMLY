import { View, Text } from "react-native";
import { colors } from "@/constants/colors";

export default function ProfileScreen() {
  return (
    <View
      className="flex-1 items-center justify-center"
      style={{ backgroundColor: colors.background }}
    >
      <Text className="text-2xl font-bold" style={{ color: colors.primary }}>
        Profile
      </Text>
      <Text className="mt-4" style={{ color: colors.muted }}>
        Your family profile
      </Text>
    </View>
  );
}

