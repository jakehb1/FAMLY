import { View, Text } from "react-native";
import { useRouter } from "expo-router";
import Button from "@/components/ui/Button";

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-background px-6 justify-center">
      <View className="mb-12">
        <Text className="text-primary text-4xl font-bold mb-4">
          Welcome to Famly
        </Text>
        <Text className="text-muted text-lg leading-7">
          Connect with families in your neighborhood. Find playdate partners,
          make new friends, and build your local community.
        </Text>
      </View>

      <View className="mb-8 space-y-4">
        <View className="flex-row items-start">
          <View className="w-2 h-2 rounded-full bg-accent mt-2 mr-3" />
          <View className="flex-1">
            <Text className="text-primary text-base font-semibold mb-1">
              Trust & Safety First
            </Text>
            <Text className="text-muted text-sm">
              Verified families, privacy controls, and community moderation
            </Text>
          </View>
        </View>

        <View className="flex-row items-start">
          <View className="w-2 h-2 rounded-full bg-accent mt-2 mr-3" />
          <View className="flex-1">
            <Text className="text-primary text-base font-semibold mb-1">
              Local by Default
            </Text>
            <Text className="text-muted text-sm">
              Discover families nearby with privacy-respecting location sharing
            </Text>
          </View>
        </View>

        <View className="flex-row items-start">
          <View className="w-2 h-2 rounded-full bg-accent mt-2 mr-3" />
          <View className="flex-1">
            <Text className="text-primary text-base font-semibold mb-1">
              Quality Connections
            </Text>
            <Text className="text-muted text-sm">
              Meaningful relationships over quantity
            </Text>
          </View>
        </View>
      </View>

      <View className="space-y-3">
        <Button
          title="Get Started"
          onPress={() => router.push("/(onboarding)/create-family")}
          variant="primary"
        />
        <Text className="text-muted text-xs text-center">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </Text>
      </View>
    </View>
  );
}

