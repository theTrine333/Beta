import React, { useEffect, useState } from "react";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { useLocalSearchParams, useRouter } from "expo-router";
import Styles, { blurhash, height, width } from "@/style";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import {
  FlatList,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { Colors } from "@/constants/Colors";
import { StatusBar } from "expo-status-bar";
import { getSpecificGenre } from "@/api/q";
import Card from "@/components/LibraryCard";
import SkeletonLoader from "expo-skeleton-loader";
import { ErrorCard, NoResultsCard } from "@/components/ResultsCard";
import MiniPlayer from "@/components/MiniPlayer";
import { AntDesign } from "@expo/vector-icons";
import { useAudioPlayer } from "@/hooks/audioPlayer";
const Genre = () => {
  const params = useLocalSearchParams();
  const theme = useColorScheme() ?? "light";
  const [state, setState] = useState<"idle" | "loading" | "error" | "empty">(
    "loading"
  );
  const [data, setData] = useState<any>();
  const router = useRouter();
  const [refresh, setRefresh] = useState(false);

  const loader = async () => {
    try {
      setState("loading");
      const temp = await getSpecificGenre(params.Link);
      if (temp.length == 0) {
        setState("empty");
        return;
      }
      setPlaylist(temp);
      setData(temp);
      setState("idle");
    } catch (error) {
      setState("error");
    }
  };

  useEffect(() => {
    loader();
  }, []);

  let { setPlaylist, loadAndPlay } = useAudioPlayer();
  return (
    <ThemedView style={{ flex: 1 }}>
      <Image
        style={Styles.genreImage}
        source={params.Image}
        placeholder={{ blurhash }}
        contentFit="cover"
        transition={1000}
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
      ) : state == "error" ? (
        <ErrorCard />
      ) : state == "empty" ? (
        <NoResultsCard />
      ) : (
        <>
          <ThemedView
            style={[
              Styles.verticalListContainer,
              {
                borderColor: "white",
                height: height * 0.53,
                paddingBottom: 0,
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
                  isDownload={false}
                  router={router}
                />
              )}
            />
          </ThemedView>
          {/* <TouchableOpacity
            style={{
              position: "absolute",
              alignSelf: "center",
              right: 20,
              top: width * 0.93,
            }}
            onPress={() => {
              playList = data;
              loadAndPlay();
            }}
          >
            <AntDesign name="play" color={Colors.Slider.primary} size={50} />
          </TouchableOpacity> */}
        </>
      )}
      <StatusBar hidden={true} />
      <MiniPlayer style={{ bottom: 10 }} />
    </ThemedView>
  );
};

export default Genre;
