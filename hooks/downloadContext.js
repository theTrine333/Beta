import React, { createContext, useContext, useState, useEffect } from "react";
import * as FileSystem from "expo-file-system";

const DownloadContext = createContext();

export const DownloadProvider = ({ children }) => {
  const [downloadQueue, setDownloadQueue] = useState([]);
  const [currentDownload, setCurrentDownload] = useState(null); // File being downloaded
  const [progress, setProgress] = useState(0); // Current download progress
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadedFiles, setDownloadedFiles] = useState([]);
  const [imageLink, setImageLink] = useState(null);

  // Add files to download queue if they are not already downloading
  const addToQueue = (file) => {
    if (currentDownload && currentDownload.name === file.name) {
      return;
    }
    setDownloadQueue((prevQueue) => [...prevQueue, file]);
  };

  const startNextDownload = async () => {
    if (isDownloading || downloadQueue.length === 0) return; // Prevent multiple downloads
    const nextFile = downloadQueue[0]; // Get the first item in queue
    setCurrentDownload(nextFile); // Set current file to download
    setIsDownloading(true);

    const callback = (downloadProgress) => {
      const progressPercent =
        (downloadProgress.totalBytesWritten /
          downloadProgress.totalBytesExpectedToWrite) *
        100;
      setProgress(progressPercent);
    };

    const downloadResumable = FileSystem.createDownloadResumable(
      nextFile.uri,
      FileSystem.documentDirectory + nextFile.name + ".mp3",
      {},
      callback
    );

    try {
      const { uri } = await downloadResumable.downloadAsync();
      setDownloadedFiles((prev) => [...prev, { ...nextFile, filePath: uri }]); // Save completed download
      console.log(`Download complete: ${uri}`); // Print file path when download completes
      setDownloadQueue((prev) => prev.slice(1)); // Remove downloaded file from queue
      setProgress(0); // Reset progress
      setCurrentDownload(null); // Reset current download
      setIsDownloading(false); // Download complete, reset downloading flag
    } catch (error) {
      console.error("Download error:", error);
      setIsDownloading(false);
    }
  };

  // Effect to start the next download once the previous download is done
  useEffect(() => {
    if (!isDownloading && downloadQueue.length > 0) {
      startNextDownload();
    }
  }, [isDownloading, downloadQueue.length]); // Only trigger when isDownloading or downloadQueue changes

  return (
    <DownloadContext.Provider
      value={{
        addToQueue,
        downloadQueue,
        currentDownload,
        progress,
        downloadedFiles,
        isDownloading,
      }}
    >
      {children}
    </DownloadContext.Provider>
  );
};

export const useDownload = () => useContext(DownloadContext);
