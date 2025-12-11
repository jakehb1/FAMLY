import { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/stores/authStore";
import { useFamilyStore } from "@/stores/familyStore";
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
    <ScrollView contentContainerClassName="px-6 py-8">
      <Text className="text-primary text-3xl font-bold mb-2">
        Select Your Interests
      </Text>
      <Text className="text-muted text-base mb-8">
        Choose activities and interests your family enjoys. This helps us match
        you with like-minded families.
      </Text>

      <View className="flex-row flex-wrap gap-3 mb-8">
        {INTERESTS.map((interest) => (
          <TouchableOpacity
            key={interest}
            onPress={() => toggleInterest(interest)}
            className={`px-4 py-3 rounded-full border ${
              selectedInterests.includes(interest)
                ? "bg-secondary border-secondary"
                : "bg-surface border-gray-200"
            }`}
          >
            <Text
              className={
                selectedInterests.includes(interest)
                  ? "text-white font-medium"
                  : "text-primary"
              }
            >
              {interest}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View className="bg-surface rounded-xl p-4 mb-6 border border-gray-200">
        <Text className="text-primary font-semibold mb-2">
          Selected: {selectedInterests.length}
        </Text>
        <Text className="text-muted text-sm">
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

