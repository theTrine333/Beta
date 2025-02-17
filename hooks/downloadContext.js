import React, { createContext, useContext, useState, useEffect } from "react";
import * as FileSystem from "expo-file-system";

const DownloadContext = createContext();

export const DownloadProvider = ({ children }) => {
  const [downloadQueue, setDownloadQueue] = useState([]); // List of files
  const [currentDownload, setCurrentDownload] = useState(null); // File being downloaded
  const [progress, setProgress] = useState(0); // Current download progress
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadedFiles, setDownloadedFiles] = useState([]);

  const addToQueue = (file) => {
    setDownloadQueue((prevQueue) => [...prevQueue, file]);
  };

  const startNextDownload = async () => {
    if (isDownloading || downloadQueue.length === 0) return; // Prevent multiple downloads

    const nextFile = downloadQueue[0]; // Get the first item in queue
    setCurrentDownload(nextFile);
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
      FileSystem.documentDirectory + nextFile.name,
      {},
      callback
    );

    try {
      const { uri } = await downloadResumable.downloadAsync();
      setDownloadedFiles((prev) => [...prev, { ...nextFile, uri }]); // Save completed download
      setDownloadQueue((prev) => prev.slice(1)); // Remove downloaded file from queue
      setProgress(0);
      setCurrentDownload(null);
      setIsDownloading(false);
      startNextDownload(); // Start next download
    } catch (error) {
      console.error("Download error:", error);
      setIsDownloading(false);
    }
  };

  useEffect(() => {
    if (!isDownloading) {
      startNextDownload();
    }
  }, [downloadQueue]);

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
