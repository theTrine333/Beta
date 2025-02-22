import React from "react";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import Styles from "@/style";
import PagerHeader from "@/components/PagerHeader";
import { FlatList } from "react-native";
import Card from "@/components/LibraryCard";
import { useRouter } from "expo-router";
import Tabs from "../library/_layout";
import { BannerAd, BannerAdSize } from "react-native-google-mobile-ads";
import * as Constants from "expo-constants";
const Libraries = () => {
  const router = useRouter();
  return (
    <ThemedView style={Styles.container}>
      <PagerHeader
        title="Library"
        description="Downloads and local music will appear here"
      />

      <ThemedView style={{ marginTop: 0, paddingHorizontal: 0, flex: 1 }}>
        <Tabs />
      </ThemedView>
      <ThemedView
        style={{
          position: "absolute",
          bottom: 40,
          // borderWidth: 1,
          backgroundColor: "transparent",
          borderColor: "white",
        }}
      >
        <BannerAd
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
          unitId={Constants.default.expoConfig?.extra?.admob?.bannerId}
        />
      </ThemedView>
    </ThemedView>
  );
};

export default Libraries;
