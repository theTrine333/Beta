import { View, Text, ScrollView, FlatList, RefreshControl } from "react-native";
import React, { useEffect, useState } from "react";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import Styles, { height } from "@/style";
import SearchCard from "@/components/searchCard";
import SkeletonLoader from "expo-skeleton-loader";
import { ErrorCard, NoResultsCard } from "@/components/ResultsCard";
import Card from "@/components/LibraryCard";
import { useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { getFavourites } from "@/api/database";
import { useAudioPlayer } from "@/hooks/audioPlayer";

const Favourites = () => {
  const [state, setState] = useState<"idle" | "loading" | "error" | "empty">(
    "loading"
  );
  const { songName } = useAudioPlayer();
  const [data, setData] = useState<any>();
  const router = useRouter();
  const db = useSQLiteContext();
  const [refresh, setRefresh] = useState(false);
  const loader = async () => {
    let results;
    setState("loading");
    results = await getFavourites(db);
    console.log(results);

    if (results.length == 0) {
      setState("idle");
      return;
    }
    setData(results);
    setState("idle");
  };

  useEffect(() => {
    loader();
  }, [songName]);
  return (
    <ThemedView style={[Styles.container, { padding: 10, paddingTop: 10 }]}>
      <SearchCard inType="favourites" shouldNavigate />
      {state == "loading" ? (
        <ScrollView
          showsHorizontalScrollIndicator={false}
          style={{
            minHeight: height * 0.23,
          }}
        >
          <SkeletonLoader duration={1800}>
            <SkeletonLoader.Item style={Styles.genreLoaderCard} />
            <SkeletonLoader.Item style={Styles.genreLoaderCard} />
            <SkeletonLoader.Item style={Styles.genreLoaderCard} />
            <SkeletonLoader.Item style={Styles.genreLoaderCard} />
            <SkeletonLoader.Item style={Styles.genreLoaderCard} />
            <SkeletonLoader.Item style={Styles.genreLoaderCard} />
            <SkeletonLoader.Item style={Styles.genreLoaderCard} />
          </SkeletonLoader>
        </ScrollView>
      ) : state == "error" ? (
        <ErrorCard />
      ) : state == "empty" ? (
        <NoResultsCard noDesc />
      ) : (
        <ThemedView
          style={[
            Styles.verticalListContainer,
            {
              borderColor: "white",
              height: height * 0.53,
              //   borderWidth: 1,
              paddingBottom: 0,
              paddingHorizontal: 0,
            },
          ]}
        >
          <FlatList
            data={data}
            contentContainerStyle={{ paddingBottom: 120 }}
            refreshControl={
              <RefreshControl onRefresh={loader} refreshing={refresh} />
            }
            renderItem={({ item }) => (
              <Card
                name={item.name}
                duration={item.duration}
                image={item.image}
                link={item.link}
                router={router}
              />
            )}
          />
        </ThemedView>
      )}
    </ThemedView>
  );
};

export default Favourites;
