import { Stack } from "expo-router";
import { useEffect } from "react";
import { initializeAuth } from "@/lib/auth";
import { initializeDeepLinking } from "@/lib/deep-linking";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import "../global.css";

export default function RootLayout() {
  useEffect(() => {
    initializeAuth();
    const cleanup = initializeDeepLinking();
    return cleanup;
  }, []);

  return (
    <ProtectedRoute>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(onboarding)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen 
          name="family/[id]" 
          options={{ 
            presentation: "card",
            title: "Family Profile"
          }} 
        />
        <Stack.Screen 
          name="conversation/[id]" 
          options={{ 
            presentation: "card",
            title: "Conversation"
          }} 
        />
        <Stack.Screen 
          name="event/[id]" 
          options={{ 
            presentation: "card",
            title: "Event"
          }} 
        />
      </Stack>
    </ProtectedRoute>
  );
}

