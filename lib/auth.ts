import { supabase } from "./supabase";
import { useAuthStore } from "@/stores/authStore";
import * as AppleAuthentication from "expo-apple-authentication";
import { Platform } from "react-native";

export const initializeAuth = async () => {
  const { setSession, setLoading } = useAuthStore.getState();

  // Get initial session
  const {
    data: { session },
  } = await supabase.auth.getSession();
  setSession(session);
  setLoading(false);

  // Listen for auth changes
  supabase.auth.onAuthStateChange((_event, session) => {
    setSession(session);
  });
};

export const signUpWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: undefined, // We'll handle email verification in-app
    },
  });
  return { data, error };
};

export const signInWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signInWithApple = async () => {
  if (Platform.OS !== "ios") {
    return {
      data: null,
      error: { message: "Apple Sign-In is only available on iOS" },
    };
  }

  try {
    // Request Apple authentication
    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });

    if (!credential.identityToken) {
      return {
        data: null,
        error: { message: "Apple Sign-In failed: No identity token" },
      };
    }

    // Sign in with Supabase using the Apple identity token
    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: "apple",
      token: credential.identityToken,
    });

    return { data, error };
  } catch (error: any) {
    if (error.code === "ERR_REQUEST_CANCELED") {
      return {
        data: null,
        error: { message: "Apple Sign-In was cancelled" },
      };
    }
    return {
      data: null,
      error: { message: error.message || "Apple Sign-In failed" },
    };
  }
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const checkEmailVerification = async (): Promise<boolean> => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.email_confirmed_at !== null && user?.email_confirmed_at !== undefined;
};

export const resendVerificationEmail = async (email: string) => {
  const { error } = await supabase.auth.resend({
    type: "signup",
    email,
  });
  return { error };
};

