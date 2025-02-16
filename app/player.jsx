import AnimatedText from "@/components/AnimatedTitle";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import Styles, { blurhash } from "@/style";
import { AntDesign, FontAwesome6, Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { Audio } from "expo-av";
import { Colors } from "@/constants/Colors";
import { get_downloadLink, getFormats, getHashes } from "@/api/q";
import { useSQLiteContext } from "expo-sqlite";
import { deleteFavourite, insertFavourite, isFavourite } from "@/api/database";
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
  const loader = async () => {
    setIsBuffering(true);
    const checkFavourite = await isFavourite(db, params.Name);
    setFavourite(checkFavourite);
    const hashes = await getHashes(params.Link);
    const formats = await getFormats(hashes.video_hash);
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
        {
          uri: `${songLink}`,
        },
        { shouldPlay: true, isLooping: isLoop },
        onPlaybackStatusUpdate
      );
      setSound(newSound);
      setIsPlaying(true);
    } else {
      await sound.playAsync();
      setIsPlaying(true);
    }
  };

  const pause = async () => {
    if (sound) {
      await sound.pauseAsync();
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    if (sound) {
      sound.setIsLoopingAsync(isLoop);
    }
  }, [isLoop]);
  const onPlaybackStatusUpdate = (status) => {
    if (status.isLoaded) {
      setPosition(status.positionMillis);
      setDuration(status.durationMillis);
      setIsBuffering(status.isBuffering);

      if (isLoop) {
        // If looping is enabled, restart the audio from the beginning
        sound.replayAsync({ positionMillis: 0, shouldPlay: true });
      } else {
        // If looping is disabled, stop the audio and reset states
        setIsPlaying(false);
        setSound(null);
        setPosition(0);
      }
    }
  };

  return (
    <ThemedView style={[Styles.container, { justifyContent: "center" }]}>
      {/* <SpinningDisk imageSource={params.Image} /> */}
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
            if (isBuffering) {
              return;
            }
            if (isPlaying) {
              pause();
              return;
            }
            loadAndPlay();
          }}
        >
          {isBuffering ? (
            <View style={[Styles.playerBtn, Styles.bufferingIndicator]}>
              <ActivityIndicator
                color={Colors[theme ?? "light"].text}
                size={"small"}
              />
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
        <TouchableOpacity style={Styles.playerBtn}>
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
