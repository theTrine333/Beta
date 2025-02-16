import React from "react";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import Styles from "@/style";
import PagerHeader from "@/components/PagerHeader";
import { FlatList } from "react-native";
import { data } from "@/data";
import Card from "@/components/LibraryCard";
import { useRouter } from "expo-router";
import Tabs from "../library/_layout";

const Library = () => {
  const router = useRouter();
  return (
    <ThemedView style={Styles.container}>
      <PagerHeader
        title="Library"
        description="Downloads and local music will appear here"
      />

      <ThemedView
        style={[
          Styles.verticalListContainer,
          { marginTop: 0, paddingHorizontal: 0 },
        ]}
      >
        <Tabs />
        {/* <FlatList
          data={data}
          renderItem={({ item }) => (
            <Card
              name={item.name}
              duration={item.duration}
              image={item.image}
              link={item.link}
              router={router}
            />
          )}
        /> */}
      </ThemedView>
    </ThemedView>
  );
};

export default Library;
