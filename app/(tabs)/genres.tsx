import MusicCard from "@/components/GenreMusicCard";
import PagerHeader from "@/components/PagerHeader";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import Styles from "@/style";
import { getGenres } from "@/api/q";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList } from "react-native";

// const data = [
//   {
//     name: "Black Lives Matters",
//     link: "https://musicza.co.za/mood/black-lives-matter",
//   },
//   {
//     name: "Chill",
//     link: "https://musicza.co.za/mood/chill",
//   },
//   {
//     name: "Energy Booster",
//     link: "https://musicza.co.za/mood/energy-booster",
//   },
//   {
//     name: "Commute",
//     link: "https://musicza.co.za/mood/commute",
//   },
//   {
//     name: "Feel Good",
//     link: "https://musicza.co.za/mood/feel-good",
//   },
//   {
//     name: "Focus",
//     link: "https://musicza.co.za/mood/focus",
//   },
//   {
//     name: "Party",
//     link: "https://musicza.co.za/mood/party",
//   },
//   {
//     name: "Romance",
//     link: "https://musicza.co.za/mood/romance",
//   },
//   {
//     name: "Sad",
//     link: "https://musicza.co.za/mood/sad",
//   },
// ];

const Genres = () => {
  const [genres, setGenres] = useState();
  const [state, setState] = useState<"idle" | "loading" | "error">("loading");
  const loader = async () => {
    await getGenres()
      .then((e: any) => {
        if (e.length == 0) {
          setState("error");
          return;
        }
        setGenres(e);
        setState("idle");
      })
      .catch(() => {
        setState("error");
      })
      .finally(() => {
        setState("idle");
      });
  };
  useEffect(() => {
    loader();
  }, []);
  return (
    <ThemedView style={Styles.container}>
      <PagerHeader
        title="Genres"
        description="The home of free endless music"
      />
      <ThemedView style={Styles.verticalListContainer}>
        {state == "loading" ? (
          <ActivityIndicator />
        ) : (
          <FlatList
            showsVerticalScrollIndicator={false}
            data={genres}
            // keyExtractor={({ item }) =>(item.url)}
            renderItem={({ item }) => (
              <MusicCard name={item.name} link={item.link} />
            )}
          />
        )}
      </ThemedView>
    </ThemedView>
  );
};

export default Genres;
