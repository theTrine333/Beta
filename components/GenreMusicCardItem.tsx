import React from "react";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import { genreItemTypes } from "@/types";
import { Image } from "expo-image";
import Styles, { blurhash } from "@/style";
import { TouchableOpacity } from "react-native";

const GenreMusicCardItem = ({ name, link, image }: genreItemTypes) => {
  return (
    <TouchableOpacity>
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

export default GenreMusicCardItem;
