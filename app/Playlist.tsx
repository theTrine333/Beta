import { getFavourites, getPlaylistItems } from "@/api/database";
import Card from "@/components/LibraryCard";
import MiniPlayer from "@/components/MiniPlayer";
import PagerHeader from "@/components/PagerHeader";
import { ErrorCard, NoResultsCard } from "@/components/ResultsCard";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useAudioPlayer } from "@/hooks/audioPlayer";
import Styles, { blurhash, height } from "@/style";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import SkeletonLoader from "expo-skeleton-loader";
import { useSQLiteContext } from "expo-sqlite";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  RefreshControl,
  ScrollView,
  useColorScheme,
} from "react-native";

const Playlist = () => {
  const params = useLocalSearchParams();
  const theme = useColorScheme() ?? "light";
  const [state, setState] = useState<"idle" | "loading" | "error" | "empty">(
    "loading"
  );
  const { isPlaying } = useAudioPlayer();
  const [data, setData] = useState<any>();
  const router = useRouter();
  const db = useSQLiteContext();
  const [refresh, setRefresh] = useState(false);
  const loader = async () => {
    let results;
    setState("loading");
    if (params.Title == "Favourites") {
      results = await getFavourites(db);
    } else {
      results = await getPlaylistItems(db, params.Title);
    }
    if (results.length == 0) {
      setState("empty");
      return;
    }
    setData(results);
    setState("idle");
  };

  useEffect(() => {
    loader();
  }, []);

  return (
    <ThemedView style={{ flex: 1 }}>
      <Image
        style={Styles.genreImage}
        source={
          data ? { uri: data[0].image } : require("@/assets/images/icon.png")
        }
        placeholder={{ blurhash }}
        contentFit="cover"
        transition={1000}
      />
      <PagerHeader title={params.Title} description={"Songs"} />
      <LinearGradient
        colors={["transparent", Colors[theme ?? "light"].background]} // Adjust colors for fade effect
        style={Styles.genreGradient}
      />
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
              height: isPlaying ? height * 0.4 : height * 0.45,
              // borderWidth: 1,
              paddingBottom: 20,
            },
          ]}
        >
          <FlatList
            data={data}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl onRefresh={loader} refreshing={refresh} />
            }
            contentContainerStyle={{ gap: 3 }}
            renderItem={({ item }) => (
              <Card
                name={item.name}
                image={item.image}
                link={item.link} // Using the uri for downloaded file
                router={router}
                isDownload
                list={data}
              />
            )}
          />
        </ThemedView>
      )}
      <MiniPlayer style={{ bottom: 10 }} />
      <StatusBar hidden />
    </ThemedView>
  );
};

export default Playlist;
