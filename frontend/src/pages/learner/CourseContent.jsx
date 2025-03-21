/* eslint-disable react/prop-types */
import { useDispatch, useSelector } from "react-redux";
import VideoPlayer from "../../components/VideoPlayer";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  clearCurrentCourse,
  fetchCourseDetailsById,
} from "../../redux/auth/courseSlice";
import { Offcanvas, ProgressBar } from "react-bootstrap";
import ErrorPage from "../../components/ErrorPage";

const CourseContent = () => {
  const dispatch = useDispatch();
  const { courseId, enrollementId } = useParams();

  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  const { user } = useSelector((state) => state.auth);

  const { userEnrollments } = useSelector((state) => state.enrollments);

  const { currentCourse, courseModules, loading, error } = useSelector(
    (state) => state.courses
  );

  const isEnrolled = userEnrollments?.some(
    (enrollment) =>
      enrollment?._id === enrollementId &&
      enrollment?.userId === user?._id &&
      enrollment?.courseId?._id === courseId &&
      enrollment?.status === "approved"
  );

  // Fetch Course Details By Id
  useEffect(() => {
    if (courseId) {
      dispatch(fetchCourseDetailsById(courseId));
    }
    return () => {
      dispatch(clearCurrentCourse());
    };
  }, [courseId, dispatch]);

  // Show video
  useEffect(() => {
    if (!loading && courseModules?.length > 0 && !selectedVideo) {
      const firstModuleWithVideos = courseModules.find(
        (m) => m?.videos?.length > 0
      );
      if (firstModuleWithVideos) {
        setSelectedVideo(firstModuleWithVideos.videos[0]);
      }
    }
  }, [loading, courseModules, selectedVideo]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!isEnrolled)
    return <ErrorPage text={"L'inscriptions au cours encore non approuvées"} />;

  return (
    <div className="container">
      <div className="col-12  col-lg-9 mx-auto">
        {selectedVideo ? (
          <VideoPlayer key={selectedVideo._id} video={selectedVideo} />
        ) : (
          <p>Select a video to start watching</p>
        )}
      </div>

      {/* Button trigger Offcanvas */}
      <i
        className="bi bi-chevron-compact-left position-absolute fs-4 cursor-pointer p-2 rounded-start-pill bg-secondary"
        style={{
          right: !isSidebarVisible ? "5px" : "25px",
          top: "100px",
          cursor: "pointer",
          zIndex: 1000,
          transition: "all 0.3s ease",
        }}
        onClick={() => setIsSidebarVisible(!isSidebarVisible)}
      />

      {/* Offcanvas Sidebar */}
      <Offcanvas
        show={isSidebarVisible}
        onHide={() => setIsSidebarVisible(false)}
        placement="end"
        scroll
        style={{
          transition: "all 0.7s ease",
        }}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>{currentCourse?.title}</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div className="my-4">
            <ProgressBar
              striped
              variant="warning"
              now={60}
              label={`${60}%`}
              style={{ direction: "rtl" }}
              animated
            />
          </div>

          {/* Module Content */}
          {courseModules?.length > 0 ? (
            courseModules.map((module) => (
              <ModuleContent
                key={module?._id}
                module={module}
                onVideoSelect={(video) => {
                  setSelectedVideo(video);
                  setIsSidebarVisible(false); // Close offcanvas when video is selected
                }}
              />
            ))
          ) : (
            <p>No modules available.</p>
          )}
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
};

const ModuleContent = ({ module, onVideoSelect }) => (
  <div className=" p-2 mb-4 shadow border-bottom rounded-4 ">
    {/* Collapsible Module Title */}
    <div className="d-flex align-items-center">
      <i className="bi bi-check-circle p-2 h4 mb-0"></i>
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
      {module?.videos.map((video) => (
        <div
          key={video?._id}
          className="d-flex justify-content-between align-items-center p-2 border-bottom rounded mb-2"
          onClick={() => onVideoSelect(video)} // Add click handler
          style={{ cursor: "pointer" }}
        >
          <i className="bi bi-camera-video h5 mb-0"></i>
          <span>{video?.title}</span>
        </div>
      ))}

      {/* Test */}
      <div className="d-flex justify-content-between align-items-center p-2 border-bottom rounded-3 mb-2">
        <i className="bi bi-file-earmark-text h5 mb-0"></i>
        <span>Test</span>
      </div>
    </div>
  </div>
);

export default CourseContent;
