import PagerHeader from "@/components/PagerHeader";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import Styles from "@/style";
import React from "react";
import * as Constants from "expo-constants";
const Settings = () => {
  return (
    <ThemedView style={Styles.container}>
      <PagerHeader
        title="Settings"
        description={"Version : " + Constants.default.expoConfig?.version}
      />
    </ThemedView>
  );
};

export default Settings;
