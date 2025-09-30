import React, { useState } from "react";

interface AddMediaFormProps {
  onAddVideo: (url: string) => void;
}

const AddMediaForm: React.FC<AddMediaFormProps> = ({ onAddVideo }) => {
  const [url, setUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onAddVideo(url.trim());
      setUrl("");
    }
  };

  return (
    <div className="add-media-form">
      <h3>Add Video</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter video URL..."
          className="url-input"
        />
        <button type="submit" className="add-btn">
          Add to Playlist
        </button>
      </form>
    </div>
  );
};

export default AddMediaForm;
