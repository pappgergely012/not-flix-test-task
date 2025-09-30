import React from "react";
import { Video } from "../types";

interface VideoCardProps {
  video: Video;
  index: number;
  isCurrentlyPlaying: boolean;
  onVideoSelect: (index: number) => void;
  onRemoveVideo: (index: number) => void;
}

const VideoCard: React.FC<VideoCardProps> = ({
  video,
  index,
  isCurrentlyPlaying,
  onVideoSelect,
  onRemoveVideo,
}) => {
  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemoveVideo(index);
  };

  const hasValidThumb = video.thumb && video.thumb.trim() !== "";

  return (
    <div
      className={`video-card ${isCurrentlyPlaying ? "playing" : ""}`}
      onClick={() => onVideoSelect(index)}
    >
      <div className="video-card-thumbnail">
        {hasValidThumb ? (
          <img
            src={video.thumb}
            alt={video.title}
            onError={(e) => {
              e.currentTarget.style.display = "none";
              const placeholder = e.currentTarget
                .nextElementSibling as HTMLElement;
              if (
                placeholder &&
                placeholder.classList.contains("video-placeholder")
              ) {
                placeholder.style.display = "flex";
              }
            }}
          />
        ) : null}
        <div
          className="video-placeholder"
          style={{ display: hasValidThumb ? "none" : "flex" }}
        >
          <img src="/assets/video-placeholder.svg" alt="Video" />
        </div>
        {isCurrentlyPlaying && (
          <div className="playing-indicator">
            <span>▶ Now Playing</span>
          </div>
        )}
      </div>

      <div className="video-card-info">
        <h3 className={isCurrentlyPlaying ? "bold" : ""}>{video.title}</h3>
        <p className="subtitle">{video.subtitle}</p>
        <p className="description">{video.description}</p>
      </div>

      <button
        className="remove-btn"
        onClick={handleRemove}
        title="Remove from playlist"
      >
        ×
      </button>
    </div>
  );
};

export default VideoCard;
