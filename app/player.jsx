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
import { Audio } from "expo-av";
import { Colors } from "@/constants/Colors";
import { get_downloadLink, getFormats, getHashes } from "@/api/q";
import { useSQLiteContext } from "expo-sqlite";
import { deleteFavourite, insertFavourite, isFavourite } from "@/api/database";
import { BlurView } from "expo-blur";
import Toggle from "@/components/FormatToggle";
const Player = () => {
  const params = useLocalSearchParams();
  const theme = useColorScheme() ?? "light";
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(1);
  const [isBuffering, setIsBuffering] = useState(false);
  const [songLink, setSongLink] = useState("");
  const [isLoop, setLoop] = useState(false);
  const [Favourite, setFavourite] = useState(false);
  const [modalVisible, setModalVisible] = useState(false); // "idle" | "downloads" | "list" | "options"
  const [downloadQuality, setDownloadQuality] = useState("");
  const db = useSQLiteContext();

  const handleFavourite = async () => {
    if (songLink) {
      if (Favourite) {
        deleteFavourite(db, params.Name);
        setFavourite(false);
        return;
      }
      insertFavourite(db, params.Name, params.Image, songLink, "songs");
      setFavourite(true);
    }
  };

  const formatTime = (millis) => {
    const minutes = Math.floor(millis / 60000);
    const seconds = ((millis % 60000) / 1000).toFixed(0);
    return `${minutes}:${parseInt(seconds) < 10 ? "0" : ""}${seconds}`;
  };

  const [mp3, setMp3] = useState("");
  const loader = async () => {
    setIsBuffering(true);
    const checkFavourite = await isFavourite(db, params.Name);
    setFavourite(checkFavourite);
    const hashes = await getHashes(params.Link);
    const formats = await getFormats(hashes.video_hash);
    setMp3(formats["formats"][0].size);
    const link = await get_downloadLink(formats["formats"][0].payload);
    setSongLink(link.link);
    setIsBuffering(false);
  };

  useEffect(() => {
    loader();
  }, []);

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  const loadAndPlay = async () => {
    if (!sound) {
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: songLink },
        { shouldPlay: true },
        onPlaybackStatusUpdate
      );
      setSound(newSound);
      setIsPlaying(true);
      newSound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
    } else {
      await sound.playAsync();
      setIsPlaying(true);
    }
  };

  const onPlaybackStatusUpdate = (status) => {
    if (!status.isLoaded) return;

    setPosition(status.positionMillis);
    setDuration(status.durationMillis);

    if (status.isPlaying) {
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }

    if (status.didJustFinish) {
      if (isLoop) {
        sound.replayAsync();
      } else {
        setIsPlaying(false);
        setPosition(0);
      }
    }
  };

  // Ensure we track the playback
  useEffect(() => {
    if (sound) {
      sound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
    }
  }, [sound]);

  const pause = async () => {
    if (sound) {
      await sound.pauseAsync();
      setIsPlaying(false);
    }
  };

  return (
    <ThemedView style={[Styles.container, { justifyContent: "center" }]}>
      <ImageBackground
        source={params.Image}
        style={StyleSheet.absoluteFill}
        blurRadius={100}
      />
      {/* <SpinningDisk imageSource={params.Image} /> */}

      {/* Download modal */}
      <Modal
        transparent
        visible={modalVisible && modalVisible == "downloads"}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <BlurView
          style={{ flex: 1, justifyContent: "flex-end" }}
          intensity={0}
          tint="systemThinMaterialLight"
          experimentalBlurMethod="dimezisBlurView"
        >
          <ThemedView
            style={[
              Styles.bottomModal,
              { backgroundColor: Colors[theme ?? "light"].background },
            ]}
          >
            <View
              style={{
                flexDirection: "row",
                width: width * 0.9,
              }}
            >
              <Image
                style={Styles.libraryImageComponent}
                source={params.Image}
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
                  {params.Name}
                </ThemedText>
                <ThemedText style={{ fontSize: 11 }}>
                  {formatTime(duration)}
                </ThemedText>
              </View>
            </View>
            <View
              style={{
                flex: 1,
                width: width * 0.9,
                padding: 10,
              }}
            >
              <ThemedText style={{ fontSize: 16, fontWeight: "bold" }}>
                Quality :
              </ThemedText>
              <Toggle
                Text={"LOW  : " + mp3}
                Parent={downloadQuality}
                setParent={setDownloadQuality}
                isSelectable
              />
              <Toggle
                Text="BEST : COMING SOON"
                isSelectable={false}
                Parent={downloadQuality}
                setParent={setDownloadQuality}
              />
              <TouchableOpacity
                style={[
                  Styles.moreBtn,
                  {
                    padding: 10,
                    justifyContent: "center",
                    alignSelf: "center",
                    width: width * 0.7,
                    marginTop: 10,
                    marginBottom: 10,
                  },
                ]}
              >
                <ThemedText
                  style={{
                    fontSize: 16,
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  Download
                </ThemedText>
              </TouchableOpacity>
            </View>
          </ThemedView>
        </BlurView>
      </Modal>
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
          onSlidingComplete={(value) => sound && sound.setPositionAsync(value)}
          minimumTrackTintColor="#e17645"
          maximumTrackTintColor="#4a4a4a"
          thumbTintColor="#e17645"
        />
        <ThemedText>{formatTime(duration)}</ThemedText>
      </View>
      {/* Control buttons */}
      <View style={Styles.playerControlsContainer}>
        <TouchableOpacity style={Styles.playerBtn}>
          <AntDesign name="stepbackward" size={30} color={"#e17645"} />
        </TouchableOpacity>

        <TouchableOpacity
          hitSlop={20}
          style={Styles.playerBtn}
          onPress={() => {
            // if (!sound) {
            //   return;
            // }
            if (isPlaying) {
              pause();
              return;
            }
            loadAndPlay();
          }}
        >
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

        <TouchableOpacity hitSlop={20} style={Styles.playerBtn}>
          <AntDesign name="stepforward" size={30} color={"#e17645"} />
        </TouchableOpacity>
      </View>
      {/* Other buttons */}
      <View style={[Styles.playerControlsContainer, { gap: 20 }]}>
        <TouchableOpacity style={Styles.playerBtn} onPress={handleFavourite}>
          {Favourite ? (
            <Ionicons name="heart" size={25} color={"#e17645"} />
          ) : (
            <Ionicons name="heart-outline" size={25} color={"#e17645"} />
          )}
        </TouchableOpacity>
        <TouchableOpacity style={Styles.playerBtn}>
          <Ionicons name="shuffle" size={25} color={"#e17645"} />
        </TouchableOpacity>
        <TouchableOpacity
          style={Styles.playerBtn}
          onPress={() => {
            setLoop(!isLoop);
          }}
        >
          {isLoop ? (
            <FontAwesome6
              name="repeat"
              size={23}
              color={Colors.Slider.primary}
            />
          ) : (
            <Ionicons name="repeat-outline" size={25} color={"#e17645"} />
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={Styles.playerBtn}
          onPress={() => {
            if (songLink) {
              setModalVisible("downloads");
            }
          }}
        >
          <Ionicons name="cloud-download-outline" size={25} color={"#e17645"} />
        </TouchableOpacity>
        <TouchableOpacity style={Styles.playerBtn}>
          <Ionicons name="list-outline" size={25} color={"#e17645"} />
        </TouchableOpacity>
      </View>
      <StatusBar hidden={false} />
    </ThemedView>
  );
};

export default Player;
