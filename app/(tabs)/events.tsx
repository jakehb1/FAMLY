import { View, Text } from "react-native";
import { colors } from "@/constants/colors";

export default function EventsScreen() {
  return (
    <View
      className="flex-1 items-center justify-center"
      style={{ backgroundColor: colors.background }}
    >
      <Text className="text-2xl font-bold" style={{ color: colors.primary }}>
        Events
      </Text>
      <Text className="mt-4" style={{ color: colors.muted }}>
        Local family events (v1.1)
      </Text>
    </View>
  );
}

