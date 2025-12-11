import { useEffect, useState } from "react";
import { useLocationStore } from "@/stores/locationStore";
import { getCurrentLocation, requestLocationPermission } from "@/lib/location";

export const useLocation = () => {
  const locationStore = useLocationStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLocation = async () => {
    setLoading(true);
    setError(null);
    try {
      await getCurrentLocation();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to get location");
    } finally {
      setLoading(false);
    }
  };

  return {
    ...locationStore,
    loading,
    error,
    fetchLocation,
    hasPermission: async () => {
      return await requestLocationPermission();
    },
  };
};

