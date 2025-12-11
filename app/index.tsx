import { useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/stores/authStore";
import { initializeAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { colors } from "@/constants/colors";

export default function Index() {
  const router = useRouter();
  const { session, loading } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, []);

  useEffect(() => {
    if (!loading) {
      if (session) {
        // Check if user has completed onboarding
        checkOnboardingStatus();
      } else {
        router.replace("/(auth)/login");
      }
    }
  }, [session, loading, router]);

  const checkOnboardingStatus = async () => {
    if (!session?.user) return;

    try {
      const { data: family } = await supabase
        .from("families")
        .select("id, location_lat, interests")
        .eq("user_id", session.user.id)
        .single();

      if (!family) {
        // No family profile - start onboarding
        router.replace("/(onboarding)/welcome");
      } else if (!family.location_lat || family.location_lat === 0) {
        // Family exists but location not set - continue onboarding
        router.replace("/(onboarding)/set-location");
      } else if (!family.interests || family.interests.length === 0) {
        // Location set but interests not selected
        router.replace("/(onboarding)/select-interests");
      } else {
        // Onboarding complete - go to main app
        router.replace("/(tabs)");
      }
    } catch (error) {
      // Error checking - assume onboarding needed
      router.replace("/(onboarding)/welcome");
    }
  };

  return (
    <View
      className="flex-1 items-center justify-center"
      style={{ backgroundColor: colors.background }}
    >
      <ActivityIndicator size="large" color={colors.gradient.purple} />
      <Text className="text-muted mt-4" style={{ color: colors.muted }}>
        Loading...
      </Text>
    </View>
  );
}

