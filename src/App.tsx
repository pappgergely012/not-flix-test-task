import React, { useState, useEffect } from "react";
import "./App.css";
import { Video, VideoData } from "./types";
import VideoModal from "./components/VideoModal";
import VideoGrid from "./components/VideoGrid";
import AddMediaForm from "./components/AddMediaForm";

function App() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState<number | null>(
    null
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getVideos = async () => {
    const response = await fetch("/videos.json");
    const data: VideoData = await response.json();
    const defaultVideos = data.categories[0]?.videos.slice(0, 3) || [];

    setVideos(defaultVideos);
  };

  useEffect(() => {
    getVideos();
  }, []);

  const addVideo = (url: string) => {
    const newVideo: Video = {
      title: "Custom Video",
      description: "User added video",
      subtitle: "Custom",
      sources: [url],
      thumb: "",
    };
    setVideos((prev) => [...prev, newVideo]);
  };

  const removeVideo = (index: number) => {
    setVideos((prev) => {
      const newVideos = prev.filter((_, i) => i !== index);

      if (currentVideoIndex === index) {
        setIsModalOpen(false);
        setCurrentVideoIndex(null);
      } else if (currentVideoIndex !== null && currentVideoIndex > index) {
        setCurrentVideoIndex(currentVideoIndex - 1);
      }

      return newVideos;
    });
  };

  const handleVideoSelect = (index: number) => {
    setCurrentVideoIndex(index);
    setIsModalOpen(true);
    setIsPlaying(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsPlaying(false);
  };

  const goToPrevious = () => {
    if (currentVideoIndex !== null) {
      setCurrentVideoIndex((prev) =>
        prev === 0 ? videos.length - 1 : (prev || 0) - 1
      );
    }
  };

  const goToNext = () => {
    if (currentVideoIndex !== null) {
      setCurrentVideoIndex((prev) =>
        prev === videos.length - 1 ? 0 : (prev || 0) + 1
      );
    }
  };

  const currentVideo =
    currentVideoIndex !== null ? videos[currentVideoIndex] : null;

  return (
    <div className="App">
      <header className="App-header">
        <div className="logo-container">
          <img
            src="/icons/video-icon.svg"
            alt="Not-Flix"
            className="logo-icon"
          />
          <h1>Not-Flix</h1>
        </div>
      </header>

      <div className="main-content">
        <AddMediaForm onAddVideo={addVideo} />

        <VideoGrid
          videos={videos}
          currentIndex={currentVideoIndex ?? -1}
          onVideoSelect={handleVideoSelect}
          onRemoveVideo={removeVideo}
        />
      </div>

      {isModalOpen && currentVideo && (
        <VideoModal
          video={currentVideo}
          isPlaying={isPlaying}
          onPlayPause={setIsPlaying}
          onPrevious={goToPrevious}
          onNext={goToNext}
          onClose={closeModal}
        />
      )}
    </div>
  );
}

export default App;
