import MusicCard from "@/components/GenreMusicCard";
import PagerHeader from "@/components/PagerHeader";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import Styles from "@/style";
import React from "react";
import { FlatList } from "react-native";

const data = [
  {
    name: "Black Lives Matters",
    link: "https://musicza.co.za/mood/black-lives-matter",
  },
  {
    name: "Chill",
    link: "https://musicza.co.za/mood/chill",
  },
  {
    name: "Energy Booster",
    link: "https://musicza.co.za/mood/energy-booster",
  },
  {
    name: "Commute",
    link: "https://musicza.co.za/mood/commute",
  },
  {
    name: "Feel Good",
    link: "https://musicza.co.za/mood/feel-good",
  },
  {
    name: "Focus",
    link: "https://musicza.co.za/mood/focus",
  },
  {
    name: "Party",
    link: "https://musicza.co.za/mood/party",
  },
  {
    name: "Romance",
    link: "https://musicza.co.za/mood/romance",
  },
  {
    name: "Sad",
    link: "https://musicza.co.za/mood/sad",
  },
];

const Genres = () => {
  return (
    <ThemedView style={Styles.container}>
      <PagerHeader
        title="Genres"
        description="The home of free endless music"
      />
      <ThemedView style={Styles.verticalListContainer}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={data}
          // keyExtractor={({ item }) =>(item.url)}
          renderItem={({ item }) => (
            <MusicCard name={item.name} link={item.link} />
          )}
        />
      </ThemedView>
    </ThemedView>
  );
};

export default Genres;
