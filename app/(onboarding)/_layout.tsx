import { Stack } from "expo-router";

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="welcome" />
      <Stack.Screen name="create-family" />
      <Stack.Screen name="add-children" />
      <Stack.Screen name="set-location" />
      <Stack.Screen name="select-interests" />
    </Stack>
  );
}

