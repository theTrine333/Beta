import {
  ActivityIndicator,
  Keyboard,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useAudioPlayer } from "@/hooks/audioPlayer";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import Styles, { blurhash, width } from "@/style";
import { Colors } from "@/constants/Colors";
import { AntDesign } from "@expo/vector-icons";
import { formatTime } from "@/api/q";
import { Image } from "expo-image";
import { useRouter } from "expo-router";

const MiniPlayer = (props) => {
  const {
    loadAndPlay,
    pause,
    resume,
    position,
    duration,
    isPlaying,
    isBuffering,
    isLoop,
    stop,
    setLoop,
    songLink,
    setSongLink,
    songName,
    songImageLink,
  } = useAudioPlayer();
  const theme = useColorScheme() ?? "light";
  const router = useRouter();
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  // Listen for keyboard visibility changes
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setIsKeyboardVisible(true); // Hide player when keyboard is shown
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setIsKeyboardVisible(false); // Show player when keyboard is hidden
      }
    );

    // Clean up listeners on unmount
    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
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

  const handleClose = async () => {
    stop();
  };

  const handleNavigation = async () => {
    router.push({
      pathname: "player",
      params: {
        from: "miniplayer",
        Name: songName,
        Image: songImageLink,
        Link: songLink,
      },
    });
  };

  return (
    <>
      {songName == "" || isKeyboardVisible ? (
        <></>
      ) : (
        <ThemedView
          style={[
            Styles.miniPlayerContainer,
            {
              backgroundColor:
                theme == "light" ? Colors.dark.tint : "rgb(18, 17, 17)",
            },
            props.style,
          ]}
        >
          <TouchableOpacity onPress={handleNavigation}>
            <Image
              style={[
                Styles.libraryImageComponent,
                { marginLeft: 0, marginRight: 0 },
              ]}
              source={songImageLink}
              placeholder={{ blurhash }}
              contentFit="cover"
              transition={1000}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              width: width * 0.43,
              marginVertical: 5,
            }}
            onPress={handleNavigation}
          >
            <ThemedText numberOfLines={1} style={{ fontSize: 12 }}>
              {songName}
            </ThemedText>
            <ThemedText style={{ fontSize: 10, opacity: 0.5 }}>
              {formatTime(position) + "/" + formatTime(duration)}
            </ThemedText>
          </TouchableOpacity>
          {/* Buttons */}
          <View style={{ flexDirection: "row", gap: 15 }}>
            <TouchableOpacity
              style={{ justifyContent: "center" }}
              onPress={handlePlayPause}
            >
              {isPlaying ? (
                <AntDesign
                  name="pause"
                  size={25}
                  color={Colors.Slider.primary}
                />
              ) : isBuffering ? (
                <View style={{ justifyContent: "center" }}>
                  <ActivityIndicator color={Colors.Slider.primary} size={25} />
                </View>
              ) : (
                <AntDesign
                  name="playcircleo"
                  size={25}
                  color={Colors.Slider.primary}
                />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={{ justifyContent: "center" }}
              onPress={handleClose}
            >
              <AntDesign name="close" size={25} color={"grey"} />
            </TouchableOpacity>
          </View>
        </ThemedView>
      )}
    </>
  );
};

export default MiniPlayer;
