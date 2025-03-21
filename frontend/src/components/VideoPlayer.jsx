/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const VideoPlayer = ({ video }) => {
  const [watchedTime, setWatchedTime] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const { user } = useSelector((state) => state.auth);

  const userId = user?._id;
  const videoId = video?._id;

  const handleTimeUpdate = (event) => {
    const currentTime = Math.floor(event.target.currentTime);
    setWatchedTime(currentTime);

    if (currentTime >= video.duration * 0.9) {
      setIsCompleted(true);
    }
  };

  // Send watched time to backend every 5 sec
  useEffect(() => {
    if (watchedTime > 0 && watchedTime % 5 === 0) {
      axios
        .post("http://localhost:5000/api/progress", {
          userId,
          videoId,
          watchedTime,
          videoDuration: video.duration,
        })
        .then((response) => console.log("Progress saved:", response.data))
        .catch((error) => console.error("Error saving progress:", error));
    }
  }, [watchedTime, video.duration, userId, videoId]);

  return (
    <div>
      <h1>{video.title}</h1>
      <video controls width="100%" onTimeUpdate={handleTimeUpdate} className="rounded-4">
        <source
          src={`http://localhost:5000/${video.video_url.replace(/\\/g, "/")}`}
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>
      
      {isCompleted && <p className="text-success">✅ Vidéo terminée!</p>}
    </div>
  );
};

export default VideoPlayer;
