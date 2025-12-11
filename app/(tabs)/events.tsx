import { View, Text } from "react-native";

export default function EventsScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-background">
      <Text className="text-primary text-2xl font-bold">Events</Text>
      <Text className="text-muted mt-4">Local family events (v1.1)</Text>
    </View>
  );
}

