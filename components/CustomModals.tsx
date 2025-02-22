import {
  View,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
  TextInput,
  useColorScheme,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import { ThemedView } from "./ThemedView";
import Styles, { blurhash, height, width } from "@/style";
import { downloadsModalProps } from "@/types";
import { Image } from "expo-image";
import { useAudioPlayer } from "@/hooks/audioPlayer";
import { ThemedText } from "./ThemedText";
import {
  formatTime,
  get_downloadLink,
  getFormats,
  getHashes,
  shareFile,
} from "@/api/q";
import { Colors } from "@/constants/Colors";
import Toggle from "./FormatToggle";
import { ErrorCard } from "./ResultsCard";
import { useDownload } from "../hooks/downloadContext"; // Import your context
import * as Progress from "react-native-progress";
import { getPlaylists, insertPlaylist } from "@/api/database";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { useSQLiteContext } from "expo-sqlite";
import ListCard from "./PlayListCard";
import TrackPlayer from "react-native-track-player";

export const AddToPlalistModal = ({ setVisible }: downloadsModalProps) => {
  const [data, setData] = useState();
  const { songImageLink, songName, songLink, primaryLink } = useAudioPlayer();
  const db = useSQLiteContext();

  const loader = async () => {
    const result = await getPlaylists(db);
    setData(result);

    // setRefresh(false);
  };
  useEffect(() => {
    loader();
  }, []);
  return (
    <Modal
      transparent
      onRequestClose={() => setVisible(false)}
      animationType="slide"
    >
      <ThemedView
        style={{
          flex: 1,
          backgroundColor: "transparent",
          justifyContent: "flex-end",
        }}
      >
        <ThemedView style={Styles.bottomModal}>
          <ThemedText style={{ fontFamily: "ExoRegular", paddingBottom: 10 }}>
            Add to playlist
          </ThemedText>
          {/* Divider */}
          <View
            style={{
              width: width * 0.9,
              marginHorizontal: 20,
              borderWidth: 1,
              borderColor: "grey",
            }}
          />

          <FlatList
            data={data}
            contentContainerStyle={{
              width: width * 0.85,
              alignSelf: "flex-start",
            }}
            renderItem={({ item }) => (
              <ListCard
                counter={item.TotalItems}
                setFav
                title={item.Name}
                setVisible={setVisible}
                childImage={songImageLink}
                childLink={primaryLink}
                childName={songName}
                connector={db}
              />
            )}
          />
        </ThemedView>
      </ThemedView>
    </Modal>
  );
};

export const MoreOptionsModal = ({ setVisible }: downloadsModalProps) => {
  const { duration, songName, songLink, songImageLink, quality, playList } =
    useAudioPlayer();
  const theme = useColorScheme();
  return (
    <Modal
      transparent
      onRequestClose={() => setVisible(false)}
      animationType="slide"
    >
      <ThemedView
        style={{
          flex: 1,
          backgroundColor: "transparent",
          justifyContent: "flex-end",
        }}
      >
        <ThemedView style={Styles.bottomModal}>
          <View
            style={{
              borderColor: Colors[theme ?? "light"].text,
              borderBottomWidth: 1,
              width: width * 0.95,
            }}
          >
            <ThemedText style={{ textAlign: "center", fontSize: 14 }}>
              {songName}
            </ThemedText>
          </View>
          <TouchableOpacity
            style={Styles.moreOptionsItem}
            onPress={() => {
              setVisible("add-to-playlist");
            }}
          >
            <AntDesign
              name="plussquare"
              color={Colors[theme ?? "light"].text}
              size={25}
            />
            <ThemedText style={{ fontFamily: "ExoRegular" }}>
              Add to playlist
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={Styles.moreOptionsItem}
            onPress={() => {
              shareFile(songName);
              setVisible(false);
            }}
          >
            <MaterialCommunityIcons
              name="send"
              color={Colors[theme ?? "light"].text}
              size={25}
            />
            <ThemedText style={{ fontFamily: "ExoRegular" }}>Share</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={Styles.moreOptionsItem}>
            <MaterialCommunityIcons name="delete" color={"red"} size={27} />
            <ThemedText style={{ fontFamily: "ExoRegular", color: "red" }}>
              Delete
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>
    </Modal>
  );
};

export const PlaylistModal = ({ setVisible }: downloadsModalProps) => {
  const { duration, songName, songLink, songImageLink, quality } =
    useAudioPlayer();
  const [data, setData] = useState([]);

  const loader = async () => {
    const queue: any = await TrackPlayer.getQueue();
    setData(queue);
  };

  useEffect(() => {
    loader();
  }, []);

  return (
    <Modal
      transparent
      onRequestClose={() => setVisible(false)}
      animationType="slide"
    >
      <ThemedView
        style={{
          flex: 1,
          backgroundColor: "transparent",
          justifyContent: "flex-end",
        }}
      >
        <ThemedView style={Styles.bottomModal}>
          <ThemedText
            style={{
              alignSelf: "flex-start",
              color: Colors.Slider.primary,
              fontSize: 16,
              fontWeight: "bold",
              paddingBottom: 10,
            }}
          >
            Playing :
            {data.length > 1 ? data.length + " Songs" : data.length + " Song"}
          </ThemedText>
          <ThemedView style={Styles.plaListContainer}>
            <FlatList
              data={data}
              contentContainerStyle={{ paddingLeft: 10, paddingRight: 10 }}
              renderItem={({ item, index }) => (
                <PlayListItem
                  item={item}
                  index={index}
                  setVisible={setVisible}
                />
              )}
            />
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </Modal>
  );
};

export const PlayListItem = ({ item, index, setVisible }: any) => {
  const theme = useColorScheme() ?? "light";
  const { playSpecificTrack, songName, removeTrackFromList } = useAudioPlayer();
  return (
    <View
      style={{
        paddingHorizontal: 10,
        borderColor: "grey",
        flexDirection: "row",
        marginTop: 10,
      }}
    >
      <TouchableOpacity
        style={{
          flexDirection: "row",
          gap: 10,
          alignItems: "center",
        }}
        onPress={() => {
          playSpecificTrack(item.title);
        }}
      >
        <MaterialCommunityIcons
          name="playlist-play"
          size={20}
          style={{ alignSelf: "flex-end" }}
          color={
            songName == item.title
              ? Colors.Slider.primary
              : Colors[theme ?? "light"].text
          }
        />
        <ThemedText
          style={{
            fontSize: 13,
            width: width * 0.75,
            color:
              songName == item.title
                ? Colors.Slider.primary
                : Colors[theme ?? "light"].text,
          }}
          numberOfLines={1}
        >
          {item.title}
        </ThemedText>
      </TouchableOpacity>
      {songName == item.title ? (
        <></>
      ) : (
        <TouchableOpacity
          onPress={() => {
            setVisible(false);
            removeTrackFromList(index);
          }}
        >
          <MaterialCommunityIcons
            name="window-close"
            size={23}
            style={{ alignSelf: "flex-end" }}
            color={Colors[theme ?? "light"].text}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export const DownloadModal = ({ setVisible }: downloadsModalProps) => {
  const { progress, songName, songLink, songImageLink, quality } =
    useAudioPlayer();
  const {
    addToQueue,
    isDownloading,
    currentDownload,
    Progress,
    downloadedFiles,
  } = useDownload();
  const [downloadQuality, setDownloadQuality] = useState(""); // Selected quality
  const [downloadUrl, setDownloadUrl] = useState(); // Actual download URL
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDownloadLinks = async () => {
      setLoading(true);
      try {
        setDownloadUrl(songLink);
      } catch (error) {
        Alert.alert("Error", "Unknown error occured while downloading file", [
          {
            text: "Retry",
            isPreferred: true,
            onPress: () => {
              fetchDownloadLinks();
            },
            style: "default",
          },
          {
            text: "Cancel",
            onPress: () => {},
          },
        ]);
      }
      setLoading(false);
    };

    fetchDownloadLinks();
  }, [songLink]);

  const handleDownload = () => {
    if (!downloadUrl) return;

    const isAlreadyDownloaded = downloadedFiles.some(
      (file: any) => file.name === songName
    );

    if (isAlreadyDownloaded) {
      Alert.alert("Download", "This file is already downloaded.");
      return;
    }
    const file = {
      duration: progress.duration,
      image: songImageLink,
      name: songName,
      uri: downloadUrl,
    };
    addToQueue(file);
    setVisible(false);
  };

  return (
    <Modal
      transparent
      onRequestClose={() => setVisible(false)}
      animationType="slide"
    >
      <ThemedView
        style={{
          flex: 1,
          backgroundColor: "transparent",
          justifyContent: "flex-end",
        }}
      >
        <ThemedView style={Styles.bottomModal}>
          {/* Song Info */}
          <View style={{ flexDirection: "row", gap: 10, width: width * 0.9 }}>
            <Image
              style={Styles.libraryImageComponent}
              source={songImageLink}
              contentFit="cover"
              transition={1000}
            />
            <ThemedView style={{ width: width * 0.6, marginVertical: 5 }}>
              <ThemedText style={{ fontSize: 12 }} numberOfLines={2}>
                {songName}
              </ThemedText>
              <ThemedText style={{ fontSize: 11 }}>
                Duration : {formatTime(progress.duration)}
              </ThemedText>
            </ThemedView>
          </View>

          {/* Quality Selection */}
          <ThemedText
            style={{
              color: Colors.Slider.primary,
              fontSize: 18,
              fontWeight: "bold",
              marginTop: 10,
              paddingLeft: 10,
              alignSelf: "flex-start",
            }}
          >
            Quality:
          </ThemedText>

          <Toggle
            Text={`Low  : ${quality[0]?.size}`}
            isSelectable
            Parent={downloadQuality}
            setParent={setDownloadQuality}
          />
          <Toggle
            Text="Best : COMING SOON"
            Parent={downloadQuality}
            setParent={setDownloadQuality}
            isSelectable={false}
          />

          {/* Download Button */}
          <TouchableOpacity
            style={[
              Styles.moreBtn,
              {
                width: width * 0.7,
                alignItems: "center",
                padding: 10,
                justifyContent: "center",
                marginTop: 10,
                opacity:
                  !downloadQuality ||
                  currentDownload?.name === songName ||
                  formatTime(progress.duration).includes("0:00")
                    ? 0.5
                    : 1,
              },
            ]}
            onPress={handleDownload}
            disabled={
              !downloadQuality ||
              currentDownload?.name === songName ||
              formatTime(progress.duration).includes("0:00")
            }
          >
            <ThemedText style={{ fontWeight: "bold", fontSize: 18 }}>
              {isDownloading && currentDownload?.name === songName
                ? `Downloading... ${Math.round(Progress)}%`
                : "Download"}
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>
    </Modal>
  );
};

export const DownloadCard = ({
  title,
  duration,
  position,
  image,
  loaderFunc,
  isQueue,
}: downloadsModalProps) => {
  useEffect(() => {
    if (position == 100) {
      loaderFunc();
    }
  }, [position]);
  return (
    <ThemedView
      style={[
        Styles.libraryCard,
        { borderColor: "white", height: height * 0.08 },
      ]}
    >
      {image ? (
        <Image
          style={Styles.libraryImageComponent}
          source={image}
          placeholder={{ blurhash }}
          contentFit="cover"
          transition={1000}
        />
      ) : (
        <></>
      )}

      <View>
        <ThemedText
          numberOfLines={1}
          style={{
            fontSize: 11,
            width: width * 0.65,
          }}
        >
          {title}
        </ThemedText>
        {position ? (
          <Progress.Bar
            height={10}
            progress={position / 100}
            color={Colors.Slider.primary}
            width={width * 0.65}
            borderColor={Colors.Slider.primary}
          />
        ) : isQueue ? (
          <Progress.Bar
            height={10}
            indeterminate
            color={Colors.Slider.primary}
            width={width * 0.65}
            borderColor={Colors.Slider.primary}
          />
        ) : (
          <></>
        )}

        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <ThemedText style={{ fontSize: 11 }}>
            {formatTime(duration)}
          </ThemedText>
          {position ? (
            <ThemedText style={{ fontSize: 11 }}>
              {Math.round(position)}%
            </ThemedText>
          ) : (
            <></>
          )}
        </View>
      </View>
    </ThemedView>
  );
};

export const GenrePlayLister = ({ setVisible, list }: downloadsModalProps) => {
  useEffect(() => {
    console.log(list[0]);
  }, []);
  return (
    <Modal
      transparent
      onRequestClose={() => {
        setVisible(false);
      }}
      animationType="slide"
    >
      <ThemedView
        style={{
          flex: 1,
          backgroundColor: "transparent",
          justifyContent: "flex-end",
        }}
      >
        <ThemedView style={[Styles.bottomModal, { paddingHorizontal: 0 }]}>
          <View
            style={{
              flexDirection: "row",
              alignSelf: "flex-start",
              paddingHorizontal: 10,
            }}
          >
            <ThemedText>Stream</ThemedText>
            <ThemedText
              style={{ color: Colors.Slider.primary, fontFamily: "SpaceMono" }}
            >
              IT
            </ThemedText>
          </View>
        </ThemedView>
      </ThemedView>
    </Modal>
  );
};

export const PlayerErrorModal = ({
  setVisible,
  quiter,
}: downloadsModalProps) => {
  const { isStreaming, setIsStreaming } = useAudioPlayer();
  return (
    <Modal
      transparent
      onRequestClose={() => {
        setVisible(false);
        setIsStreaming(false);
      }}
      animationType="slide"
    >
      <ThemedView
        style={{
          flex: 1,
          backgroundColor: "transparent",
          justifyContent: "flex-end",
        }}
      >
        <ThemedView style={[Styles.bottomModal, { paddingHorizontal: 0 }]}>
          <ErrorCard />
        </ThemedView>
      </ThemedView>
    </Modal>
  );
};

export const PlayerLoadingModal = ({
  setVisible,
  router,
}: downloadsModalProps) => {
  return (
    <Modal
      transparent
      onRequestClose={() => {
        setVisible(false);
        router.back();
      }}
      animationType="slide"
    >
      <ThemedView
        style={{
          flex: 1,
          backgroundColor: "transparent",
          justifyContent: "flex-end",
        }}
      >
        <ThemedView
          style={[
            Styles.bottomModal,
            {
              alignItems: "center",
              height: height * 0.3,
              justifyContent: "center",
            },
          ]}
        >
          <ThemedText style={{ margin: 10 }}>Requesting metadata...</ThemedText>
          <ActivityIndicator size={"large"} color={Colors.Slider.primary} />
        </ThemedView>
      </ThemedView>
    </Modal>
  );
};

export const PlaylistAddModal = ({
  setVisible,
  onClose,
  onSave,
  connector,
  reloader,
}: downloadsModalProps) => {
  const [playlistName, setPlaylistName] = useState("");

  const handleSave = () => {
    if (playlistName.trim() !== "") {
      insertPlaylist(connector, playlistName);
      reloader();
      setPlaylistName("");
      setVisible(false);
    }
  };
  const theme = useColorScheme() ?? "light";
  return (
    <Modal
      transparent
      animationType="slide"
      onRequestClose={() => {
        setVisible(false);
      }}
    >
      <View style={styles.overlay}>
        <View
          style={[
            styles.modalContainer,
            {
              backgroundColor:
                theme == "light" ? Colors.dark.tint : "rgb(18, 17, 17)",
            },
          ]}
        >
          <ThemedText style={styles.title}>Create Playlist</ThemedText>
          <TextInput
            style={[styles.input, { color: Colors[theme ?? "light"].text }]}
            placeholder="Enter playlist name"
            placeholderTextColor={"grey"}
            value={playlistName}
            onChangeText={setPlaylistName}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={handleSave}
              hitSlop={20}
            >
              <ThemedText style={styles.buttonText}>Save</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => {
                setVisible(false);
                if (onClose) {
                  onClose();
                }
              }}
            >
              <ThemedText style={styles.buttonText}>Cancel</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    flex: 1,
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: "red",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});
