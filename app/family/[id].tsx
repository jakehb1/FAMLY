import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function FamilyDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View className="flex-1 items-center justify-center bg-background">
      <Text className="text-primary text-2xl font-bold">Family Profile</Text>
      <Text className="text-muted mt-4">Family ID: {id}</Text>
      <Text className="text-muted mt-2">Detail view coming in Phase 2</Text>
    </View>
  );
}

