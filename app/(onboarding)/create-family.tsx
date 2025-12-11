import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/stores/authStore";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function CreateFamilyScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [familyName, setFamilyName] = useState("");
  const [bio, setBio] = useState("");
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    familyName?: string;
    bio?: string;
  }>({});

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "Please grant camera roll permissions");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission needed", "Please grant camera permissions");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const uploadPhoto = async (): Promise<string | null> => {
    if (!photoUri || !user) return null;

    setUploading(true);
    try {
      const response = await fetch(photoUri);
      const blob = await response.blob();
      const fileExt = photoUri.split(".").pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `profile-photos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("profile-photos")
        .upload(filePath, blob, {
          contentType: `image/${fileExt}`,
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("profile-photos").getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error("Error uploading photo:", error);
      Alert.alert("Upload Failed", "Could not upload photo. Please try again.");
      return null;
    } finally {
      setUploading(false);
    }
  };

  const validate = () => {
    const newErrors: { familyName?: string; bio?: string } = {};
    if (!familyName.trim()) {
      newErrors.familyName = "Family name is required";
    }
    if (bio.length > 200) {
      newErrors.bio = "Bio must be 200 characters or less";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = async () => {
    if (!validate() || !user) return;

    setLoading(true);
    try {
      let photoUrl = null;
      if (photoUri) {
        photoUrl = await uploadPhoto();
      }

      // Create family profile
      const { data, error } = await supabase
        .from("families")
        .insert({
          user_id: user.id,
          name: familyName.trim(),
          bio: bio.trim() || null,
          photo_url: photoUrl,
          location_lat: 0, // Will be set in set-location screen
          location_lng: 0,
        })
        .select()
        .single();

      if (error) throw error;

      // Store family ID for next steps
      // We'll use a temporary store or pass via route params
      router.push({
        pathname: "/(onboarding)/add-children",
        params: { familyId: data.id },
      });
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to create family profile");
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
        contentContainerClassName="px-6 py-8"
        keyboardShouldPersistTaps="handled"
      >
        <Text className="text-primary text-3xl font-bold mb-2">
          Create Your Family Profile
        </Text>
        <Text className="text-muted text-base mb-8">
          Tell us about your family
        </Text>

        {/* Photo Upload */}
        <View className="items-center mb-6">
          <TouchableOpacity
            onPress={() => {
              Alert.alert(
                "Add Photo",
                "Choose an option",
                [
                  { text: "Camera", onPress: takePhoto },
                  { text: "Photo Library", onPress: pickImage },
                  { text: "Cancel", style: "cancel" },
                ]
              );
            }}
            className="w-32 h-32 rounded-full bg-gray-200 items-center justify-center overflow-hidden"
          >
            {photoUri ? (
              <Image
                source={{ uri: photoUri }}
                className="w-full h-full"
                resizeMode="cover"
              />
            ) : (
              <Text className="text-muted">Add Photo</Text>
            )}
          </TouchableOpacity>
          {uploading && (
            <Text className="text-muted text-sm mt-2">Uploading...</Text>
          )}
        </View>

        <Input
          label="Family Name"
          value={familyName}
          onChangeText={setFamilyName}
          placeholder="The Johnson Family"
          error={errors.familyName}
        />

        <Input
          label="Bio (Optional)"
          value={bio}
          onChangeText={setBio}
          placeholder="Tell us about your family..."
          multiline
          maxLength={200}
          error={errors.bio}
        />

        <View className="mt-4">
          <Text className="text-muted text-sm">
            {bio.length}/200 characters
          </Text>
        </View>

        <View className="mt-8">
          <Button
            title="Continue"
            onPress={handleContinue}
            loading={loading || uploading}
            disabled={loading || uploading}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

