import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function ConversationScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View className="flex-1 items-center justify-center bg-background">
      <Text className="text-primary text-2xl font-bold">Conversation</Text>
      <Text className="text-muted mt-4">Conversation ID: {id}</Text>
      <Text className="text-muted mt-2">Chat view coming in Phase 3</Text>
    </View>
  );
}

