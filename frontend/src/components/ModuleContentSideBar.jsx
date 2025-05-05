/* eslint-disable react/prop-types */

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProgress } from "../redux/auth/moduleSlice";

const ModuleContentSideBar = ({
  module,
  onVideoSelect,
  selectedVideo,
  onTestSelect,
  test,
  selectedTest,
  passedTestsIdList,
  isLocked,
}) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { progress } = useSelector((state) => state.progress);

  const userId = user?._id;
  const isTestPassed =
    module?.test &&
    passedTestsIdList &&
    passedTestsIdList.includes(module.test._id);

  // Fetch progress for each video in the module
  useEffect(() => {
    if (user?.role === "learner" && userId && module?.videos?.length) {
      module.videos.forEach((video) => {
        dispatch(fetchProgress({ userId, videoId: video._id }));
      });
    }
  }, [userId, module, dispatch, user?.role]);

  const allVideosCompleted =
    module?.videos?.length &&
    module.videos.every((video) => progress[video._id]);

  return (
    <div
      className={`p-2 mb-4 shadow border-bottom rounded-4 ${
        module._id === selectedVideo?.module_id ||
        module._id === selectedTest?.module_id?._id
          ? "bg-secondary-subtle"
          : ""
      }`}
    >
      {/* Collapsible Module Title */}
      <div
        className={`d-flex align-items-center ${
          user?.role === "learner" && isLocked && "blurry disabled"
        }`}
      >
        <i
          className={`bi ${
            allVideosCompleted && (!module.test || isTestPassed)
              ? "bi-check-circle-fill"
              : "bi-check-circle"
          } p-2 h4 mb-0`}
        ></i>
        <button
          className="btn w-100 p-2 rounded text-end"
          data-bs-toggle="collapse"
          data-bs-target={`#${module?._id}`}
          style={{ border: "0px" }}
          disabled={user?.role === "learner" && isLocked}
        >
          <span>{module?.title}</span>
          <i className="bi bi-chevron-down ms-2 h5 mb-0"></i>
        </button>
      </div>

      {/* Collapsible Content */}
      <div id={module?._id} className="col-10 mx-auto collapse mt-2">
        {/* Video title */}
        {module?.videos.map((video) => {
          const videoCompleted = progress[video._id];
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
              <i
                className={`bi ${
                  isTestPassed
                    ? "bi-file-earmark-text-fill"
                    : "bi-file-earmark-text"
                } h5 mb-0 me-2`}
              ></i>
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
