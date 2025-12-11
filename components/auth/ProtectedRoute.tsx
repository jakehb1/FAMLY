import { useEffect } from "react";
import { useRouter, useSegments } from "expo-router";
import { useAuth } from "@/hooks/useAuth";
import { View, ActivityIndicator, Text } from "react-native";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === "(auth)";
    const inOnboardingGroup = segments[0] === "(onboarding)";

    if (!isAuthenticated && !inAuthGroup && !inOnboardingGroup) {
      // Redirect to login if not authenticated
      router.replace("/(auth)/login");
    } else if (isAuthenticated && inAuthGroup) {
      // Redirect away from auth screens if authenticated
      // TODO: Check if onboarding is complete
      router.replace("/(tabs)");
    }
  }, [isAuthenticated, loading, segments, router]);

  if (loading) {
    return (
      <View
        className="flex-1 items-center justify-center"
        style={{ backgroundColor: "#1A0B2E" }}
      >
        <ActivityIndicator size="large" color="#8B5CF6" />
        <Text className="mt-4" style={{ color: "#9CA3AF" }}>
          Loading...
        </Text>
      </View>
    );
  }

  return <>{children}</>;
}

