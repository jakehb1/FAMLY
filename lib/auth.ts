import { supabase } from "./supabase";
import { useAuthStore } from "@/stores/authStore";

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

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

