import MusicCard from "@/components/GenreMusicCard";
import PagerHeader from "@/components/PagerHeader";
import { ThemedView } from "@/components/ThemedView";
import Styles from "@/style";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, RefreshControl } from "react-native";
import { useSQLiteContext } from "expo-sqlite";
import { get_db_Genres, insertGenre } from "@/api/database";
import { useRouter } from "expo-router";

const PAGE_SIZE = 2; // Load 2 items at a time

const Genres = () => {
  const [genres, setGenres] = useState([]);
  const [allGenres, setAllGenres] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(5);
  const [state, setState] = useState<"idle" | "loading" | "error">("loading");
  const [refresh, setRefresh] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const db = useSQLiteContext();
  const router = useRouter();

  const loader = async () => {
    try {
      setState("loading");
      const localGenres = await get_db_Genres(db);
      for (const element of localGenres) {
        await insertGenre(db, element.name, element.link);
      }

      setAllGenres(localGenres);
      setGenres(localGenres.slice(0, 5));
      setCurrentIndex(5);
      setState("idle");
      setRefresh(false);
    } catch {
      setState("error");
    }
  };

  const loadMore = () => {
    if (loadingMore || currentIndex >= allGenres.length) return;

    setLoadingMore(true);
    setTimeout(() => {
      const nextData = allGenres.slice(currentIndex, currentIndex + PAGE_SIZE);
      setGenres((prevGenres) => [...prevGenres, ...nextData]);
      setCurrentIndex(currentIndex + PAGE_SIZE);
      setLoadingMore(false);
    }, 1000);
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
        {state === "loading" ? (
          <ActivityIndicator />
        ) : (
          <FlatList
            showsVerticalScrollIndicator={false}
            data={genres}
            renderItem={({ item }) => (
              <MusicCard
                name={item.name}
                link={item.link}
                db={db}
                router={router}
              />
            )}
            refreshControl={
              <RefreshControl onRefresh={loader} refreshing={refresh} />
            }
            onEndReached={loadMore} // Trigger pagination
            onEndReachedThreshold={0.5} // Load more when reaching 50% from bottom
            ListFooterComponent={
              loadingMore ? (
                <ActivityIndicator size="small" color="blue" />
              ) : null
            }
          />
        )}
      </ThemedView>
    </ThemedView>
  );
};

export default Genres;
