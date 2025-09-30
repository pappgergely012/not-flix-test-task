import React from "react";

interface PlayerControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onFastBackward: () => void;
  onFastForward: () => void;
  onFullscreen: () => void;
  isFullscreen: boolean;
}

const PlayerControls: React.FC<PlayerControlsProps> = ({
  isPlaying,
  onPlayPause,
  onPrevious,
  onNext,
  onFastBackward,
  onFastForward,
  onFullscreen,
  isFullscreen,
}) => {
  return (
    <div className="player-controls">
      <button onClick={onPrevious} className="control-btn" title="Previous">
        <img src="/assets/previous.svg" alt="Previous" />
      </button>

      <button
        onClick={onFastBackward}
        className="control-btn"
        title="Fast Backward 10s"
      >
        <img src="/assets/backward.svg" alt="Fast Backward" />
      </button>

      <button
        onClick={onPlayPause}
        className="control-btn play-pause-btn"
        title={isPlaying ? "Pause" : "Play"}
      >
        <img
          src={isPlaying ? "/assets/pause.svg" : "/assets/play.svg"}
          alt={isPlaying ? "Pause" : "Play"}
        />
      </button>

      <button
        onClick={onFastForward}
        className="control-btn"
        title="Fast Forward 10s"
      >
        <img src="/assets/forward.svg" alt="Fast Forward" />
      </button>

      <button onClick={onNext} className="control-btn" title="Next">
        <img src="/assets/next.svg" alt="Next" />
      </button>

      <button
        onClick={onFullscreen}
        className="control-btn fullscreen-btn"
        title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
      >
        <img
          src={
            isFullscreen
              ? "/assets/exit-fullscreen.svg"
              : "/assets/fullscreen.svg"
          }
          alt={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
        />
      </button>
    </div>
  );
};

export default PlayerControls;
