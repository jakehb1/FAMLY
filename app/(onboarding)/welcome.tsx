import { View, Text } from "react-native";
import { useRouter } from "expo-router";
import { colors } from "@/constants/colors";
import Button from "@/components/ui/Button";

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 px-6 justify-center" style={{ backgroundColor: colors.background }}>
      <View className="mb-12">
        <Text className="text-primary text-5xl font-bold mb-6 text-center">
          Welcome to Famly
        </Text>
        {/* Wavy decorative line */}
        <View
          className="w-40 h-1 rounded-full mb-6 self-center"
          style={{
            backgroundColor: "transparent",
            backgroundImage: "linear-gradient(90deg, #8B5CF6 0%, #EC4899 50%, #F97316 100%)",
          }}
        />
        <Text className="text-muted text-lg leading-7 text-center">
          Connect with families in your neighborhood. Find playdate partners,
          make new friends, and build your local community.
        </Text>
      </View>

      <View className="mb-8">
        {[
          {
            title: "Trust & Safety First",
            description: "Verified families, privacy controls, and community moderation",
            gradient: [colors.gradient.purple, colors.gradient.pink],
          },
          {
            title: "Local by Default",
            description: "Discover families nearby with privacy-respecting location sharing",
            gradient: [colors.gradient.pink, colors.gradient.orange],
          },
          {
            title: "Quality Connections",
            description: "Meaningful relationships over quantity",
            gradient: [colors.gradient.orange, colors.gradient.yellow],
          },
        ].map((item, index) => (
          <View
            key={index}
            className="flex-row items-start mb-6 p-4 rounded-2xl"
            style={{
              backgroundColor: colors.surface,
              borderWidth: 1,
              borderColor: `rgba(${index === 0 ? "139, 92, 246" : index === 1 ? "236, 72, 153" : "249, 115, 22"}, 0.3)`,
            }}
          >
            <View
              className="w-3 h-3 rounded-full mt-1.5 mr-4"
              style={{ backgroundColor: item.gradient[0] }}
            />
            <View className="flex-1">
              <Text className="text-primary text-base font-bold mb-1">
                {item.title}
              </Text>
              <Text className="text-muted text-sm leading-5">
                {item.description}
              </Text>
            </View>
          </View>
        ))}
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

