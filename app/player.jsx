import AnimatedText from "@/components/AnimatedTitle";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import Styles, { blurhash, height, width } from "@/style";
import {
  AntDesign,
  FontAwesome6,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";

import Slider from "@react-native-community/slider";
import { Image, ImageBackground } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";

import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

import { Colors } from "@/constants/Colors";
import { formatTime, get_downloadLink, getFormats, getHashes } from "@/api/q";
import { useSQLiteContext } from "expo-sqlite";
import {
  deleteFavourite,
  deltePlalistItem,
  insertFavourite,
  insertPlaylistItem,
  isDownload,
  isFavourite,
} from "@/api/database";
import { useAudioPlayer } from "@/hooks/audioPlayer";
import {
  AddToPlalistModal,
  DownloadModal,
  MoreOptionsModal,
  PlayerErrorModal,
  PlayerLoadingModal,
  PlaylistModal,
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
    songLink,
    setSongLink,
    songImageLink,
    songName,
    quality,
    setQuality,
    previousSong,
    nextSong,
    setSongImageLink,
    playSpecificTrack,
  } = useAudioPlayer();

  const [Favourite, setFavourite] = useState(false);
  const [modalVisible, setModalVisible] = useState("error");
  const db = useSQLiteContext();
  const router = useRouter();
  const forward10 = async () => {
    await seek(position + 10000);
  };
  const back10 = async () => {
    await seek(position - 10000);
  };
  const handleFavourite = async () => {
    if (songName) {
      if (Favourite) {
        await deltePlalistItem(db, songLink);
        setFavourite(false);
        return;
      }
      await insertPlaylistItem(
        db,
        songName,
        songImageLink,
        songLink,
        "favourites"
      );
      setFavourite(true);
    }
  };

  const [qlt, setQlt] = useState();

  useEffect(() => {
    const isFav = async () => {
      try {
        const checkFavourite = await isFavourite(db, params.Name);
        setFavourite(checkFavourite);
      } catch {
        setFavourite(false);
      }
    };

    isFav();
  }, [songName]);

  useEffect(() => {
    // setSongImageLink(params.image);

    const loader = async () => {
      try {
        setModalVisible("loading");
        const hashes = await getHashes(params.Link);
        setSongLink(params.Link);
        const formats = await getFormats(hashes?.video_hash);
        const link = await get_downloadLink(formats["formats"][0]?.payload);
        setQuality(formats["formats"]);
        setModalVisible(false);
        playSpecificTrack(params.Name);
        // loadAndPlay(link.link, params.Name, params.Image);
      } catch (error) {
        setModalVisible("error");
      }
    };
    if (params?.from || params.Name == songName) {
      setModalVisible(false);
      return;
    }
    stop();

    if (params?.isDownload) {
      setModalVisible(false);
      playSpecificTrack(params.Name);
      return;
    }

    loader();
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
      style={[
        Styles.container,
        { justifyContent: "flex-end", paddingTop: 0, paddingBottom: 20 },
      ]}
    >
      {/* Showing modals */}
      {modalVisible && modalVisible == "download" ? (
        <DownloadModal setVisible={setModalVisible} />
      ) : modalVisible && modalVisible == "error" ? (
        <PlayerErrorModal setVisible={setModalVisible} />
      ) : modalVisible && modalVisible == "loading" ? (
        <PlayerLoadingModal setVisible={setModalVisible} router={router} />
      ) : modalVisible && modalVisible == "list" ? (
        <PlaylistModal setVisible={setModalVisible} />
      ) : modalVisible && modalVisible == "more-options" ? (
        <MoreOptionsModal setVisible={setModalVisible} />
      ) : modalVisible && modalVisible == "add-to-playlist" ? (
        <AddToPlalistModal setVisible={setModalVisible} />
      ) : (
        <></>
      )}

      <ImageBackground
        source={songImageLink}
        style={StyleSheet.absoluteFill}
        blurRadius={100}
      />
      {/* Top buttons */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: 20,
          position: "absolute",
          top: 60,
          width: width,
        }}
      >
        <TouchableOpacity
          hitSlop={20}
          onPress={() => {
            router.back();
          }}
        >
          <Ionicons name="arrow-back-outline" size={25} color={"white"} />
        </TouchableOpacity>
        {songLink?.includes("file://") ? (
          <TouchableOpacity
            hitSlop={20}
            onPress={() => {
              setModalVisible("more-options");
            }}
          >
            <MaterialCommunityIcons
              name="dots-vertical"
              size={25}
              color={"white"}
            />
          </TouchableOpacity>
        ) : (
          <></>
        )}
      </View>
      <Image
        style={Styles.playerImage}
        source={songImageLink}
        placeholder={{ blurhash }}
        contentFit="cover"
        transition={1000}
      />
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginHorizontal: 10,
          paddingLeft: 10,
          paddingRight: 20,
          marginTop: 20,
          height: height * 0.06,
        }}
      >
        <TouchableOpacity
          hitSlop={20}
          style={[
            Styles.playerBtn,
            { alignItems: "center", justifyContent: "center" },
          ]}
          onPress={handleFavourite}
        >
          <Ionicons
            name={Favourite ? "heart" : "heart-outline"}
            size={25}
            color={"white"}
          />
        </TouchableOpacity>
        <ThemedText
          style={{
            fontSize: 14,
            borderColor: "white",
            // borderWidth: 1,
            textAlign: "center",
            width: width * 0.63,
          }}
          numberOfLines={1}
        >
          {songName}
        </ThemedText>
        {/* <AnimatedText text={songName} /> */}
        {/* <View style={{ width: width * 0.65 }}>
          <Text style={{ flexWrap: 1, color: "white" }} numberOfLines={1}>
            {songName}
          </Text>
        </View> */}

        <TouchableOpacity
          style={Styles.playerBtn}
          onPress={() => setLoop(!isLoop)}
          hitSlop={20}
        >
          {isLoop ? (
            <FontAwesome6 name={"repeat"} size={23} color={"white"} />
          ) : (
            <Ionicons name={"repeat"} size={25} color={"white"} />
          )}
        </TouchableOpacity>
      </View>

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
        {/* {quality && duration && !params.isDownload ? ( */}

        <TouchableOpacity
          hitSlop={20}
          style={[
            Styles.playerBtn,
            { opacity: songLink?.includes("file://") ? 0.5 : 1 },
          ]}
          onPress={() => {
            setModalVisible("download");
          }}
          disabled={songLink?.includes("file://")}
        >
          {modalVisible == "download" ? (
            <Ionicons name="cloud-download" size={25} color={"#e17645"} />
          ) : (
            <Ionicons name="cloud-download-outline" size={25} color={"white"} />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={Styles.playerBtn}
          hitSlop={20}
          onPress={() => {
            previousSong();
          }}
        >
          <AntDesign name="stepbackward" size={25} color={"white"} />
        </TouchableOpacity>
        <TouchableOpacity
          style={Styles.playerBtn}
          hitSlop={20}
          onPress={handlePlayPause}
        >
          {isBuffering && songLink?.includes("https://") ? (
            <View style={[Styles.playerBtn, Styles.bufferingIndicator]}>
              <ActivityIndicator
                color={Colors.Slider.background}
                size={"large"}
              />
            </View>
          ) : (
            <></>
          )}
          <AntDesign
            name={isPlaying ? "pausecircleo" : "playcircleo"}
            size={50}
            color={"white"}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={Styles.playerBtn}
          hitSlop={20}
          onPress={() => {
            nextSong();
          }}
        >
          <AntDesign name="stepforward" size={25} color={"white"} />
        </TouchableOpacity>
        <TouchableOpacity
          style={Styles.playerBtn}
          hitSlop={20}
          onPress={() => {
            setModalVisible("list");
          }}
        >
          <MaterialCommunityIcons
            name="playlist-music-outline"
            size={30}
            color={"white"}
          />
        </TouchableOpacity>
      </View>

      <View
        style={[
          Styles.playerControlsContainer,
          { marginTop: 5, justifyContent: "space-between" },
        ]}
      >
        <TouchableOpacity
          hitSlop={20}
          style={Styles.playerBtn}
          onPress={back10}
        >
          <MaterialIcons name="replay-10" size={25} color={"white"} />
        </TouchableOpacity>
        {/* Remember to move this after fixing pitch setting */}
        <TouchableOpacity
          hitSlop={20}
          disabled
          style={[
            Styles.playerBtn,
            {
              borderWidth: 2,
              alignSelf: "center",
              borderRadius: 8,
              borderColor: "white",
              height: height * 0.04,
              paddingVertical: 0,
              opacity: 0.5,
            },
          ]}
        >
          <ThemedText
            style={{
              fontSize: 11,
              color: "white",
              fontWeight: "bold",
            }}
          >
            1.0X
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={Styles.playerBtn}
          hitSlop={20}
          onPress={forward10}
        >
          <MaterialIcons name="forward-10" size={25} color={"white"} />
        </TouchableOpacity>
      </View>
      <StatusBar hidden={false} style="light" />
    </ThemedView>
  );
};

export default Player;
