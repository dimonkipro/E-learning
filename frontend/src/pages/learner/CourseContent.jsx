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
import TestContainer from "../../components/TestContainer ";
import ModuleContentSideBar from "../../components/ModuleContentSideBar";

const CourseContent = () => {
  const dispatch = useDispatch();

  const { courseId, enrollementId } = useParams();

  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  const [selectedTest, setSelectedTest] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const { user } = useSelector((state) => state.auth);

  const { userEnrollments } = useSelector((state) => state.enrollments);

  const { currentCourse, courseModules, loading, error } = useSelector(
    (state) => state.courses
  );

  const isEnrolled =
    user?.role === "admin" ||
    userEnrollments?.some(
      (enrollment) =>
        enrollment?._id === enrollementId &&
        enrollment?.userId === user?._id &&
        enrollment?.courseId?._id === courseId &&
        enrollment?.status === "approved"
    );
  const isInstructor = currentCourse?.instructor?._id === user?._id;

  // Fetch Course Details By Id
  useEffect(() => {
    if (courseId) {
      dispatch(fetchCourseDetailsById(courseId));
    }
    return () => {
      dispatch(clearCurrentCourse());
    };
  }, [courseId, dispatch]);

  // Show video Or test
  useEffect(() => {
    if (!loading && courseModules?.length > 0 && !selectedVideo) {
      const firstModuleWithVideos = courseModules.find(
        (m) => m?.videos?.length > 0
      );
      if (firstModuleWithVideos && !selectedTest) {
        setSelectedVideo(firstModuleWithVideos.videos[0]);
      }
    }
  }, [loading, courseModules, selectedVideo, selectedTest]);

  // Test Select handler
  const handleTestSelect = (test) => {
    setSelectedTest(test);
    setSelectedVideo(null);
    setCurrentQuestionIndex(0);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!isEnrolled && !isInstructor) {
    return (
      <ErrorPage
        text={"Vous n'avez pas accès à cette page"}
        emojis={"(❁´⁔`❁)"}
        to={user?.role === "instructor" ? "/instructor/courses" : "/"}
      />
    );
  }

  return (
    <div className="col-12 mx-auto">
      {/* Button trigger Offcanvas */}
      <div
        className="d-flex justify-content-end position-sticky top me-1"
        style={{ top: "50px" }}
      >
        <i
          className="bi bi-chevron-compact-left fs-4 cursor-pointer p-2 rounded-start-pill bg-secondary"
          style={{
            cursor: "pointer",
            zIndex: 1000,
            transition: "all 0.3s ease",
          }}
          onClick={() => setIsSidebarVisible(!isSidebarVisible)}
        />
      </div>
      <div className="container col-10 col-lg-8 mx-auto">
        {/* Test Container */}
        {selectedTest ? (
          <TestContainer
            selectedTest={selectedTest}
            currentQuestionIndex={currentQuestionIndex}
            setCurrentQuestionIndex={setCurrentQuestionIndex}
            clearTest={() => setSelectedTest(null)}
          />
        ) : // Video Container
        selectedVideo ? (
          <VideoPlayer
            key={selectedVideo._id}
            video={selectedVideo}
            setSelectedVideo={setSelectedVideo}
            videoList={courseModules
              .flatMap((m) => m.videos)
              .filter((v) => !!v)}
          />
        ) : (
          <ErrorPage text={"Select a video or test to start"} />
        )}
      </div>

      {/* Offcanvas Modules Sidebar */}
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
          <div className="mb-5 mt-3">
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
          {courseModules?.map((module) => (
            <ModuleContentSideBar
              key={module?._id}
              module={module}
              test={module?.test}
              onVideoSelect={(video) => {
                setSelectedVideo(video);
                setSelectedTest(null);
              }}
              selectedVideo={selectedVideo}
              onTestSelect={handleTestSelect}
              selectedTest={selectedTest}
            />
          ))}
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
};

export default CourseContent;
