import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteModule,
  deleteTestById,
  deleteVideo,
  fetchProgress,
} from "../redux/auth/moduleSlice";
import { fetchCourseDetailsById } from "../redux/auth/courseSlice";

/* eslint-disable react/prop-types */
const ModuleContent = ({
  module,
  onAddVideo,
  isInstructor,
  onAddTest,
  passedTestsIdList,
}) => {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const [completedVideos, setCompletedVideos] = useState({});

  const userId = user?._id;
  const { progress } = useSelector((state) => state.progress);

  const isTestPassed =
    module?.test &&
    passedTestsIdList &&
    passedTestsIdList.includes(module.test._id);

  // Fetch progress for each video in the module
  useEffect(() => {
    if (user?.role === "learner" && userId && module?.videos?.length) {
      module.videos.forEach((video) => {
        dispatch(fetchProgress({ userId, videoId: video._id }));
        setCompletedVideos(progress);
      });
    }
  }, [userId, module, dispatch, progress, user?.role]);

  const allVideosCompleted =
    module?.videos?.length &&
    module.videos.every((video) => completedVideos[video._id]);

  // Handler with confirmation for test deletion.
  const handleDeleteTest = (testId) => {
    const confirmDelete = window.confirm(
      "Êtes-vous sûr de vouloir supprimer ce test ?"
    );
    if (!confirmDelete) return;

    dispatch(deleteTestById(testId))
      .unwrap()
      .then(() => {
        // Refetch course details using the course id from module
        dispatch(fetchCourseDetailsById(module?.course_id));
      })
      .catch((error) => console.error(error));
  };

  // Handler with confirmation for video deletion.
  const handleDeleteVideo = (videoId) => {
    const confirmDelete = window.confirm(
      "Êtes-vous sûr de vouloir supprimer cette vidéo ?"
    );
    if (!confirmDelete) return;

    dispatch(deleteVideo(videoId))
      .unwrap()
      .then(() => {
        dispatch(fetchCourseDetailsById(module?.course_id));
      })
      .catch((error) => console.error(error));
  };

  // Handler with confirmation for module deletion.
  const handleDeleteModule = () => {
    const confirmDelete = window.confirm(
      "Êtes-vous sûr de vouloir supprimer ce module et toutes ses données associées ?"
    );
    if (!confirmDelete) return;

    dispatch(deleteModule(module._id))
      .unwrap()
      .then(() => {
        dispatch(fetchCourseDetailsById(module?.course_id));
      })
      .catch((error) => console.error(error));
  };

  return (
    <div className="p-2 mb-4 shadow border-bottom border-end border-secondary rounded-4 animate">
      {/* Collapsible Module Title */}
      <div className="">
        <button
          className="btn w-100 p-2 rounded d-flex justify-content-between align-items-center"
          data-bs-toggle="collapse"
          data-bs-target={`#${module?._id}`}
          style={{ border: "0px" }}
        >
          <div className="d-flex text-start align-items-end">
            <i
              className={`bi ${
                allVideosCompleted && isTestPassed
                  ? "bi-check-circle-fill"
                  : "bi-check-circle"
              } p-2 h5 mb-0`}
            ></i>
            <h6 className="fw-bold text-capitalize">{module?.title}</h6>
          </div>
          <i className="bi bi-chevron-down h4 mb-0"></i>
        </button>
      </div>

      {/* Collapsible Content */}
      <div id={module?._id} className="col-10 mx-auto collapse show mt-2">
        {/* Video List */}
        {module?.videos.map((video) => {
          const videoCompleted = completedVideos[video._id];
          return (
            <div key={video?._id} className="d-flex">
              <div className="d-flex col-12 justify-content-between align-items-center p-2 border-bottom border-secondary rounded mb-2 flex-wrap">
                <p className="mb-0 me-3 text-capitalize">{video?.title}</p>
                <i
                  className={`h5 mb-0 bi ${
                    videoCompleted ? "bi-camera-video-fill" : "bi-camera-video"
                  }`}
                ></i>
              </div>
              {/* Delete Video Button */}
              {isInstructor && (
                <div className="col-1 d-flex justify-content-center align-items-center mb-2">
                  <button
                    className="btn border-0"
                    onClick={() => handleDeleteVideo(video._id)}
                    title={"Suprimer la vidéo"}
                  >
                    <i className="bi bi-trash h5 mb-0 ms-2 text-danger"></i>
                  </button>
                </div>
              )}
            </div>
          );
        })}
        {/* Test Section */}
        {module?.test ? (
          <div className="d-flex col-11 mx-auto gap-2">
            <div className="d-flex col-11 mx-auto justify-content-between align-items-center p-2 border-bottom border-secondary rounded-3 mb-3">
              <h6 className="mb-0">Test</h6>
              <i
                className={`bi ${
                  isTestPassed
                    ? "bi-file-earmark-text-fill"
                    : "bi-file-earmark-text"
                } h5 mb-0`}
              ></i>
            </div>
            {/* Delete Test Button */}
            {isInstructor && (
              <div className="col-1 mx-auto d-flex justify-content-center align-items-center mb-3">
                <button
                  className="btn border-0"
                  onClick={() => handleDeleteTest(module?.test._id)}
                  title={"Suprimer le test"}
                >
                  <i className="bi bi-trash h5 mb-0 text-danger"></i>
                </button>
              </div>
            )}
          </div>
        ) : (
          <p>Pas de test pour ce module</p>
        )}

        {/* Instructor Buttons */}
        {isInstructor && (
          <div className="d-flex rounded-3 mb-2 col-12 mx-auto gap-4 flex-wrap">
            <div className="text-success col rounded-3 border-bottom border-secondary animate">
              <button
                className="btn w-100 p-2 border-0 flex-wrap d-flex justify-content-around align-items-center"
                onClick={onAddVideo}
              >
                <h6 className="mb-0 me-3">Ajouter une vidéo</h6>
                <i className="bi bi-patch-plus-fill h5 mb-0 text-success"></i>
              </button>
            </div>
            <div
              className={`text-success col rounded-3 border-bottom border-secondary ${
                !module?.test && "animate"
              }`}
            >
              <button
                className={`btn w-100 p-2 border-0 flex-wrap d-flex justify-content-around align-items-center ${
                  module?.test && "disabled"
                }`}
                onClick={onAddTest}
              >
                <h6 className="mb-0 me-3">Ajouter un test</h6>
                <i className="bi bi-clipboard2-plus-fill h5 mb-0 text-success"></i>
              </button>
            </div>
            {/* Delete Module Button */}
            <div className="text-danger col rounded-3 border-bottom border-secondary animate">
              <button
                className="btn w-100 p-2 border-0 flex-wrap d-flex justify-content-around align-items-center"
                onClick={handleDeleteModule}
              >
                <h6 className="mb-0 me-3">Supprimer module</h6>
                <i className="bi bi-x-octagon-fill h5 mb-0 text-danger"></i>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModuleContent;
