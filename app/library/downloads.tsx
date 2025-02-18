import {
  ScrollView,
  FlatList,
  RefreshControl,
  useColorScheme,
} from "react-native";
import React, { useEffect, useState } from "react";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import Styles, { height } from "@/style";
import { useSQLiteContext } from "expo-sqlite";
import { useRouter } from "expo-router";
import { getDownloads } from "@/api/database";
import SearchCard from "@/components/searchCard";
import SkeletonLoader from "expo-skeleton-loader";
import { ErrorCard, NoResultsCard } from "@/components/ResultsCard";
import Card from "@/components/LibraryCard";
import { useDownload } from "@/hooks/downloadContext";
import { DownloadCard } from "@/components/CustomModals";
import { formatTime } from "@/api/q";
import { Colors } from "@/constants/Colors";
import { useAudioPlayer } from "@/hooks/audioPlayer";

const Downloads = () => {
  const db = useSQLiteContext();
  const router = useRouter();
  const theme = useColorScheme() ?? "light";
  const { playList, setPlaylist } = useAudioPlayer();
  const { downloadQueue, currentDownload, progress, downloadedFiles } =
    useDownload();
  const [data, setData] = useState([]);
  const [state, setState] = useState<"idle" | "loading" | "empty" | "error">(
    "idle"
  );
  const [refresh, setRefresh] = useState(false);

  const loader = async () => {
    const results = await getDownloads(db);
    setData(results);
    setPlaylist(results);
    setRefresh(false);
  };

  useEffect(() => {
    loader();
  }, []);

  return (
    <ThemedView style={[Styles.container, { padding: 10, paddingTop: 10 }]}>
      <SearchCard inType="downloads" shouldNavigate />
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
              height: height * 0.63,
              paddingBottom: 80,
              paddingHorizontal: 0,
            },
          ]}
        >
          {/* Active Download Section */}
          {currentDownload && (
            <DownloadCard
              title={currentDownload.name}
              position={progress}
              image={currentDownload.image}
              duration={currentDownload.duration}
            />
          )}

          {/* Downloaded Files Section */}
          <ThemedView>
            <FlatList
              data={downloadedFiles}
              contentContainerStyle={{}}
              refreshControl={
                <RefreshControl onRefresh={loader} refreshing={refresh} />
              }
              renderItem={({ item }) => (
                <Card
                  name={item.name}
                  duration={formatTime(item.duration)}
                  image={item.image}
                  link={item.uri} // Using the uri for downloaded file
                  router={router}
                  isDownload
                />
              )}
            />
          </ThemedView>

          {/* Queue Section */}
          {downloadQueue.length > 1 && (
            <>
              <ThemedText
                style={{
                  color: Colors.Slider.primary,
                  fontSize: 18,
                  fontWeight: "bold",
                  marginTop: 10,
                  paddingLeft: 10,
                }}
              >
                Queue:
              </ThemedText>
              <FlatList
                data={downloadQueue.filter(
                  (item: any) => item.name !== currentDownload?.name
                )}
                contentContainerStyle={{ paddingBottom: 120 }}
                renderItem={({ item }) => (
                  <DownloadCard
                    title={item.name}
                    image={item.image}
                    duration={item.duration}
                  />
                )}
              />
            </>
          )}
        </ThemedView>
      )}
    </ThemedView>
  );
};

export default Downloads;
