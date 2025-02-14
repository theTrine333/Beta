import MusicCard from "@/components/GenreMusicCard";
import PagerHeader from "@/components/PagerHeader";
import { ThemedView } from "@/components/ThemedView";
import Styles from "@/style";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList } from "react-native";
import { useSQLiteContext } from "expo-sqlite";
import { get_db_Genres, insertGenre } from "@/api/database";
import { useRouter } from "expo-router";

const Genres = () => {
  const [genres, setGenres] = useState();
  const db = useSQLiteContext();
  const router = useRouter();
  const [state, setState] = useState<"idle" | "loading" | "error">("loading");
  const loader = async () => {
    try {
      setState("loading");
      const localGenres = await get_db_Genres(db);
      await localGenres.forEach(async (element: any) => {
        await insertGenre(db, element.name, element.link);
      });
      setGenres(localGenres);
      setState("idle");
    } catch {
      setState("error");
    }
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
              <MusicCard
                name={item.name}
                link={item.link}
                db={db}
                router={router}
              />
            )}
          />
        )}
      </ThemedView>
    </ThemedView>
  );
};

export default Genres;
