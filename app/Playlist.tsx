import { getFavourites, getPlaylistItems } from "@/api/database";
import Card from "@/components/LibraryCard";
import PagerHeader from "@/components/PagerHeader";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import Styles, { blurhash, height } from "@/style";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import SkeletonLoader from "expo-skeleton-loader";
import { useSQLiteContext } from "expo-sqlite";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { FlatList, ScrollView, useColorScheme } from "react-native";

const Playlist = () => {
  const params = useLocalSearchParams();
  const theme = useColorScheme() ?? "light";
  const [state, setState] = useState<"idle" | "loading" | "error" | "empty">(
    "loading"
  );
  const [data, setData] = useState<any>();
  const router = useRouter();
  const db = useSQLiteContext();
  const loader = async () => {
    let results;
    setState("loading");
    if (params.Title == "Favourites") {
      results = await getFavourites(db);
    } else {
      results = await getPlaylistItems(db, params.Title);
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
        source={require("@/assets/images/icon.png")}
        placeholder={{ blurhash }}
        contentFit="cover"
        transition={1000}
      />
      <PagerHeader
        title={params.Title}
        description={params.Counter + " Songs"}
      />
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
      ) : (
        <ThemedView
          style={[
            Styles.verticalListContainer,
            {
              borderColor: "white",
              height: height * 0.53,
              //   borderWidth: 1,
              paddingBottom: 0,
            },
          ]}
        >
          <FlatList
            data={data}
            contentContainerStyle={{ paddingBottom: 120 }}
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
      <StatusBar hidden />
    </ThemedView>
  );
};

export default Playlist;
