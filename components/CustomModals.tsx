import {
  View,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
  TextInput,
  useColorScheme,
} from "react-native";
import React, { useEffect, useState } from "react";
import { ThemedView } from "./ThemedView";
import Styles, { blurhash, height, width } from "@/style";
import { downloadsModalProps } from "@/types";
import { Image } from "expo-image";
import { useAudioPlayer } from "@/hooks/audioPlayer";
import { ThemedText } from "./ThemedText";
import { formatTime, get_downloadLink, getFormats, getHashes } from "@/api/q";
import { Colors } from "@/constants/Colors";
import Toggle from "./FormatToggle";
import { ErrorCard } from "./ResultsCard";
import { useDownload } from "../hooks/downloadContext"; // Import your context
import * as Progress from "react-native-progress";
import { insertPlaylist } from "@/api/database";

export const DownloadModal = ({ setVisible }: downloadsModalProps) => {
  const { duration, songName, songLink, songImageLink, quality } =
    useAudioPlayer();
  const {
    addToQueue,
    isDownloading,
    currentDownload,
    progress,
    downloadedFiles,
  } = useDownload();
  const [downloadQuality, setDownloadQuality] = useState(""); // Selected quality
  const [downloadUrl, setDownloadUrl] = useState(); // Actual download URL
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDownloadLinks = async () => {
      setLoading(true);
      try {
        const hashes = await getHashes(songLink);
        const formats = await getFormats(hashes?.video_hash);
        const link = await get_downloadLink(formats["formats"][0]?.payload);
        setDownloadUrl(link.link);
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
  }, []);

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
      duration: duration,
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
                Duration : {formatTime(duration)}
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
            }}
          >
            Quality:
          </ThemedText>

          <Toggle
            Text={`Low  : ${quality[0].size}`}
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
                  !downloadQuality || currentDownload?.name === songName
                    ? 0.5
                    : 1,
              },
            ]}
            onPress={handleDownload}
            disabled={!downloadQuality || currentDownload?.name === songName}
          >
            <ThemedText style={{ fontWeight: "bold", fontSize: 18 }}>
              {isDownloading && currentDownload?.name === songName
                ? `Downloading... ${Math.round(progress)}%`
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
}: downloadsModalProps) => {
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

export const PlayerErrorModal = ({ setVisible }: downloadsModalProps) => {
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
            { alignItems: "center", justifyContent: "center" },
          ]}
        >
          <ThemedText style={{ margin: 10 }}>Buffering...</ThemedText>
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
}: downloadsModalProps) => {
  const [playlistName, setPlaylistName] = useState("");

  const handleSave = () => {
    if (playlistName.trim() !== "") {
      insertPlaylist(connector, playlistName);
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
            <TouchableOpacity style={styles.button} onPress={handleSave}>
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
