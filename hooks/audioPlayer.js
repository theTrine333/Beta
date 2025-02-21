import React, { createContext, useContext, useEffect, useState } from "react";
import TrackPlayer, {
  Capability,
  Event,
  State,
  useProgress,
  useTrackPlayerEvents,
} from "react-native-track-player";
import { get_downloadLink, getFormats, getHashes } from "@/api/q";
import { get_db_downloadLink } from "@/api/database";
import { useSQLiteContext } from "expo-sqlite";

const AudioPlayerContext = createContext();

export const AudioPlayerProvider = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const progress = useProgress();
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
  const [pitch, setPitch] = useState(1.0);
  const db = useSQLiteContext();

  useEffect(() => {
    const setupPlayer = async () => {
      try {
        await TrackPlayer.setupPlayer({ autoHandleInterruptions: true });
        await TrackPlayer.updateOptions({
          capabilities: [
            Capability.Play,
            Capability.Pause,
            Capability.SkipToNext,
            Capability.SkipToPrevious,
          ],
        });
      } catch (error) {
        // console.error("Error setting up TrackPlayer:", error);
      }
    };
    setupPlayer();
  }, []);

  useTrackPlayerEvents([Event.PlaybackState], async (event) => {
    if (event.state === State.Playing) setIsPlaying(true);
    else setIsPlaying(false);
  });

  const loadAndPlay = async (tempIndex) => {
    const newIndex = tempIndex ?? currentIndex;
    if (newIndex < 0 || newIndex >= playList.length) return;

    let { name, image, link } = playList[newIndex];
    let uri = playList[newIndex].uri;
    setSongName(name);
    setSongImageLink(image);

    const localLink = await get_db_downloadLink(db, name);
    if (localLink) {
      uri = localLink.uri;
    } else if (link) {
      try {
        const hashes = await getHashes(link);
        const formats = await getFormats(hashes?.video_hash);
        const downloadLink = await get_downloadLink(
          formats?.formats[0]?.payload
        );
        uri = downloadLink?.link;
      } catch (error) {
        return;
      }
    }

    await TrackPlayer.reset();
    await TrackPlayer.add({
      id: name,
      url: uri,
      title: name,
      artwork: image,
    });
    await TrackPlayer.play();

    setSongLink(uri);
    setCurrentIndex(newIndex);
  };

  const nextSong = async () => {
    await TrackPlayer.skipToNext();
  };

  const previousSong = async () => {
    await TrackPlayer.skipToPrevious();
  };

  const pause = async () => {
    await TrackPlayer.pause();
  };

  const resume = async () => {
    await TrackPlayer.play();
  };

  const stop = async () => {
    setSongName("");
    await TrackPlayer.reset();
  };

  const seek = async (value) => {
    await TrackPlayer.seekTo(value);
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

  const removeTrackFromList = (name) => {
    setPlaylist((prevList) => prevList.filter((track) => track.name !== name));
  };

  const addAndPlaySingleTrack = async (track) => {
    console.log(track);

    setPlaylist([track]);
    setCurrentIndex(0);
    await loadAndPlay(0);
  };

  const pitchChanger = async () => {
    if (pitch == 0.5) {
      setPitch(1);
      await TrackPlayer.setRate(1);
    } else if (pitch == 1) {
      setPitch(1.5);
      await TrackPlayer.setRate(1.5);
    } else if (pitch == 1.5) {
      setPitch(2);
      await TrackPlayer.setRate(2);
    } else if (pitch == 2) {
      setPitch(0.5);
      await TrackPlayer.setRate(0.5);
    } else {
      setPitch(1);
      await TrackPlayer.setRate(1);
    }
  };

  return (
    <AudioPlayerContext.Provider
      value={{
        isPlaying,
        isBuffering,
        isLoop,
        setLoop,
        stop,
        loadAndPlay,
        progress,
        pause,
        pitch,
        resume,
        seek,
        songLink,
        setSongLink,
        pitchChanger,
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
        removeTrackFromList,
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
};

export const useAudioPlayer = () => useContext(AudioPlayerContext);
