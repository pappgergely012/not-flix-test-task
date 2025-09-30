import React, { useRef, useEffect, useState } from "react";
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
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    if (isPlaying) {
      videoElement.play();
    } else {
      videoElement.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("msfullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "mozfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "msfullscreenchange",
        handleFullscreenChange
      );
    };
  }, []);

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

  const handleFullscreen = () => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    // iOS Safari használja a webkitEnterFullscreen-t a video elemen
    if ((videoElement as any).webkitEnterFullscreen) {
      try {
        if ((videoElement as any).webkitDisplayingFullscreen) {
          (videoElement as any).webkitExitFullscreen();
        } else {
          (videoElement as any).webkitEnterFullscreen();
        }
        return;
      } catch (err) {
        console.log("iOS fullscreen error:", err);
      }
    }

    // Desktop és Android böngészők
    const container = containerRef.current;
    if (!container) return;

    if (!document.fullscreenElement) {
      if (container.requestFullscreen) {
        container.requestFullscreen();
      } else if ((container as any).webkitRequestFullscreen) {
        (container as any).webkitRequestFullscreen();
      } else if ((container as any).mozRequestFullScreen) {
        (container as any).mozRequestFullScreen();
      } else if ((container as any).msRequestFullscreen) {
        (container as any).msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      } else if ((document as any).mozCancelFullScreen) {
        (document as any).mozCancelFullScreen();
      } else if ((document as any).msExitFullscreen) {
        (document as any).msExitFullscreen();
      }
    }
  };

  return (
    <div className="video-player" ref={containerRef}>
      <div className="video-container">
        <video
          ref={videoRef}
          src={video.sources[0]}
          poster={video.thumb}
          onEnded={() => onNext()}
          playsInline
          disablePictureInPicture
          controlsList="nodownload noremoteplayback"
          x-webkit-airplay="allow"
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
        onFullscreen={handleFullscreen}
        isFullscreen={isFullscreen}
      />
    </div>
  );
};

export default VideoPlayer;
