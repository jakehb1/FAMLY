import { View, Text } from "react-native";
import { colors } from "@/constants/colors";

export default function DiscoverScreen() {
  return (
    <View
      className="flex-1 items-center justify-center"
      style={{ backgroundColor: colors.background }}
    >
      <Text className="text-2xl font-bold" style={{ color: colors.primary }}>
        Discover
      </Text>
      <Text className="mt-4" style={{ color: colors.muted }}>
        Find nearby families
      </Text>
    </View>
  );
}

