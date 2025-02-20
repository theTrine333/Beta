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
  const { playList, setPlaylist, isPlaying } = useAudioPlayer();
  const [deleteList, setDeleteList] = useState();
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
    setRefresh(false);
    setState("idle");
  };

  useEffect(() => {
    loader();
  }, []);

  return (
    <ThemedView style={[Styles.container, { padding: 10, paddingTop: 10 }]}>
      <SearchCard inType="songs" shouldNavigate Parent="downloads" />
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
              maxHeight:
                isPlaying || currentDownload ? height * 0.55 : height * 0.63,
              paddingBottom: 0,
              // borderWidth: 1,
              paddingHorizontal: 0,
            },
          ]}
        >
          {/* Active Download Section */}
          {currentDownload && (
            <DownloadCard
              loaderFunc={loader}
              title={currentDownload.name}
              position={progress}
              image={currentDownload.image}
              duration={currentDownload.duration}
            />
          )}

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
              <ThemedView style={{ borderWidth: 1, maxHeight: height * 0.2 }}>
                <FlatList
                  contentContainerStyle={{
                    marginBottom: 10,
                    paddingBottom: 10,
                    borderWidth: 1,
                    borderColor: Colors[theme ?? "light"].text,
                    borderBottomWidth: 1,
                  }}
                  data={downloadQueue.filter(
                    (item: any) => item.name !== currentDownload?.name
                  )}
                  renderItem={({ item }) => (
                    <DownloadCard
                      title={item.name}
                      image={item.image}
                      isQueue
                      duration={item.duration}
                    />
                  )}
                />
              </ThemedView>
            </>
          )}

          {/* Downloaded Files Section */}

          <ThemedView>
            <FlatList
              data={downloadedFiles}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl onRefresh={loader} refreshing={refresh} />
              }
              renderItem={({ item }) => (
                <Card
                  list={downloadedFiles}
                  connector={db}
                  name={item.name}
                  duration={formatTime(item.duration)}
                  image={item.image}
                  link={item.uri} // Using the uri for downloaded file
                  router={router}
                  isDeletable
                  isDownload
                />
              )}
            />
          </ThemedView>
        </ThemedView>
      )}
    </ThemedView>
  );
};

export default Downloads;
