import AnimatedText from "@/components/AnimatedTitle";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import Styles, { blurhash, width } from "@/style";
import { AntDesign, FontAwesome6, Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { Image, ImageBackground } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { Colors } from "@/constants/Colors";
import { get_downloadLink, getFormats, getHashes } from "@/api/q";
import { useSQLiteContext } from "expo-sqlite";
import { deleteFavourite, insertFavourite, isFavourite } from "@/api/database";
import Toggle from "@/components/FormatToggle";
import { useAudioPlayer } from "@/hooks/audioPlayer";

const Player = () => {
  const params = useLocalSearchParams();
  const theme = useColorScheme() ?? "light";
  const {
    loadAndPlay,
    pause,
    position,
    duration,
    isPlaying,
    isBuffering,
    isLoop,
    setLoop,
  } = useAudioPlayer();

  const [songLink, setSongLink] = useState("");
  const [Favourite, setFavourite] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [downloadQuality, setDownloadQuality] = useState("");
  const db = useSQLiteContext();

  const handleFavourite = async () => {
    if (songLink) {
      if (Favourite) {
        deleteFavourite(db, params.Name);
        setFavourite(false);
        return;
      }
      insertFavourite(db, params.Name, params.Image, params.Link, "songs");
      setFavourite(true);
    }
  };

  const formatTime = (millis) => {
    const minutes = Math.floor(millis / 60000);
    const seconds = ((millis % 60000) / 1000).toFixed(0);
    return `${minutes}:${parseInt(seconds) < 10 ? "0" : ""}${seconds}`;
  };

  useEffect(() => {
    const loader = async () => {
      const checkFavourite = await isFavourite(db, params.Name);
      setFavourite(checkFavourite);
      const hashes = await getHashes(params.Link);
      const formats = await getFormats(hashes.video_hash);
      const link = await get_downloadLink(formats["formats"][0].payload);
      setSongLink(link.link);
      loadAndPlay(link.link, params.Name, params.Image);
    };

    if (params?.from) {
      return;
    }
    console.log(params);

    loader();
  }, []);

  return (
    <ThemedView style={[Styles.container, { justifyContent: "center" }]}>
      <ImageBackground
        source={params.Image}
        style={StyleSheet.absoluteFill}
        blurRadius={100}
      />
      <Image
        style={Styles.playerImage}
        source={params.Image}
        placeholder={{ blurhash }}
        contentFit="cover"
        transition={1000}
      />
      <AnimatedText text={params.Name} />
      <View style={Styles.durationHolder}>
        <ThemedText>{formatTime(position)}</ThemedText>
        <Slider
          style={Styles.playerSlider}
          minimumValue={0}
          maximumValue={duration}
          value={position}
          onSlidingComplete={(value) =>
            loadAndPlay(link.link, params.Name, params.Image, value)
          }
          minimumTrackTintColor="#e17645"
          maximumTrackTintColor="#4a4a4a"
          thumbTintColor="#e17645"
        />
        <ThemedText>{formatTime(duration)}</ThemedText>
      </View>
      <View style={Styles.playerControlsContainer}>
        <TouchableOpacity style={Styles.playerBtn} onPress={pause}>
          {isBuffering ? (
            <View style={[Styles.playerBtn, Styles.bufferingIndicator]}>
              <ActivityIndicator color={Colors.dark.text} size={"small"} />
            </View>
          ) : (
            <></>
          )}
          <AntDesign
            name={isPlaying ? "pausecircle" : "play"}
            size={70}
            color={"#e17645"}
          />
        </TouchableOpacity>
      </View>
      <View style={[Styles.playerControlsContainer, { gap: 20 }]}>
        <TouchableOpacity style={Styles.playerBtn} onPress={handleFavourite}>
          <Ionicons
            name={Favourite ? "heart" : "heart-outline"}
            size={25}
            color={"#e17645"}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={Styles.playerBtn}
          onPress={() => setLoop(!isLoop)}
        >
          <Ionicons
            name={isLoop ? "repeat" : "repeat-outline"}
            size={25}
            color={"#e17645"}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={Styles.playerBtn}
          onPress={() => setModalVisible("downloads")}
        >
          <Ionicons name="cloud-download-outline" size={25} color={"#e17645"} />
        </TouchableOpacity>
      </View>
      <StatusBar hidden={false} />
    </ThemedView>
  );
};

export default Player;
