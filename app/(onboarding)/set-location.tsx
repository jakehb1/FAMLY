import { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/stores/authStore";
import { useFamilyStore } from "@/stores/familyStore";
import { useLocation } from "@/hooks/useLocation";
import { colors } from "@/constants/colors";
import Button from "@/components/ui/Button";
import { getCurrentLocation } from "@/lib/location";

export default function SetLocationScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { setCurrentFamily } = useFamilyStore();
  const { latitude, longitude, city, zip, fetchLocation, loading: locationLoading } = useLocation();
  const [privacyRadius, setPrivacyRadius] = useState(500);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Auto-fetch location on mount
    fetchLocation();
  }, []);

  const handleContinue = async () => {
    if (!user || !latitude || !longitude) {
      Alert.alert("Location Required", "Please allow location access to continue");
      return;
    }

    setSaving(true);
    try {
      // Get user's family
      const { data: family, error: familyError } = await supabase
        .from("families")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (familyError || !family) {
        throw new Error("Family profile not found");
      }

      // Update family location
      const { error: updateError } = await supabase
        .from("families")
        .update({
          location_lat: latitude,
          location_lng: longitude,
          location_city: city,
          location_zip: zip,
          privacy_radius: privacyRadius,
        })
        .eq("id", family.id);

      if (updateError) throw updateError;

      // Fetch updated family and store it
      const { data: updatedFamily } = await supabase
        .from("families")
        .select("*")
        .eq("id", family.id)
        .single();

      if (updatedFamily) {
        setCurrentFamily(updatedFamily as any);
      }

      router.push("/(onboarding)/select-interests");
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to save location");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{
        paddingHorizontal: 24,
        paddingVertical: 32,
        flexGrow: 1,
      }}
      style={{ backgroundColor: colors.background }}
    >
      <Text
        className="text-3xl font-bold mb-2"
        style={{ color: colors.primary }}
      >
        Set Your Location
      </Text>
      <Text className="text-base mb-8" style={{ color: colors.muted }}>
        We'll use your location to find nearby families. Your exact location is
        never shared—we'll blur it by your privacy radius.
      </Text>

      {locationLoading ? (
        <View className="flex-1 items-center justify-center py-12">
          <ActivityIndicator size="large" color={colors.gradient.purple} />
          <Text className="mt-4" style={{ color: colors.muted }}>
            Getting your location...
          </Text>
        </View>
      ) : latitude && longitude ? (
        <View className="mb-8">
          <View
            className="rounded-2xl p-4 mb-6"
            style={{
              backgroundColor: colors.surface,
              borderWidth: 1,
              borderColor: "rgba(139, 92, 246, 0.3)",
            }}
          >
            <Text
              className="font-semibold mb-2"
              style={{ color: colors.primary }}
            >
              Location Found
            </Text>
            {city && (
              <Text style={{ color: colors.muted }}>{city}</Text>
            )}
            {zip && (
              <Text style={{ color: colors.muted }}>{zip}</Text>
            )}
            <Text className="text-sm mt-2" style={{ color: colors.muted }}>
              Coordinates: {latitude.toFixed(6)}, {longitude.toFixed(6)}
            </Text>
          </View>

          <View className="mb-6">
            <Text
              className="text-base font-semibold mb-4"
              style={{ color: colors.primary }}
            >
              Privacy Radius: {privacyRadius}m
            </Text>
            <View className="flex-row items-center gap-4">
              <Text className="text-muted text-sm">100m</Text>
              <View className="flex-1">
                <View className="h-2 bg-gray-200 rounded-full">
                  <View
                    className="h-2 bg-accent rounded-full"
                    style={{ width: `${((privacyRadius - 100) / 1900) * 100}%` }}
                  />
                </View>
              </View>
              <Text className="text-muted text-sm">2000m</Text>
            </View>
            <View className="flex-row justify-between mt-2">
              {[100, 250, 500, 1000, 2000].map((radius) => (
                <Button
                  key={radius}
                  title={`${radius}m`}
                  onPress={() => setPrivacyRadius(radius)}
                  variant={privacyRadius === radius ? "primary" : "secondary"}
                  className="px-3 py-2"
                />
              ))}
            </View>
            <Text className="text-muted text-xs mt-2">
              Your location will be blurred within this radius when shown to other
              families
            </Text>
          </View>
        </View>
      ) : (
        <View className="mb-8">
          <Text className="text-muted mb-4">
            Location access is required to find nearby families.
          </Text>
          <Button
            title="Request Location Access"
            onPress={fetchLocation}
            variant="secondary"
          />
        </View>
      )}

      <View className="mt-auto">
        <Button
          title="Continue"
          onPress={handleContinue}
          loading={saving}
          disabled={!latitude || !longitude || saving}
        />
      </View>
    </ScrollView>
  );
}

