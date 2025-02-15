import { StyleSheet, FlatList } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import Styles from "@/style";
import PagerHeader from "@/components/PagerHeader";
import RowMusicCard from "@/components/RowMusicCard";
import SearchCard from "@/components/searchCard";

const data = [
  {
    Title: "Recent",
    url: "recently-viewed",
    url_type: "local",
  },
  {
    Title: "Most played",
    url: "most-played",
    url_type: "local",
  },
  {
    Title: "Willy Paul",
    url: "willy+paul",
    url_type: "global",
  },
  {
    Title: "Migos",
    url: "migos",
    url_type: "global",
  },
];

export default function HomeScreen() {
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
          // keyExtractor={({ item }) =>(item.url)}
          renderItem={({ item }) => (
            <RowMusicCard
              Title={item.Title}
              url={item.url}
              url_path={item.url_type}
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
