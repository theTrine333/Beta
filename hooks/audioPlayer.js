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
          android: {
            appKilledPlaybackBehavior:
              AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
          },
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
          setSongImageLink(track.artwork);
          setSongName(track.title);
          setSongImageLink(track.artwork);
        }
      }
    };
    updateCurrentTrack();
  });

  const streamSong = async (url, name = "Streamed Song", image = null) => {
    if (!url) {
      console.error("No URL provided for streaming");
      return;
    }
    const hashes = await getHashes(url);
    const formats = await getFormats(hashes?.video_hash);
    const downloadLink = await get_downloadLink(formats?.formats[0]?.payload);
    setQuality(formats["formats"]);

    let uri = downloadLink?.link;
    try {
      await TrackPlayer.reset(); // Clear queue
      setSongLink(uri);
      await TrackPlayer.add({
        id: name,
        url: uri,
        title: name,
        artwork: image || require("@/assets/images/icon.png"),
      });
      await TrackPlayer.play();
    } catch (error) {
      console.error("Error streaming song:", error);
    }
  };

  const loadAndPlay = async (tempIndex) => {
    const newIndex = tempIndex ?? currentIndex;
    if (newIndex < 0 || newIndex >= playList.length) return;

    const { name, image, link } = playList[newIndex];
    let uri = link;

    try {
      const localLink = await get_db_downloadLink(db, name);
      if (localLink) {
        uri = localLink.uri;
      } else if (link) {
        const hashes = await getHashes(link);
        const formats = await getFormats(hashes?.video_hash);
        const downloadLink = await get_downloadLink(
          formats?.formats[0]?.payload
        );
        console.log("Download link", downloadLink);
        uri = downloadLink?.link;
      }
    } catch (error) {
      console.error("Error fetching song link:", error);
      return;
    }

    const queue = await TrackPlayer.getQueue();
    const existingTrackIndex = queue.findIndex((track) => track.id === name);
    console.log("Final url : ", uri);

    if (existingTrackIndex !== -1) {
      await TrackPlayer.skip(existingTrackIndex);
    } else {
      await TrackPlayer.add({
        id: name,
        url: uri,
        title: name,
        artwork: image,
      });
      await TrackPlayer.play();
    }

    setSongLink(uri);
    setCurrentIndex(newIndex);
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
    await setSongName("");
    await TrackPlayer.stop();
    setIsPlaying(false);
  };

  const seek = async (value) => {
    await TrackPlayer.seekTo(value);
  };

  const findTrackIndexByName = (name) => {
    return playList.findIndex((track) => track.name === name);
  };

  const playSpecificTrack = async (name) => {
    const index = findTrackIndexByName(name);
    // console.log("Playlist item : ", playList);
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
