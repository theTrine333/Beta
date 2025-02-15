import {
  get_all_sub_genres,
  get_sub_genres,
  insertSubGenre,
} from "@/api/database";
import MusicCard from "@/components/GenreMusicCard";
import GenreMusicCardItem from "@/components/GenreMusicCardItem";
import PagerHeader from "@/components/PagerHeader";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import Styles, { height } from "@/style";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import React, { useEffect, useState } from "react";
import { FlatList, RefreshControl, useColorScheme } from "react-native";

const moreGenres = () => {
  const params = useLocalSearchParams();
  const db = useSQLiteContext();
  const router = useRouter();
  const theme = useColorScheme() ?? "light";
  const [state, setState] = useState<"idle" | "loading" | "error">("loading");
  const [data, setData] = useState();
  const [fullData, setFullData] = useState();
  const loader = async () => {
    try {
      setState("loading");
      const subGenre = await get_all_sub_genres(db, params.Link);
      setData(subGenre);
      setFullData(subGenre);
      setState("idle");
    } catch {
      setState("idle");
    }
  };

  useEffect(() => {
    loader();
  }, []);
  useEffect(() => {}, []);
  return (
    <ThemedView style={Styles.container}>
      <PagerHeader title="Genre" description={"More of " + params.Heading} />
      <ThemedView
        style={{
          //   borderWidth: 1,
          borderColor: "white",
          marginTop: 10,
          height: height * 0.8,
          paddingHorizontal: 10,
        }}
      >
        <FlatList
          data={data}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.link}
          numColumns={2}
          contentContainerStyle={{ gap: 10 }}
          renderItem={({ item }) => (
            <GenreMusicCardItem
              name={item.name}
              link={item.link}
              image={item.image}
              router={router}
            />
          )}
        />
      </ThemedView>
    </ThemedView>
  );
};

export default moreGenres;
