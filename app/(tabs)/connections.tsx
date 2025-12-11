import { View, Text } from "react-native";

export default function ConnectionsScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-background">
      <Text className="text-primary text-2xl font-bold">Connections</Text>
      <Text className="text-muted mt-4">Your family connections</Text>
    </View>
  );
}

