// Navigation types for Expo Router (no @react-navigation/native needed)

export type RootStackParamList = {
  index: undefined;
  "(auth)": NavigatorScreenParams<AuthStackParamList>;
  "(onboarding)": NavigatorScreenParams<OnboardingStackParamList>;
  "(tabs)": NavigatorScreenParams<TabParamList>;
  "family/[id]": { id: string };
  "conversation/[id]": { id: string };
  "event/[id]": { id: string };
};

export type AuthStackParamList = {
  login: undefined;
  signup: undefined;
};

export type OnboardingStackParamList = {
  welcome: undefined;
  "create-family": undefined;
  "add-children": undefined;
  "set-location": undefined;
  "select-interests": undefined;
};

export type TabParamList = {
  index: undefined; // Discover
  connections: undefined;
  messages: undefined;
  events: undefined;
  profile: undefined;
};

// Deep link types
export type DeepLink = 
  | { type: "family"; id: string }
  | { type: "conversation"; id: string }
  | { type: "event"; id: string }
  | { type: "connection-request"; familyId: string }
  | { type: "message"; conversationId: string };

