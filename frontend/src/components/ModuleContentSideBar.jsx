/* eslint-disable react/prop-types */

import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const ModuleContentSideBar = ({
  module,
  onVideoSelect,
  selectedVideo,
  onTestSelect,
  test,
  selectedTest,
}) => {
  const { user } = useSelector((state) => state.auth);
  const [completedVideos, setCompletedVideos] = useState({});

  const userId = user?._id;

  // Fetch progress for each video in the module
  useEffect(() => {
    if (userId && module?.videos?.length) {
      module.videos.forEach((video) => {
        axios
          .get(`http://localhost:5000/api/progress/${userId}/${video._id}`)
          .then((response) => {
            setCompletedVideos((prevState) => ({
              ...prevState,
              [video._id]: response.data.isCompleted,
            }));
          })
          .catch((error) => console.error("Error fetching progress:", error));
      });
    }
  }, [userId, module]);
  const allVideosCompleted =
    module?.videos?.length &&
    module.videos.every((video) => completedVideos[video._id]);

  return (
    <div
      className={` p-2 mb-4 shadow border-bottom rounded-4 ${
        module._id === selectedVideo?.module_id ||
        module._id === selectedTest?.module_id?._id
          ? "bg-secondary-subtle"
          : ""
      }`}
    >
      {/* Collapsible Module Title */}
      <div className="d-flex align-items-center">
        <i
          className={`bi ${
            allVideosCompleted ? "bi-check-circle-fill" : "bi-check-circle"
          } p-2 h4 mb-0`}
        ></i>
        <button
          className="btn w-100 p-2 rounded text-end"
          data-bs-toggle="collapse"
          data-bs-target={`#${module?._id}`}
        >
          <span>{module?.title}</span>
          <i className="bi bi-chevron-down ms-2 h5 mb-0"></i>
        </button>
      </div>

      {/* Collapsible Content */}
      <div id={module?._id} className="col-10 mx-auto collapse mt-2">
        {/* Video title */}
        {module?.videos.map((video) => {
          const videoCompleted = completedVideos[video._id];
          return (
            <div
              key={video?._id}
              className={`d-flex justify-content-between align-items-center p-2 border-bottom rounded mb-2 ${
                video._id === selectedVideo?._id ? "bg-light" : ""
              }`}
              onClick={() => onVideoSelect(video)}
              style={{ cursor: "pointer" }}
            >
              <i
                className={`h5 mb-0 bi ${
                  videoCompleted ? "bi-camera-video-fill" : "bi-camera-video"
                }`}
              ></i>
              <span className="me-2">{video?.title}</span>
            </div>
          );
        })}

        {/* Test Section */}
        {test && (
          <div
            key={test?._id}
            className={`d-flex justify-content-between align-items-center p-2 border-bottom rounded-3 mb-2 ${
              test._id === selectedTest?._id ? "bg-light" : ""
            }`}
            onClick={() => onTestSelect(test)}
            style={{ cursor: "pointer" }}
          >
            <div>
              <i className="bi bi-file-earmark-text h5 mb-0 me-2"></i>
              <span className="fs-5">{test?.title}</span>
            </div>
            <span className="badge bg-primary">
              {test?.questions.length} Questions
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModuleContentSideBar;
