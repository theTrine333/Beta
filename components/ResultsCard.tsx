import { Ionicons } from "@expo/vector-icons";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import { StyleSheet, TouchableOpacity, useColorScheme } from "react-native";
import { Colors } from "@/constants/Colors";
import { Image } from "expo-image";
import Styles, { blurhash } from "@/style";
import { genreItemTypes, NoResultCardProp } from "@/types";
import { useAudioPlayer } from "@/hooks/audioPlayer";

export const ResultCardItem = ({
  name,
  link,
  image,
  isSearch,
  router,
}: genreItemTypes) => {
  const { setPlaylist, setSongImageLink } = useAudioPlayer();
  return (
    <TouchableOpacity
      onPress={() => {
        setSongImageLink(image);
        if (isSearch) {
          setPlaylist([{ name: name, link: link, image: image }]);
        }
        router.push({
          pathname: "player",
          params: {
            Name: name,
            Link: link,
            Image: image,
          },
        });
      }}
    >
      <Image
        style={Styles.rowImageComponent}
        source={image}
        placeholder={{ blurhash }}
        contentFit="cover"
        transition={1000}
      />
      <ThemedText style={Styles.rowMusicItemTitle} numberOfLines={2}>
        {name}
      </ThemedText>
    </TouchableOpacity>
  );
};
export const NoResultsCard = ({ noDesc }: NoResultCardProp) => {
  const theme = useColorScheme() ?? "light";
  return (
    <ThemedView
      style={[
        styles.container,
        {
          shadowColor: Colors[theme ?? "light"].text,
        },
      ]}
    >
      <Ionicons name="search-outline" size={50} color="gray" />
      <ThemedText style={styles.text}>No Results Found</ThemedText>
      {noDesc ? (
        <></>
      ) : (
        <ThemedText style={styles.subtext}>
          Try searching for something else.
        </ThemedText>
      )}
    </ThemedView>
  );
};

export const ErrorCard = ({
  message = "Something went wrong. Please try again!",
}) => {
  const theme = useColorScheme() ?? "light";
  return (
    <ThemedView
      style={[
        styles.container,
        {
          shadowColor: Colors[theme ?? "light"].text,
        },
      ]}
    >
      <Ionicons name="alert-circle-outline" size={50} color="red" />
      <ThemedText style={styles.text}>Error Occurred</ThemedText>
      <ThemedText style={styles.subtext}>{message}</ThemedText>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#fff",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    margin: 20,
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    color: "gray",
    marginTop: 10,
  },
  subtext: {
    fontSize: 14,
    color: "gray",
    marginTop: 5,
  },
});
