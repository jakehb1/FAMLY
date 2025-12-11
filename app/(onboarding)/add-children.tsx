import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { supabase } from "@/lib/supabase";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Child } from "@/types";
import { INTERESTS } from "@/constants/interests";

const SCHOOL_AGE_GROUPS = [
  "infant",
  "toddler",
  "preschool",
  "elementary",
  "middle",
  "high",
] as const;

export default function AddChildrenScreen() {
  const router = useRouter();
  const { familyId } = useLocalSearchParams<{ familyId: string }>();
  const [children, setChildren] = useState<Partial<Child>[]>([
    { name: "", age_years: 0, age_months: 0, interests: [], school_age_group: undefined },
  ]);
  const [loading, setLoading] = useState(false);

  const updateChild = (index: number, field: string, value: any) => {
    const updated = [...children];
    updated[index] = { ...updated[index], [field]: value };
    setChildren(updated);
  };

  const addChild = () => {
    setChildren([
      ...children,
      { name: "", age_years: 0, age_months: 0, interests: [], school_age_group: undefined },
    ]);
  };

  const removeChild = (index: number) => {
    if (children.length > 1) {
      setChildren(children.filter((_, i) => i !== index));
    }
  };

  const toggleInterest = (childIndex: number, interest: string) => {
    const updated = [...children];
    const currentInterests = updated[childIndex].interests || [];
    if (currentInterests.includes(interest)) {
      updated[childIndex].interests = currentInterests.filter((i) => i !== interest);
    } else {
      updated[childIndex].interests = [...currentInterests, interest];
    }
    setChildren(updated);
  };

  const validate = () => {
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      if (!child.name?.trim()) {
        Alert.alert("Validation Error", `Please enter a name for child ${i + 1}`);
        return false;
      }
      if (!child.age_years || child.age_years < 0) {
        Alert.alert("Validation Error", `Please enter a valid age for ${child.name}`);
        return false;
      }
    }
    return true;
  };

  const handleContinue = async () => {
    if (!validate() || !familyId) return;

    setLoading(true);
    try {
      const childrenToInsert = children.map((child) => ({
        family_id: familyId,
        name: child.name!.trim(),
        age_years: child.age_years!,
        age_months: child.age_months || null,
        interests: child.interests || [],
        school_age_group: child.school_age_group || null,
      }));

      const { error } = await supabase.from("children").insert(childrenToInsert);

      if (error) throw error;

      router.push("/(onboarding)/set-location");
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to save children");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-background"
    >
      <ScrollView contentContainerClassName="px-6 py-8">
        <Text className="text-primary text-3xl font-bold mb-2">
          Add Your Children
        </Text>
        <Text className="text-muted text-base mb-6">
          Tell us about your kids (first names only)
        </Text>

        {children.map((child, index) => (
          <View
            key={index}
            className="bg-surface rounded-xl p-4 mb-4 border border-gray-200"
          >
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-primary text-lg font-semibold">
                Child {index + 1}
              </Text>
              {children.length > 1 && (
                <TouchableOpacity
                  onPress={() => removeChild(index)}
                  className="px-3 py-1 bg-red-50 rounded-lg"
                >
                  <Text className="text-red-600 text-sm">Remove</Text>
                </TouchableOpacity>
              )}
            </View>

            <Input
              label="Name (First name only)"
              value={child.name || ""}
              onChangeText={(text) => updateChild(index, "name", text)}
              placeholder="Emma"
            />

            <View className="flex-row gap-4 mb-4">
              <View className="flex-1">
                <Input
                  label="Age (Years)"
                  value={child.age_years?.toString() || "0"}
                  onChangeText={(text) =>
                    updateChild(index, "age_years", parseInt(text) || 0)
                  }
                  keyboardType="number-pad"
                  placeholder="5"
                />
              </View>
              <View className="flex-1">
                <Input
                  label="Months (Optional)"
                  value={child.age_months?.toString() || "0"}
                  onChangeText={(text) =>
                    updateChild(index, "age_months", parseInt(text) || 0)
                  }
                  keyboardType="number-pad"
                  placeholder="3"
                />
              </View>
            </View>

            <View className="mb-4">
              <Text className="text-primary text-sm font-medium mb-2">
                School Age Group
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {SCHOOL_AGE_GROUPS.map((group) => (
                  <TouchableOpacity
                    key={group}
                    onPress={() => updateChild(index, "school_age_group", group)}
                    className={`px-4 py-2 rounded-lg border ${
                      child.school_age_group === group
                        ? "bg-accent border-accent"
                        : "bg-surface border-gray-200"
                    }`}
                  >
                    <Text
                      className={
                        child.school_age_group === group
                          ? "text-white font-medium"
                          : "text-primary"
                      }
                    >
                      {group.charAt(0).toUpperCase() + group.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View className="mb-4">
              <Text className="text-primary text-sm font-medium mb-2">
                Interests (Optional)
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {INTERESTS.map((interest) => (
                  <TouchableOpacity
                    key={interest}
                    onPress={() => toggleInterest(index, interest)}
                    className={`px-3 py-1.5 rounded-full border ${
                      child.interests?.includes(interest)
                        ? "bg-secondary border-secondary"
                        : "bg-surface border-gray-200"
                    }`}
                  >
                    <Text
                      className={
                        child.interests?.includes(interest)
                          ? "text-white text-sm"
                          : "text-primary text-sm"
                      }
                    >
                      {interest}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        ))}

        <TouchableOpacity
          onPress={addChild}
          className="mb-6 py-3 border-2 border-dashed border-gray-300 rounded-xl items-center"
        >
          <Text className="text-accent font-semibold">+ Add Another Child</Text>
        </TouchableOpacity>

        <Button
          title="Continue"
          onPress={handleContinue}
          loading={loading}
          disabled={loading}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

