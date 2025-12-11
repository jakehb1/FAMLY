import React, { Component, ErrorInfo, ReactNode } from "react";
import { View, Text, TouchableOpacity } from "react-native";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View
          className="flex-1 items-center justify-center px-6"
          style={{ backgroundColor: "#1A0B2E" }}
        >
          <Text
            className="text-2xl font-bold mb-4"
            style={{ color: "#FFFFFF" }}
          >
            Something went wrong
          </Text>
          <Text
            className="text-center mb-6"
            style={{ color: "#9CA3AF" }}
          >
            {this.state.error?.message || "An unexpected error occurred"}
          </Text>
          <TouchableOpacity
            onPress={() => this.setState({ hasError: false, error: null })}
            className="px-6 py-3 rounded-2xl"
            style={{
              backgroundColor: "#2D1B3D",
              borderWidth: 2,
              borderColor: "#8B5CF6",
            }}
          >
            <Text className="font-semibold" style={{ color: "#FFFFFF" }}>
              Try Again
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}

