import {
  getDownloadsSearch,
  getFavouritesSearch,
  getGenreSearch,
} from "@/api/database";
import { formatTime, getSongSearch } from "@/api/q";
import GenreMusicCardItem from "@/components/GenreMusicCardItem";
import Card from "@/components/LibraryCard";
import MiniPlayer from "@/components/MiniPlayer";
import {
  ErrorCard,
  NoResultsCard,
  ResultCardItem,
} from "@/components/ResultsCard";
import SearchCard from "@/components/searchCard";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useAudioPlayer } from "@/hooks/audioPlayer";
import Styles, { height } from "@/style";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, RefreshControl } from "react-native";

const Search = () => {
  const params = useLocalSearchParams();
  const type = params.inType;
  const Parent = params.Parent;
  const db = useSQLiteContext();
  const router = useRouter();
  const [data, setData] = useState<any>();
  const [text, setText] = useState(params.word);
  const [state, setState] = useState<"idle" | "loading" | "empty" | "error">(
    "idle"
  );
  const [refresh, setRefresh] = useState(false);
  const { playList, setPlaylist } = useAudioPlayer();

  const loader = async () => {
    let results;
    try {
      setState("loading");
      if (Parent == "songs") {
        results = await getSongSearch(text);
      } else if (Parent == "downloads") {
        results = await getDownloadsSearch(db, text);
        // setPlaylist(results);
      } else if (Parent == "favourites") {
        results = await getFavouritesSearch(db, text);
        // setPlaylist(results);
      } else if (Parent == "genres") {
        results = await getGenreSearch(db, text);
      }

      if (results.length == 0) {
        setState("empty");
        return;
      }
      setData(results);
      setState("idle");
    } catch (error) {
      setState("error");
    }
  };

  useEffect(() => {
    loader();
  }, []);

  return (
    <ThemedView style={Styles.container}>
      <SearchCard
        word={params.word}
        action={loader}
        setter={setText}
        Parent="songs"
      />
      <ThemedView
        style={{
          //   borderWidth: 1,
          borderColor: "white",
          height: height * 0.8,
          paddingHorizontal: 10,
        }}
      >
        {state == "loading" ? (
          <ActivityIndicator color={Colors.Slider.primary} />
        ) : state == "error" ? (
          <ErrorCard />
        ) : state == "empty" ? (
          <NoResultsCard />
        ) : type == "songs" && Parent == "downloads" ? (
          <ThemedView>
            <FlatList
              data={data}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl onRefresh={loader} refreshing={refresh} />
              }
              renderItem={({ item, index }) => (
                <Card
                  index={index}
                  list={data}
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
        ) : type == "songs" ? (
          <FlatList
            data={data}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            numColumns={2}
            contentContainerStyle={{ gap: 10 }}
            refreshControl={
              <RefreshControl onRefresh={loader} refreshing={refresh} />
            }
            renderItem={({ item }) => (
              <ResultCardItem
                isSearch
                name={item.name}
                link={item.link}
                image={item.image}
                router={router}
              />
            )}
          />
        ) : (
          <FlatList
            data={data}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            numColumns={2}
            contentContainerStyle={{ gap: 10 }}
            refreshControl={
              <RefreshControl onRefresh={loader} refreshing={refresh} />
            }
            renderItem={({ item }) => (
              <GenreMusicCardItem
                name={item.Name}
                link={item.Link}
                image={item.Poster}
                router={router}
              />
            )}
          />
        )}
      </ThemedView>
      <MiniPlayer style={{ bottom: 20 }} router={router} />
    </ThemedView>
  );
};

export default Search;
