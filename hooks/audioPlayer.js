import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Audio } from "expo-av";
import { get_downloadLink, getFormats, getHashes } from "@/api/q";

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
  const [favouritesLists, setFavouritesLists] = useState([]);
  const [normalPlayLists, setNormalPlayLists] = useState([]);
  const [genrePlayLists, setGenrePlayLists] = useState([]);
  const [playList, setPlaylist] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const enableAudioMode = async () => {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: true,
        shouldDuckAndroid: true,
      });
    } catch (error) {
      console.error("Error enabling audio mode:", error);
    }
  };

  useEffect(() => {
    enableAudioMode();
    return () => {
      soundRef.current?.unloadAsync();
    };
  }, []);

  const loadAndPlay = async (tempIndex) => {
    enableAudioMode();
    const newIndex = tempIndex ?? currentIndex;

    if (newIndex < 0 || newIndex >= playList.length) return;

    const { name, image, link } = playList[newIndex];
    let uri = playList[newIndex].uri;

    setSongName(name);
    setSongImageLink(image);

    if (link) {
      try {
        const hashes = await getHashes(link);
        const formats = await getFormats(hashes?.video_hash);
        const downloadLink = await get_downloadLink(
          formats?.formats[0]?.payload
        );
        uri = downloadLink?.link;
      } catch (error) {
        console.error("Error fetching download link:", error);
        return;
      }
    }

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
      setCurrentIndex(newIndex);

      setTimeout(() => {
        setSongImageLink(playList[newIndex]?.image);
        setSongName(playList[newIndex]?.name);
      }, 100);
    } catch (error) {
      stop();
    }
  };

  const onPlaybackStatusUpdate = (status) => {
    if (!status.isLoaded) return;
    setPosition(status.positionMillis);
    setDuration(status.durationMillis);
    setIsPlaying(status.isPlaying);
    setIsBuffering(status.isBuffering);
    if (status.didJustFinish) {
      setCurrentIndex((prevIndex) => {
        if (!isLoop && prevIndex < playList.length - 1) {
          nextSong();
          return prevIndex + 1;
        } else if (isLoop) {
          loadAndPlay(prevIndex);
          return prevIndex;
        }
        return prevIndex;
      });
    }
  };

  const nextSong = () => {
    if (currentIndex < playList.length - 1) {
      loadAndPlay(currentIndex + 1);
    }
  };

  const previousSong = () => {
    if (currentIndex > 0) {
      loadAndPlay(currentIndex - 1);
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
  };

  const seek = async (value) => {
    if (soundRef.current) {
      await soundRef.current.setPositionAsync(value);
    }
  };

  const findTrackIndexByName = (name) => {
    return playList.findIndex((track) => track.name === name);
  };

  const playSpecificTrack = async (name) => {
    const index = findTrackIndexByName(name);
    if (index !== -1) {
      loadAndPlay(index);
    }
  };
  const addAndPlaySingleTrack = (track) => {
    setPlaylist([track]); // Set the playlist to only contain this track
    setCurrentIndex(0); // Reset index to 0
    loadAndPlay(0); // Play the newly added track immediately
  };
  return (
    <AudioPlayerContext.Provider
      value={{
        isPlaying,
        position,
        duration,
        isBuffering,
        isLoop,
        setLoop,
        stop,
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
        downloadsPlayList,
        setDownloadsPlayList,
        favouritesLists,
        setFavouritesLists,
        normalPlayLists,
        setNormalPlayLists,
        genrePlayLists,
        setGenrePlayLists,
        playList,
        setPlaylist,
        nextSong,
        previousSong,
        playSpecificTrack,
        addAndPlaySingleTrack,
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
};

export const useAudioPlayer = () => useContext(AudioPlayerContext);
