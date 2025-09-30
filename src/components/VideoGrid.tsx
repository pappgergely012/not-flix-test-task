import React from "react";
import { Video } from "../types";
import VideoCard from "./VideoCard";

interface VideoGridProps {
  videos: Video[];
  currentIndex: number;
  onVideoSelect: (index: number) => void;
  onRemoveVideo: (index: number) => void;
}

const VideoGrid: React.FC<VideoGridProps> = ({
  videos,
  currentIndex,
  onVideoSelect,
  onRemoveVideo,
}) => {
  return (
    <div className="video-grid">
      {videos.map((video, index) => (
        <VideoCard
          key={index}
          video={video}
          index={index}
          isCurrentlyPlaying={index === currentIndex}
          onVideoSelect={onVideoSelect}
          onRemoveVideo={onRemoveVideo}
        />
      ))}
    </div>
  );
};

export default VideoGrid;
