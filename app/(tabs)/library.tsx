import React from "react";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import Styles from "@/style";
import PagerHeader from "@/components/PagerHeader";
import { FlatList } from "react-native";
import { data } from "@/data";
import Card from "@/components/LibraryCard";

const Library = () => {
  return (
    <ThemedView style={Styles.container}>
      <PagerHeader
        title="Library"
        description="Downloads and local music will appear here"
      />
      <ThemedView style={Styles.verticalListContainer}>
        <FlatList
          data={data}
          renderItem={({ item }) => (
            <Card
              name={item.name}
              duration={item.duration}
              image={item.image}
              link={item.link}
            />
          )}
        />
      </ThemedView>
    </ThemedView>
  );
};

export default Library;
