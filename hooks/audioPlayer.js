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
  const [downloadsPlayList, setDownloadsPlayList] = useState([]);
  const [favouritesLists, setfavouritesLists] = useState([]);
  const [normalPLayLists, setnormalPLayLists] = useState([]);
  const [genrePlayLists, setgenrePlayLists] = useState([]);

  const [playList, setPlaylist] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const enableAudioMode = async () => {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: true,
      shouldDuckAndroid: true,
    });
  };

  useEffect(() => {
    enableAudioMode();
  }, []);

  const nextSong = () => {
    if (currentIndex < playList.length - 1) {
      loadAndPlay(currentIndex + 1);
    }
  };

  const previousSong = () => {
    console.log(currentIndex);
    if (currentIndex > 0) {
      // Prevents going below 0
      loadAndPlay(currentIndex - 1);
    }
  };

  const loadAndPlay = async (tempIndex) => {
    enableAudioMode();
    const newIndex = tempIndex ?? currentIndex;

    if (newIndex >= 0 && newIndex < playList.length) {
      const { uri, name, image } = playList[newIndex];
      try {
        if (soundRef.current) {
          await soundRef.current.unloadAsync();
        }
        const { sound } = await Audio.Sound.createAsync(
          { uri },
          {
            shouldPlay: true,
            isLooping: isLoop,
            staysActiveInBackground: true,
          },
          onPlaybackStatusUpdate
        );
        soundRef.current = sound;
        setIsPlaying(true);
        setSongLink(uri);
        setSongName(name);
        setSongImageLink(image);
        setCurrentIndex(newIndex);
      } catch (error) {
        stop();
      }
    }
  };

  const onPlaybackStatusUpdate = (status) => {
    enableAudioMode();
    if (!status.isLoaded) return;

    setPosition(status.positionMillis);
    setDuration(status.durationMillis);
    setIsPlaying(status.isPlaying);
    setIsBuffering(status.isBuffering);

    if (status.didJustFinish) {
      if (currentIndex < playList.length - 1) {
        loadAndPlay(currentIndex + 1);
      } else {
        console.log("End of playlist");
        // Optional: Loop back to the first song
        // loadAndPlay(0);
      }
    }
  };

  const setIsLoop = (state) => {
    setLoop(state);
    if (soundRef.current) {
      soundRef.current.setIsLoopingAsync(state);
    }
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

  const findTrackIndexByName = (name) => {
    return playList.findIndex((track) => track.name === name);
  };
  const playSpecificTrack = async (name) => {
    const index = findTrackIndexByName(name);
    loadAndPlay(index);
  };
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
        downloadsPlayList,
        setDownloadsPlayList,
        favouritesLists,
        setfavouritesLists,
        normalPLayLists,
        setnormalPLayLists,
        genrePlayLists,
        setgenrePlayLists,
        playList,
        setPlaylist,
        nextSong,
        previousSong,
        playSpecificTrack,
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
};

const findTrackIndexByName = (name) => {
  return playlist.findIndex((track) => track.name === name);
};

export const useAudioPlayer = () => useContext(AudioPlayerContext);
