import { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/stores/authStore";
import { useFamilyStore } from "@/stores/familyStore";
import { colors } from "@/constants/colors";
import Button from "@/components/ui/Button";
import { INTERESTS } from "@/constants/interests";

export default function SelectInterestsScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { currentFamily, setCurrentFamily } = useFamilyStore();
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (currentFamily?.interests) {
      setSelectedInterests(currentFamily.interests);
    }
  }, [currentFamily]);

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleComplete = async () => {
    if (!user || !currentFamily) {
      Alert.alert("Error", "Family profile not found");
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from("families")
        .update({ interests: selectedInterests })
        .eq("id", currentFamily.id);

      if (error) throw error;

      // Update local store
      setCurrentFamily({ ...currentFamily, interests: selectedInterests } as any);

      // Onboarding complete - redirect to main app
      router.replace("/(tabs)");
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to save interests");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 32 }}
      style={{ backgroundColor: colors.background }}
    >
      <Text
        className="text-3xl font-bold mb-2"
        style={{ color: colors.primary }}
      >
        Select Your Interests
      </Text>
      <Text className="text-base mb-8" style={{ color: colors.muted }}>
        Choose activities and interests your family enjoys. This helps us match
        you with like-minded families.
      </Text>

      <View className="flex-row flex-wrap gap-3 mb-8">
        {INTERESTS.map((interest) => (
          <TouchableOpacity
            key={interest}
            onPress={() => toggleInterest(interest)}
            className="px-4 py-3 rounded-full border"
            style={{
              backgroundColor: selectedInterests.includes(interest)
                ? colors.gradient.pink
                : colors.surface,
              borderColor: selectedInterests.includes(interest)
                ? colors.gradient.pink
                : "rgba(236, 72, 153, 0.3)",
            }}
          >
            <Text
              style={{
                color: selectedInterests.includes(interest)
                  ? "#FFFFFF"
                  : colors.primary,
                fontWeight: selectedInterests.includes(interest) ? "600" : "400",
              }}
            >
              {interest}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

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
          Selected: {selectedInterests.length}
        </Text>
        <Text className="text-sm" style={{ color: colors.muted }}>
          {selectedInterests.length > 0
            ? selectedInterests.join(", ")
            : "No interests selected"}
        </Text>
      </View>

      <Button
        title="Complete Setup"
        onPress={handleComplete}
        loading={saving}
        disabled={saving}
      />
    </ScrollView>
  );
}

