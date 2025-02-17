import AnimatedText from "@/components/AnimatedTitle";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import Styles, { blurhash, width } from "@/style";
import { AntDesign, FontAwesome6, Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { Image, ImageBackground } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { Colors } from "@/constants/Colors";
import { get_downloadLink, getFormats, getHashes } from "@/api/q";
import { useSQLiteContext } from "expo-sqlite";
import { deleteFavourite, insertFavourite, isFavourite } from "@/api/database";
import { useAudioPlayer } from "@/hooks/audioPlayer";
import {
  DownloadModal,
  PlayerErrorModal,
  PlayerLoadingModal,
} from "@/components/CustomModals";
import { LinearGradient } from "expo-linear-gradient";

const Player = () => {
  const params = useLocalSearchParams();
  const theme = useColorScheme() ?? "light";
  const {
    loadAndPlay,
    pause,
    resume,
    position,
    duration,
    isPlaying,
    isBuffering,
    stop,
    isLoop,
    setLoop,
    seek,
    setSongLink,
    songName,
    quality,
    setQuality,
  } = useAudioPlayer();

  const [Favourite, setFavourite] = useState(false);
  const [modalVisible, setModalVisible] = useState("error");
  const [downloadQuality, setDownloadQuality] = useState("");
  const db = useSQLiteContext();
  const router = useRouter();
  const handleFavourite = async () => {
    if (songName) {
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
  const [qlt, setQlt] = useState();
  useEffect(() => {
    const isFav = async () => {
      const checkFavourite = await isFavourite(db, params.Name);
      setFavourite(checkFavourite);
    };
    isFav();

    const loader = async () => {
      try {
        setModalVisible("loading");
        const hashes = await getHashes(params.Link);
        setSongLink(params.Link);
        console.log("Player link : ", params.Link);
        const formats = await getFormats(hashes?.video_hash);
        const link = await get_downloadLink(formats["formats"][0]?.payload);
        setQuality(formats["formats"]);

        setModalVisible(false);
        loadAndPlay(link.link, params.Name, params.Image);
      } catch (error) {
        setModalVisible("error");
      }
    };

    if (params?.from || params.Name == songName) {
      setModalVisible(false);
      return;
    }
    stop();
    loader();
    // setModalVisible(false);
  }, []);

  const handlePlayPause = async () => {
    if (isPlaying) {
      pause();
      return;
    } else {
      if (position == duration) {
        seek(0);
        resume();
        return;
      }
      resume();
      return;
    }
  };
  return (
    <ThemedView
      style={[Styles.container, { justifyContent: "center", paddingTop: 0 }]}
    >
      {/* Showing modals */}
      {modalVisible && modalVisible == "download" ? (
        <DownloadModal setVisible={setModalVisible} />
      ) : modalVisible && modalVisible == "error" ? (
        <PlayerErrorModal setVisible={setModalVisible} />
      ) : modalVisible && modalVisible == "loading" ? (
        <PlayerLoadingModal setVisible={setModalVisible} router={router} />
      ) : (
        <></>
      )}

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
        <ThemedText style={{ color: "white" }}>
          {formatTime(position)}
        </ThemedText>
        <Slider
          style={Styles.playerSlider}
          minimumValue={0}
          maximumValue={duration}
          value={position}
          onSlidingComplete={seek}
          minimumTrackTintColor="#e17645"
          maximumTrackTintColor="#4a4a4a"
          thumbTintColor="#e17645"
        />

        <ThemedText style={{ color: "white" }}>
          {formatTime(duration)}
        </ThemedText>
      </View>

      <View style={Styles.playerControlsContainer}>
        <TouchableOpacity style={Styles.playerBtn} onPress={handlePlayPause}>
          {isBuffering ? (
            <View style={[Styles.playerBtn, Styles.bufferingIndicator]}>
              <ActivityIndicator color={Colors.dark.text} size={"large"} />
            </View>
          ) : (
            <></>
          )}
          <AntDesign
            name={isPlaying ? "pausecircleo" : "playcircleo"}
            size={70}
            color={"#e17645"}
          />
        </TouchableOpacity>
      </View>

      {songName && quality ? (
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
            onPress={() => {
              setModalVisible("download");
            }}
          >
            {modalVisible == "download" ? (
              <Ionicons name="cloud-download" size={25} color={"#e17645"} />
            ) : (
              <Ionicons
                name="cloud-download-outline"
                size={25}
                color={Colors.Slider.primary}
              />
            )}
          </TouchableOpacity>
        </View>
      ) : (
        <></>
      )}

      <StatusBar hidden={false} />
    </ThemedView>
  );
};

export default Player;
