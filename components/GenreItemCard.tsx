import { View, Text, useColorScheme, TouchableOpacity } from "react-native";
import React from "react";
import { useAudioPlayer } from "@/hooks/audioPlayer";
import Styles, { blurhash, width } from "@/style";
import { Image } from "expo-image";
import { ThemedText } from "./ThemedText";
import { Colors } from "@/constants/Colors";
import { rowMusicCardItem } from "@/types";

const Card = ({ name, image, link, duration, router }: rowMusicCardItem) => {
  const {
    songName,
    setSongName,
    playSpecificTrack,
    addAndPlaySingleTrack,
    playList,
  } = useAudioPlayer();

  const theme = useColorScheme() ?? "light";

  return (
    <TouchableOpacity
      style={Styles.libraryCard}
      onPress={() => {
        const track = {
          name: name,
          image: image,
          uri: link,
          duration: duration,
        };
        addAndPlaySingleTrack(track);
        playSpecificTrack(name);
      }}
    >
      <Image
        style={Styles.libraryImageComponent}
        source={image}
        placeholder={{ blurhash }}
        contentFit="cover"
        transition={1000}
      />
      <View
        style={{
          width: width * 0.65,
          marginVertical: 5,
        }}
      >
        <ThemedText
          numberOfLines={1}
          style={{
            fontSize: 12,
            color:
              songName == name
                ? Colors.Slider.primary
                : Colors[theme ?? "light"].text,
          }}
        >
          {name}
        </ThemedText>
        <ThemedText style={{ fontSize: 11 }}>{duration}</ThemedText>
      </View>
      {/* <TouchableOpacity style={{ justifyContent: "center" }} hitSlop={20}>
        <AntDesign name="playcircleo" size={25} color={"grey"} />
      </TouchableOpacity> */}
    </TouchableOpacity>
  );
};

export default Card;
