import React, { useEffect, useState } from "react";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { useLocalSearchParams, useRouter } from "expo-router";
import Styles, { blurhash, height, width } from "@/style";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import {
  ActivityIndicator,
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

const PAGE_SIZE = 7;

const Genre = () => {
  const params = useLocalSearchParams();
  const theme = useColorScheme() ?? "light";
  const [loadingMore, setLoadingMore] = useState(false);
  const [state, setState] = useState<"idle" | "loading" | "error" | "empty">(
    "loading"
  );
  const [data, setData] = useState<any[]>([]);
  const [allData, setAllData] = useState<any[]>([]);
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(5);
  const [refresh, setRefresh] = useState<any>(false);

  const loader = async () => {
    try {
      setState("loading");
      const temp: any = await getSpecificGenre(params.Link);

      if (temp.length === 0) {
        setState("empty");
        return;
      }

      // // Remove duplicates based on 'id' or 'name'
      // const uniqueData: any[] = Array.from(
      //   new Map(temp.map((item: any) => [item.name, item])).values()
      // );

      setAllData(temp);
      setData(temp.slice(0, 15));
      setState("idle");
    } catch (error) {
      setState("error");
    }
  };

  const loadMore = () => {
    if (loadingMore || currentIndex >= allData.length) return;
    setLoadingMore(true);
    setTimeout(() => {
      const nextData = allData.slice(currentIndex, currentIndex + PAGE_SIZE);
      setData((prev) => [...prev, ...nextData]);
      setCurrentIndex(currentIndex + PAGE_SIZE);
      setLoadingMore(false);
    }, 1000);
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
              renderItem={({ item }: any) => (
                <Card
                  name={item.name}
                  duration={item?.duration}
                  image={item.image}
                  link={item.link}
                  isDownload={false}
                  router={router}
                  isOnline
                />
              )}
              onEndReached={loadMore} // Trigger pagination
              onEndReachedThreshold={0.5} // Load more when reaching 50% from bottom
              ListFooterComponent={
                loadingMore ? (
                  <ActivityIndicator
                    size="small"
                    color={Colors.Slider.primary}
                  />
                ) : null
              }
            />
          </ThemedView>
          <TouchableOpacity
            style={{
              position: "absolute",
              alignSelf: "center",
              right: 20,
              top: width * 0.93,
            }}
            onPress={() => {
              // playList = data;
              // loadAndPlay();
            }}
          >
            <AntDesign name="play" color={Colors.Slider.primary} size={50} />
          </TouchableOpacity>
        </>
      )}
      <StatusBar hidden={true} />
      <MiniPlayer style={{ bottom: 10 }} />
    </ThemedView>
  );
};

export default Genre;
