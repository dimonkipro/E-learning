import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProgress } from "../redux/auth/moduleSlice";

/* eslint-disable react/prop-types */
const ModuleContent = ({ module, onAddVideo, isInstructor, onAddTest }) => {

  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const [completedVideos, setCompletedVideos] = useState({});

  const userId = user?._id;
   const { progress } = useSelector((state) => state.progress);

   // Fetch progress for each video in the module
   useEffect(() => {
     if (user?.role === "learner" &&userId && module?.videos?.length) {
       module.videos.forEach((video) => {
         dispatch(fetchProgress({ userId, videoId: video._id }));
         setCompletedVideos(progress)
       });
     }
   }, [userId, module, dispatch, progress, user?.role]);

  const allVideosCompleted =
    module?.videos?.length &&
    module.videos.every((video) => completedVideos[video._id]);

  return (
    <div className="p-2 mb-4 shadow border-bottom border-end border-secondary rounded-4 animate">
      {/* Collapsible Module Title */}
      <div className="d-flex align-items-center">
        <button
          className="btn w-100 p-2 rounded text-start d-flex align-items-end"
          data-bs-toggle="collapse"
          data-bs-target={`#${module?._id}`}
          style={{ border: "0px" }}
        >
          <i
            className={`bi ${
              allVideosCompleted ? "bi-check-circle-fill" : "bi-check-circle"
            } p-2 h5 mb-0`}
          ></i>
          <h6 className="fw-bold text-capitalize">{module?.title}</h6>
        </button>
        <i className="bi bi-chevron-down me-2 h4"></i>
      </div>

      {/* Collapsible Content */}
      <div id={module?._id} className="col-10 mx-auto collapse show mt-2">
        {/* Video Title */}
        {module?.videos.map((video) => {
          const videoCompleted = completedVideos[video._id];
          return (
            <div
              key={video?._id}
              className="d-flex justify-content-between align-items-center p-2 border-bottom border-secondary rounded mb-2 flex-wrap"
            >
              <p className="mb-0 me-3 text-capitalize">{video?.title}</p>
              <i
                className={`h5 mb-0 bi ${
                  videoCompleted ? "bi-camera-video-fill" : "bi-camera-video"
                }`}
              ></i>
            </div>
          );
        })}
        {/* Test */}
        {module?.test ? (
          <div className="d-flex justify-content-between align-items-center p-2 border-bottom border-secondary rounded-3 mb-3">
            <h6 className="mb-0">Test</h6>
            <i className="bi bi-file-earmark-text h5 mb-0"></i>
          </div>
        ) : (
          <p>Pas de test pour ce module</p>
        )}

        {/* Instructor Buttons */}
        {isInstructor && (
          <div className="d-flex rounded-3 mb-2 col-11 mx-auto gap-4 flex-wrap">
            <div className="text-success col rounded-3 border-bottom border-secondary animate">
              <button
                className="btn w-100 p-2 flex-wrap d-flex justify-content-around align-items-center"
                onClick={onAddVideo}
                style={{ border: "0px" }}
              >
                <h6 className="mb-0 me-3">Ajouter un vidéo</h6>
                <i className="bi bi-patch-plus-fill h4 mb-0 text-success"></i>
              </button>
            </div>
            <div
              className={`text-success col rounded-3 border-bottom border-secondary ${
                !module?.test && " animate"
              }`}
            >
              <button
                className={`btn w-100 p-2 flex-wrap d-flex justify-content-around align-items-center ${
                  module?.test && "disabled"
                }`}
                onClick={onAddTest}
                style={{ border: "0px" }}
              >
                <h6 className="mb-0 me-3">Ajouter un test</h6>
                <i className="bi bi-clipboard2-plus-fill h4 mb-0 text-success"></i>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModuleContent;
