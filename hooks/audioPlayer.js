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
  const [songName, setSongName] = useState(""); // New state for song name
  const [songImageLink, setSongImageLink] = useState(""); // New state for song image

  const loadAndPlay = async (uri, name = "", imageLink = "") => {
    try {
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
      }
      const { sound } = await Audio.Sound.createAsync(
        { uri },
        { shouldPlay: true },
        onPlaybackStatusUpdate
      );
      soundRef.current = sound;
      setIsPlaying(true);
      setSongLink(uri);
      setSongName(name); // Set song name
      setSongImageLink(imageLink); // Set song image link
    } catch (error) {
      console.error("Error loading sound:", error);
    }
  };

  const onPlaybackStatusUpdate = (status) => {
    if (!status.isLoaded) return;

    setPosition(status.positionMillis);
    setDuration(status.durationMillis);
    setIsPlaying(status.isPlaying);
    setIsBuffering(status.isBuffering);

    if (status.didJustFinish && isLoop) {
      soundRef.current?.replayAsync();
    }
  };

  const pause = async () => {
    if (soundRef.current) {
      await soundRef.current.pauseAsync();
      setIsPlaying(false);
    }
  };

  const resume = async () => {
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
    setSongLink(null);
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
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
};

export const useAudioPlayer = () => useContext(AudioPlayerContext);
