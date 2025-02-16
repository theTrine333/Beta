import { View, Text } from "react-native";
import React from "react";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import Styles from "@/style";

const Downloads = () => {
  return (
    <ThemedView style={[Styles.container, { padding: 10, paddingTop: 10 }]}>
      <ThemedText>Downloads</ThemedText>
    </ThemedView>
  );
};

export default Downloads;
