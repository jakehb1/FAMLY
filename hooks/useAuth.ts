import { useEffect } from "react";
import { useAuthStore } from "@/stores/authStore";
import { initializeAuth } from "@/lib/auth";

export const useAuth = () => {
  const { session, user, loading } = useAuthStore();

  useEffect(() => {
    if (!session) {
      initializeAuth();
    }
  }, [session]);

  return {
    session,
    user,
    loading,
    isAuthenticated: !!session,
  };
};

