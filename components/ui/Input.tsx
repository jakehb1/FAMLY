import { TextInput, View, Text } from "react-native";

interface InputProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  multiline?: boolean;
  maxLength?: number;
  error?: string;
  className?: string;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad" | "number-pad";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  autoComplete?: string;
}

export default function Input({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  multiline = false,
  maxLength,
  error,
  className = "",
  keyboardType = "default",
  autoCapitalize = "sentences",
  autoComplete,
}: InputProps) {
  return (
    <View className={`mb-4 ${className}`}>
      {label && (
        <Text className="text-primary text-sm font-medium mb-2">{label}</Text>
      )}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        secureTextEntry={secureTextEntry}
        multiline={multiline}
        maxLength={maxLength}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        autoComplete={autoComplete as any}
        className={`bg-surface border ${
          error ? "border-red-500" : "border-purple-500/30"
        } rounded-2xl px-4 py-3 text-primary ${
          multiline ? "min-h-[100px]" : "h-14"
        }`}
        style={{
          borderColor: error ? "#EF4444" : "rgba(139, 92, 246, 0.3)",
        }}
      />
      {error && (
        <Text className="text-red-500 text-sm mt-1">{error}</Text>
      )}
    </View>
  );
}

