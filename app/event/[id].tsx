import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View className="flex-1 items-center justify-center bg-background">
      <Text className="text-primary text-2xl font-bold">Event</Text>
      <Text className="text-muted mt-4">Event ID: {id}</Text>
      <Text className="text-muted mt-2">Event view coming in v1.1</Text>
    </View>
  );
}

