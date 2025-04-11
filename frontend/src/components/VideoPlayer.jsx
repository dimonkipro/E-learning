/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { saveVideoProgress } from "../redux/auth/moduleSlice";

const VideoPlayer = ({ video, setSelectedVideo, videoList, onNext }) => {
  const dispatch = useDispatch();

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
      dispatch(
        saveVideoProgress({
          userId,
          videoId,
          watchedTime,
          videoDuration: video.duration,
        })
      );
    }
  }, [watchedTime, video.duration, userId, videoId, dispatch]);

  const currentIndex = videoList.findIndex((v) => v._id === videoId);

  const handlePrev = () => {
    if (currentIndex > 0) {
      setSelectedVideo(videoList[currentIndex - 1]);
    }
  };

  return (
    <div className="mb-5">
      <h1 className="mb-4 text-center">{video.title}</h1>
      <video
        controls
        width="100%"
        onTimeUpdate={handleTimeUpdate}
        className="rounded-4"
      >
        <source
          src={`http://localhost:5000/${video.video_url.replace(/\\/g, "/")}`}
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>
      <div>
        {isCompleted && <p className="text-success mb-0">✅ Vidéo terminée!</p>}
      </div>
      <div className="d-flex justify-content-between mt-3">
        <button
          className="btn btn-outline-secondary"
          onClick={handlePrev}
          disabled={currentIndex === 0}
        >
          <i className="bi bi-caret-left"></i>Précédent
        </button>
        <button
          className="btn btn-outline-primary"
          onClick={onNext}
          disabled={currentIndex === videoList.length - 1 || !isCompleted}
        >
          Suivant <i className="bi bi-caret-right"></i>
        </button>
      </div>
    </div>
  );
};

export default VideoPlayer;
