import {
  View,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
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

export const DownloadModal = ({ setVisible }: downloadsModalProps) => {
  const { duration, songName, songLink, songImageLink, quality } =
    useAudioPlayer();
  const { addToQueue, isDownloading, currentDownload, progress } =
    useDownload();

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
              fetchDownloadLinks;
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
    console.log("Download clicked");
    if (!downloadUrl) return;
    const file = {
      name: `${songName}.mp3`,
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
                opacity: !downloadQuality || isDownloading ? 0.5 : 1,
              },
            ]}
            onPress={handleDownload}
            disabled={!downloadQuality || isDownloading}
          >
            <ThemedText style={{ fontWeight: "bold", fontSize: 18 }}>
              {isDownloading && currentDownload?.name === `${songName}.mp3`
                ? `Downloading... ${Math.round(progress)}%`
                : "Download"}
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>
    </Modal>
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
