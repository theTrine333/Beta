import React from "react";
import { rowMusicCardItem } from "@/types";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import Styles, { blurhash, width } from "@/style";
import { Image } from "expo-image";
import { TouchableOpacity, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";

const Card = ({ name, image, link, duration, router }: rowMusicCardItem) => {
  return (
    <TouchableOpacity
      style={Styles.libraryCard}
      onPress={() => {
        router.push({
          pathname: "player",
          params: {
            Name: name,
            Image: image,
            duration: duration,
            Link: link,
          },
        });
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
          width: width * 0.55,
          marginVertical: 5,
        }}
      >
        <ThemedText numberOfLines={1} style={{ fontSize: 12 }}>
          {name}
        </ThemedText>
        <ThemedText style={{ fontSize: 11 }}>{duration}</ThemedText>
      </View>
      <TouchableOpacity style={{ justifyContent: "center" }} hitSlop={20}>
        <AntDesign name="playcircleo" size={25} color={"grey"} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default Card;
