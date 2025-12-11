import * as Location from "expo-location";
import { useLocationStore } from "@/stores/locationStore";

export const requestLocationPermission = async (): Promise<boolean> => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  return status === "granted";
};

export const getCurrentLocation = async () => {
  const hasPermission = await requestLocationPermission();
  if (!hasPermission) {
    throw new Error("Location permission not granted");
  }

  const location = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });

  // Reverse geocode to get city and zip
  const reverseGeocode = await Location.reverseGeocodeAsync({
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
  });

  const address = reverseGeocode[0];
  const city = address?.city || null;
  const zip = address?.postalCode || null;

  // Update store
  useLocationStore.getState().setLocation(
    location.coords.latitude,
    location.coords.longitude,
    city || undefined,
    zip || undefined,
    location.coords.accuracy || undefined
  );

  return {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
    city,
    zip,
    accuracy: location.coords.accuracy,
  };
};

