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
import { deleteDownload, deltePlalistItem } from "@/api/database";
import { useDownload } from "@/hooks/downloadContext";
import TrackPlayer from "react-native-track-player";

const Card = ({
  id,
  name,
  image,
  link,
  duration,
  isOnline,
  loaderFunc,
  router,
  index,
  isDownload,
  isDeletable,
  connector,
  list,
  isInPlaylist,
  headPlaylist,
}: rowMusicCardItem) => {
  const {
    songName,
    setSongImageLink,
    setSongName,
    setPlaylist,
    streamSong,
    playList,
    loadPlaylistAndPlay,
    playSpecificTrack,
  } = useAudioPlayer();

  const theme = useColorScheme() ?? "light";
  const { loader } = useDownload();

  const removeFav = async () => {
    Alert.alert(
      "Remove from playlist",
      "Do you wish to remove from this item from the playlist",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          isPreferred: true,
          onPress: async () => {
            await deltePlalistItem(connector, headPlaylist, id);
            await loaderFunc();
          },
          style: "destructive",
        },
      ]
    );
  };
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
    setSongName(name);
    setSongImageLink(image);
    if (list && list != playList && !isOnline) {
      await TrackPlayer.reset();
    }
    if (isOnline && name != songName) {
      streamSong(link, name, image);
      return;
    }
    await loadPlaylistAndPlay(list, index);
    // await playSpecificTrack(name);
  };

  return (
    <TouchableOpacity
      style={Styles.libraryCard}
      onPress={async () => {
        loadPlayList();
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
        if (isInPlaylist) {
          removeFav();
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
          width: width * 0.63,
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
      <TouchableOpacity
        style={{
          justifyContent: "center",

          borderColor: "white",
        }}
        hitSlop={20}
      >
        <AntDesign name="playcircleo" size={25} color={"grey"} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default Card;
