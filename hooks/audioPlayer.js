import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Audio } from "expo-av";

const AudioPlayerContext = createContext();

export const AudioPlayerProvider = ({ children }) => {
  const soundRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(1);
  const [isBuffering, setIsBuffering] = useState(false);
  const [isLoop, setLoop] = useState(false);
  const [songLink, setSongLink] = useState(null);
  const [songName, setSongName] = useState("");
  const [songImageLink, setSongImageLink] = useState("");
  const [quality, setQuality] = useState(false);
  const enableAudioMode = async () => {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false, // Disables recording
      staysActiveInBackground: true, // Keeps audio playing when the app goes to background
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX, // Prevents other audio from mixing
      playsInSilentModeIOS: true, // Allows audio to play even when the phone is on silent mode
      shouldDuckAndroid: false, // Keeps the volume of other apps unchanged
      playThroughEarpieceAndroid: false, // Prevents audio from being played through the earpiece
    });
  };
  useEffect(() => {
    enableAudioMode();
  }, []);

  const loadAndPlay = async (uri, name = "", imageLink = "") => {
    enableAudioMode();
    try {
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
      }

      const { sound } = await Audio.Sound.createAsync(
        { uri },
        { shouldPlay: true, isLooping: isLoop, staysActiveInBackground: true },
        onPlaybackStatusUpdate
      );
      soundRef.current = sound;
      setIsPlaying(true);
      // setSongLink(uri);
      setSongName(name);
      setSongImageLink(imageLink);
    } catch (error) {
      stop();
    }
  };

  const onPlaybackStatusUpdate = (status) => {
    enableAudioMode();
    if (!status.isLoaded) return;

    setPosition(status.positionMillis);
    setDuration(status.durationMillis);
    setIsPlaying(status.isPlaying);
    setIsBuffering(status.isBuffering);
  };
  const setIsLoop = (state) => {
    setLoop(state);
    soundRef.current.setIsLoopingAsync(state);
  };
  const pause = async () => {
    if (soundRef.current) {
      await soundRef.current.pauseAsync();
      setIsPlaying(false);
    }
  };

  const resume = async () => {
    enableAudioMode();
    if (soundRef.current) {
      await soundRef.current.playAsync();
      setIsPlaying(true);
    }
  };

  const stop = async () => {
    if (soundRef.current) {
      await soundRef.current.stopAsync();
      await soundRef.current.unloadAsync();
      soundRef.current = null;
    }
    setIsPlaying(false);
    setPosition(0);
    setDuration(1);
    // setSongLink(null);
    setSongName("");
    setSongImageLink("");
  };

  const seek = async (value) => {
    if (soundRef.current) {
      await soundRef.current.setPositionAsync(value);
    }
  };

  useEffect(() => {
    return () => {
      soundRef.current?.unloadAsync();
    };
  }, []);

  return (
    <AudioPlayerContext.Provider
      value={{
        isPlaying,
        position,
        duration,
        isBuffering,
        isLoop,
        stop,
        setLoop,
        loadAndPlay,
        pause,
        resume,
        seek,
        songLink,
        setSongLink,
        songName,
        setSongName,
        songImageLink,
        setSongImageLink,
        quality,
        setQuality,
        setIsLoop,
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
};

export const useAudioPlayer = () => useContext(AudioPlayerContext);
