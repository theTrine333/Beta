import AnimatedText from "@/components/AnimatedTitle";
import MarqueeText from "@/components/AnimatedTitle";
import SpinningDisk from "@/components/Disk";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import Styles, { blurhash } from "@/style";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { Audio } from "expo-av";
const Player = () => {
  const params = useLocalSearchParams();
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(1);
  const formatTime = (millis) => {
    const minutes = Math.floor(millis / 60000);
    const seconds = ((millis % 60000) / 1000).toFixed(0);
    return `${minutes}:${parseInt(seconds) < 10 ? "0" : ""}${seconds}`;
  };
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
          uri: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        },
        { shouldPlay: true },
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

  const onPlaybackStatusUpdate = (status) => {
    if (status.isLoaded) {
      setPosition(status.positionMillis);
      setDuration(status.durationMillis);
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
        <ThemedText>0:00</ThemedText>
        <Slider
          style={Styles.playerSlider}
          minimumValue={0}
          maximumValue={duration}
          value={position}
          // onSlidingComplete={handleSeek}
          minimumTrackTintColor="#e17645"
          maximumTrackTintColor="#4a4a4a"
          thumbTintColor="#e17645"
        />
        <ThemedText>0:00</ThemedText>
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
            if (isPlaying) {
              pause();
              return;
            }
            loadAndPlay();
          }}
        >
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
      <View style={[Styles.playerControlsContainer, { gap: 30 }]}>
        <TouchableOpacity style={Styles.playerBtn}>
          <Ionicons name="heart-outline" size={25} color={"#e17645"} />
        </TouchableOpacity>
        <TouchableOpacity style={Styles.playerBtn}>
          <Ionicons name="shuffle" size={25} color={"#e17645"} />
        </TouchableOpacity>
        <TouchableOpacity style={Styles.playerBtn}>
          <Ionicons name="repeat-outline" size={25} color={"#e17645"} />
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
