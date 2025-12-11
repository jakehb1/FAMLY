import { Linking } from "react-native";
import { router } from "expo-router";
import type { DeepLink } from "@/types/navigation";

export const handleDeepLink = (url: string) => {
  // Parse URL: famly://family/123 or famly://conversation/456
  const parsed = url.replace("famly://", "");
  const [type, id] = parsed.split("/");

  switch (type) {
    case "family":
      router.push(`/family/${id}`);
      break;
    case "conversation":
      router.push(`/conversation/${id}`);
      break;
    case "event":
      router.push(`/event/${id}`);
      break;
    default:
      console.warn("Unknown deep link type:", type);
  }
};

export const initializeDeepLinking = () => {
  // Handle initial URL if app was opened via deep link
  Linking.getInitialURL().then((url) => {
    if (url) {
      handleDeepLink(url);
    }
  });

  // Handle deep links while app is running
  const subscription = Linking.addEventListener("url", (event) => {
    handleDeepLink(event.url);
  });

  return () => subscription.remove();
};

