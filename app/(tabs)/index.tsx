import { StyleSheet, FlatList } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import Styles from "@/style";
import PagerHeader from "@/components/PagerHeader";
import SearchCard from "@/components/searchCard";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { getSongSearch, shuffleArray } from "@/api/q";
import { ResultCardItem } from "@/components/ResultsCard";
import { useAudioPlayer } from "@/hooks/audioPlayer";

export default function HomeScreen() {
  const router = useRouter();
  const [data, setData] = useState<any>([]);
  const [state, setState] = useState<"idle" | "loading">();
  let { playList } = useAudioPlayer();
  const loader = async () => {
    try {
      setState("loading");
      const results: any = await getSongSearch("Trending+Songs+In+Kenya");
      const shuffleData = shuffleArray(results);
      playList = shuffleData;
      setData(shuffleData);
      setState("idle");
    } catch {
      setState("idle");
    }
  };

  useEffect(() => {
    loader();
  }, []);

  return (
    <ThemedView style={Styles.container}>
      <PagerHeader
        title="Explore"
        description="The home of free endless music"
      />
      <ThemedView style={Styles.verticalListContainer}>
        <SearchCard shouldNavigate={true} inType="songs" />
        <FlatList
          showsVerticalScrollIndicator={false}
          data={data}
          keyExtractor={(item, index) => index.toString()}
          numColumns={2}
          renderItem={({ item }) => (
            <ResultCardItem
              name={item.name}
              link={item.link}
              image={item.image}
              router={router}
            />
          )}
        />
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
