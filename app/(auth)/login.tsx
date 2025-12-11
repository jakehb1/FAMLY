import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { signInWithEmail, signInWithApple } from "@/lib/auth";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
    }
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const { data, error } = await signInWithEmail(email, password);
      if (error) {
        Alert.alert("Login Failed", error.message);
      } else if (data?.session) {
        // Check if user has completed onboarding
        // For now, redirect to tabs (will be updated in Task 2.1)
        router.replace("/(tabs)");
      }
    } catch (err) {
      Alert.alert("Error", "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    setLoading(true);
    try {
      const { data, error } = await signInWithApple();
      if (error) {
        if (error.message !== "Apple Sign-In was cancelled") {
          Alert.alert("Sign In Failed", error.message);
        }
      } else if (data?.session) {
        router.replace("/(tabs)");
      }
    } catch (err) {
      Alert.alert("Error", "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-background"
    >
      <ScrollView
        contentContainerClassName="flex-grow justify-center px-6 py-12"
        keyboardShouldPersistTaps="handled"
      >
        <View className="mb-8">
          <Text className="text-primary text-3xl font-bold mb-2">
            Welcome Back
          </Text>
          <Text className="text-muted text-base">
            Sign in to connect with families in your area
          </Text>
        </View>

        <View className="mb-6">
          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="your@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            error={errors.email}
          />

          <Input
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            secureTextEntry
            autoCapitalize="none"
            autoComplete="password"
            error={errors.password}
          />
        </View>

        <Button
          title="Sign In"
          onPress={handleLogin}
          loading={loading}
          disabled={loading}
          className="mb-4"
        />

        <View className="flex-row items-center justify-center mb-6">
          <View className="flex-1 h-px bg-gray-200" />
          <Text className="mx-4 text-muted text-sm">OR</Text>
          <View className="flex-1 h-px bg-gray-200" />
        </View>

        <Button
          title="Continue with Apple"
          onPress={handleAppleSignIn}
          variant="secondary"
          disabled={loading}
        />

        <View className="mt-8 flex-row justify-center">
          <Text className="text-muted">Don't have an account? </Text>
          <Link href="/(auth)/signup" asChild>
            <Text className="text-accent font-semibold">Sign Up</Text>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

