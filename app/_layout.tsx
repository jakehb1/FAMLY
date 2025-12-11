import { Stack } from "expo-router";
import { useEffect } from "react";
import { initializeAuth } from "@/lib/auth";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import "../global.css";

export default function RootLayout() {
  useEffect(() => {
    initializeAuth();
  }, []);

  return (
    <ProtectedRoute>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(onboarding)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="family/[id]" />
        <Stack.Screen name="conversation/[id]" />
        <Stack.Screen name="event/[id]" />
      </Stack>
    </ProtectedRoute>
  );
}

