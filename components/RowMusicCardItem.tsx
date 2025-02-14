import React from "react";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import { rowMusicCardItem } from "@/types";
import { Image } from "expo-image";
import Styles, { blurhash } from "@/style";
import { TouchableOpacity } from "react-native";

const MusicCardItem = ({ name, image, link, duration }: rowMusicCardItem) => {
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

export default MusicCardItem;
