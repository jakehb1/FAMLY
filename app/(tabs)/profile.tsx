import { View, Text } from "react-native";

export default function ProfileScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-background">
      <Text className="text-primary text-2xl font-bold">Profile</Text>
      <Text className="text-muted mt-4">Your family profile</Text>
    </View>
  );
}

