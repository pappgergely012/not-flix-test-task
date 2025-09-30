import React, { useRef, useEffect } from "react";
import { Video } from "../types";
import PlayerControls from "./PlayerControls";

interface VideoPlayerProps {
  video: Video;
  isPlaying: boolean;
  onPlayPause: (playing: boolean) => void;
  onPrevious: () => void;
  onNext: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  video,
  isPlaying,
  onPlayPause,
  onPrevious,
  onNext,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    if (isPlaying) {
      videoElement.play();
    } else {
      videoElement.pause();
    }
  }, [isPlaying]);

  const handlePlayPause = () => {
    onPlayPause(!isPlaying);
  };

  const handleFastBackward = () => {
    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.currentTime = Math.max(0, videoElement.currentTime - 10);
    }
  };

  const handleFastForward = () => {
    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.currentTime = Math.min(
        videoElement.duration,
        videoElement.currentTime + 10
      );
    }
  };

  return (
    <div className="video-player">
      <div className="video-container">
        <video
          ref={videoRef}
          src={video.sources[0]}
          poster={
            video.thumb ? `/images/${video.thumb.split("/").pop()}` : undefined
          }
          onEnded={() => onNext()}
        />
      </div>

      <div className="video-info">
        <h2>{video.title}</h2>
        <p className="subtitle">{video.subtitle}</p>
      </div>

      <PlayerControls
        isPlaying={isPlaying}
        onPlayPause={handlePlayPause}
        onPrevious={onPrevious}
        onNext={onNext}
        onFastBackward={handleFastBackward}
        onFastForward={handleFastForward}
      />
    </div>
  );
};

export default VideoPlayer;
