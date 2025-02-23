import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "expo-router";
import TrackPlayer, {
  Capability,
  Event,
  RepeatMode,
  State,
  TrackType,
  useProgress,
  useTrackPlayerEvents,
} from "react-native-track-player";
import { useSQLiteContext } from "expo-sqlite";
import { get_db_downloadLink } from "@/api/database";
import { get_downloadLink, getFormats, getHashes } from "@/api/q";

const AudioPlayerContext = createContext();

export const AudioPlayerProvider = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const progress = useProgress();
  const [isBuffering, setIsBuffering] = useState(false);
  const [isLoop, setLoop] = useState(false);
  const [songLink, setSongLink] = useState(null);
  const [songName, setSongName] = useState("");
  const [songImageLink, setSongImageLink] = useState("");
  const [IsStreaming, setIsStreaming] = useState(false);
  const [quality, setQuality] = useState(false);
  const [downloadsPlayList, setDownloadsPlayList] = useState([]);
  const router = useRouter();
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
  const setRepeat = async () => {
    if (isLoop) {
      await TrackPlayer.setRepeatMode(RepeatMode.Track);
      return;
    }
    await TrackPlayer.setRepeatMode(RepeatMode.Off);
  };

  useEffect(() => {
    setRepeat();
  }, [isLoop]);
  useTrackPlayerEvents([Event.PlaybackState], async (event) => {
    if (event.state === State.Playing) {
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }

    if (event.state === State.Buffering) {
      setIsBuffering(true);
    } else {
      setIsBuffering(false);
    }

    const updateCurrentTrack = async () => {
      const currentTrackIndex = await TrackPlayer.getActiveTrackIndex();
      if (currentTrackIndex !== null) {
        const queue = await TrackPlayer.getQueue();
        const track = queue[currentTrackIndex];
        if (track && isPlaying) {
          setSongName(track.title);
          setSongImageLink(track.artwork);
        }
      }
    };
    updateCurrentTrack();
  });

  const streamSong = async (url, name = "Streamed Song", image = null) => {
    setIsStreaming(true);
    if (!url) {
      setIsStreaming("error");
      console.error("No URL provided for streaming");
      return;
    }

    const timeout = setTimeout(async () => {
      await TrackPlayer.stop();
      setIsStreaming("error");
    }, 15000);

    const hashes = await getHashes(url);
    const formats = await getFormats(hashes?.video_hash);
    const downloadLink = await get_downloadLink(formats?.formats[0]?.payload);
    setQuality(formats["formats"]);

    let uri = downloadLink?.link;
    setIsStreaming(false);
    clearTimeout(timeout);
    try {
      await TrackPlayer.reset(); // Clear queue
      setSongLink(uri);
      await TrackPlayer.add({
        id: name,
        url: uri,
        title: name,
        artwork: image || require("@/assets/images/icon.png"),
        type: TrackType.SmoothStreaming,
      });
      await TrackPlayer.play();
    } catch (error) {
      setIsStreaming("error");
      clearTimeout(timeout);
      console.error("Error streaming song:", error);
    }
  };

  const loadPlaylistAndPlay = async (playlist, startIndex = 0) => {
    if (!playlist || !Array.isArray(playlist) || playlist.length === 0) return;
    if (playList !== playlist) {
    }
    // await TrackPlayer.reset(); // Clear previous queue
    const tracks = playlist.map(({ name, image, uri }) => ({
      id: name,
      url: uri,
      title: name,
      artwork: image,
    }));

    await TrackPlayer.add(tracks); // Load new tracks

    if (startIndex >= 0 && startIndex < tracks.length) {
      setSongLink(tracks.uri);
      await TrackPlayer.skip(startIndex);
      await TrackPlayer.play(); // Autoplay
    }
  };

  useEffect(() => {
    let prevPlayList = [];
    const updateTrackList = async () => {
      await TrackPlayer.reset();
      for (const track of playList) {
        await TrackPlayer.add({
          id: track.name,
          url: track.uri,
          title: track.name,
          artwork: track.image,
        });
      }
      prevPlayList = [...playList];
    };

    updateTrackList();
  }, [playList]);

  const nextSong = async () => {
    await TrackPlayer.skipToNext();
    const track = await TrackPlayer.getActiveTrack();
    if (track) {
      setSongName(track.title);
      setSongImageLink(track.artwork);
    }
  };

  const previousSong = async () => {
    await TrackPlayer.skipToPrevious();
    const track = await TrackPlayer.getActiveTrack();
    if (track) {
      setSongName(track.title);
      setSongImageLink(track.artwork);
    }
  };

  const pause = async () => {
    await TrackPlayer.pause();
  };

  const resume = async () => {
    if (Math.round(progress.position) >= Math.round(progress.duration)) {
      seek(0);
    }
    await TrackPlayer.play();
  };

  const stop = async () => {
    setSongName("");
    await TrackPlayer.stop();
    setIsPlaying(false);
  };

  const seek = async (value) => {
    await TrackPlayer.seekTo(value);
  };

  const findTrackIndexByName = async (name) => {
    return playList.findIndex((track) => track.name === name);
  };

  const playSpecificTrack = async (name) => {
    if (songName == name) return;
    const index = findTrackIndexByName(name);
    if (index !== -1) {
      await TrackPlayer.skip(index);
    }
  };

  const removeTrackFromList = async (index) => {
    await TrackPlayer.remove(index);
  };

  const addAndPlaySingleTrack = async (track) => {
    setPlaylist([track]);
    setCurrentIndex(0);
    // await loadAndPlay(0);
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
        // loadAndPlay,
        progress,
        pause,
        pitch,
        setIsStreaming,
        resume,
        seek,
        songLink,
        setSongLink,
        pitchChanger,
        songName,
        IsStreaming,
        setSongName,
        songImageLink,
        setSongImageLink,
        quality,
        loadPlaylistAndPlay,
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
        streamSong,
        addAndPlaySingleTrack,
        removeTrackFromList,
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
};

export const useAudioPlayer = () => useContext(AudioPlayerContext);
