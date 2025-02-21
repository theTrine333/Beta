import React from "react";
import { rowMusicCardItem } from "@/types";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import Styles, { blurhash, width } from "@/style";
import { Image } from "expo-image";
import { Alert, TouchableOpacity, useColorScheme, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { useAudioPlayer } from "@/hooks/audioPlayer";
import { Colors } from "@/constants/Colors";
import { deleteDownload } from "@/api/database";
import { useDownload } from "@/hooks/downloadContext";

const Card = ({
  name,
  image,
  link,
  duration,
  isOnline,
  router,
  isDownload,
  isDeletable,
  connector,
  list,
}: rowMusicCardItem) => {
  const {
    songName,
    setSongImageLink,
    setSongName,
    setPlaylist,
    playList,
    isPlaying,
    addAndPlaySingleTrack,
    playSpecificTrack,
  } = useAudioPlayer();
  const theme = useColorScheme() ?? "light";
  const { loader } = useDownload();

  const deleteFunc = async () => {
    Alert.alert("Delete", "Do you wish to delete this item", [
      { text: "No, It's a mistake", isPreferred: true, style: "cancel" },
      {
        text: "Confirm",
        style: "destructive",
        onPress: async () => {
          await deleteDownload(connector, name, loader);
        },
      },
    ]);
  };

  const loadPlayList = async () => {
    if (playList == list) {
      playSpecificTrack(name);
      return;
    }
    await setPlaylist(list);
  };

  return (
    <TouchableOpacity
      style={Styles.libraryCard}
      onPress={async () => {
        setSongName(name);
        if (isOnline) {
          addAndPlaySingleTrack({
            name: name,
            image: image,
            link: link,
          });
          // return;
        }
        if (list && list != playList && !isOnline) {
          await loadPlayList();
        }

        playSpecificTrack(name);

        if (isDownload) {
          router.push({
            pathname: "player",
            params: {
              Name: name,
              Image: image,
              duration: duration,
              Link: link,
              isDownload: true,
            },
          });
          return;
        }
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
      onLongPress={() => {
        if (isDeletable) {
          deleteFunc();
        }
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
      <TouchableOpacity style={{ justifyContent: "center" }} hitSlop={20}>
        <AntDesign name="playcircleo" size={25} color={"grey"} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default Card;
