import React, { useRef, useEffect, useState } from "react";
import { Video } from "../types";
import PlayerControls from "./PlayerControls";

interface VideoModalProps {
  video: Video;
  isPlaying: boolean;
  onPlayPause: (playing: boolean) => void;
  onPrevious: () => void;
  onNext: () => void;
  onClose: () => void;
}

const VideoModal: React.FC<VideoModalProps> = ({
  video,
  isPlaying,
  onPlayPause,
  onPrevious,
  onNext,
  onClose,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const [showControls, setShowControls] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    if (isPlaying) {
      videoElement.play().catch((err) => console.error("Play error:", err));
    } else {
      videoElement.pause();
    }
  }, [isPlaying, video]);

  useEffect(() => {
    onPlayPause(true);

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [onPlayPause]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  useEffect(() => {
    const handleMouseMove = () => {
      setShowControls(true);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 5000);
    };

    document.addEventListener("mousemove", handleMouseMove);

    timeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 5000);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const updateTime = () => {
      if (!isDragging) {
        setCurrentTime(videoElement.currentTime);
      }
    };
    const updateDuration = () => setDuration(videoElement.duration);

    videoElement.addEventListener("timeupdate", updateTime);
    videoElement.addEventListener("loadedmetadata", updateDuration);

    return () => {
      videoElement.removeEventListener("timeupdate", updateTime);
      videoElement.removeEventListener("loadedmetadata", updateDuration);
    };
  }, [video, isDragging]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === modalRef.current) {
      onClose();
    }
  };

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

  const updateProgress = (clientX: number, progressBar: HTMLDivElement) => {
    const videoElement = videoRef.current;
    if (!videoElement || !progressBar) return;

    const rect = progressBar.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const newTime = pos * videoElement.duration;

    videoElement.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    updateProgress(e.clientX, e.currentTarget);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
    updateProgress(e.clientX, e.currentTarget);
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const progressBar = document.querySelector(
        ".video-progress-bar"
      ) as HTMLDivElement;
      if (progressBar) {
        updateProgress(e.clientX, progressBar);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, duration]);

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div
      className={`video-modal-overlay ${!showControls ? "hide-cursor" : ""}`}
      ref={modalRef}
      onClick={handleBackdropClick}
    >
      <div className="video-modal">
        <button
          className={`close-modal-btn ${!showControls ? "hidden" : ""}`}
          onClick={onClose}
          title="Close (ESC)"
        >
          ×
        </button>

        <div className="modal-video-container">
          <video
            ref={videoRef}
            src={video.sources[0]}
            poster={
              video.thumb
                ? `/images/${video.thumb.split("/").pop()}`
                : undefined
            }
            onEnded={() => onNext()}
            autoPlay
          />
        </div>

        <div className={!showControls ? "hidden" : ""}>
          <div className="controls-overlay">
            <div className="video-progress-container">
              <div className="video-time-info">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
              <div
                className="video-progress-bar"
                onClick={handleSeek}
                onMouseDown={handleMouseDown}
              >
                <div
                  className="video-progress-filled"
                  style={{ width: `${progress}%` }}
                />
              </div>
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
        </div>
      </div>
    </div>
  );
};

export default VideoModal;
