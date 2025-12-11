import { useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/stores/authStore";
import { initializeAuth } from "@/lib/auth";

export default function Index() {
  const router = useRouter();
  const { session, loading } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, []);

  useEffect(() => {
    if (!loading) {
      if (session) {
        // TODO: Check if user has completed onboarding
        // For now, redirect to tabs
        router.replace("/(tabs)");
      } else {
        router.replace("/(auth)/login");
      }
    }
  }, [session, loading, router]);

  return (
    <View className="flex-1 items-center justify-center bg-background">
      <ActivityIndicator size="large" color="#1A1A1A" />
      <Text className="text-muted mt-4">Loading...</Text>
    </View>
  );
}

