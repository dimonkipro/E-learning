import { useDispatch, useSelector } from "react-redux";
import VideoPlayer from "../../components/VideoPlayer";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  clearCurrentCourse,
  fetchCourseDetailsById,
  fetchTestResults,
} from "../../redux/auth/courseSlice";
import { Offcanvas, ProgressBar } from "react-bootstrap";
import ErrorPage from "../../components/ErrorPage";
import TestContainer from "../../components/TestContainer ";
import ModuleContentSideBar from "../../components/ModuleContentSideBar";
import { fetchProgress } from "../../redux/auth/moduleSlice";
import CustomSpinner from "../../components/CustomSpinner";

const CourseContent = () => {
  const dispatch = useDispatch();

  const { courseId, enrollementId } = useParams();

  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  const [selectedTest, setSelectedTest] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const { user } = useSelector((state) => state.auth);

  const { userEnrollments, loading: isLoadiing } = useSelector(
    (state) => state.enrollments
  );

  const { currentCourse, courseModules, loading, error } = useSelector(
    (state) => state.courses
  );
  const { progress, loading: isLoading } = useSelector(
    (state) => state.progress
  );
  const { testProgress } = useSelector((state) => state.courses);

  const passedTestsIdList = testProgress?.passedTestsId;
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

  const userId = user?._id;

  // Fetch progress for each video in every module
  useEffect(() => {
    if (user?.role === "learner" && userId && courseModules?.length > 0) {
      courseModules.forEach((module) => {
        module?.videos.forEach((video) => {
          dispatch(fetchProgress({ userId, videoId: video?._id }));
        });
      });
    }
  }, [userId, dispatch, courseModules, selectedVideo, user?.role]);

  useEffect(() => {
    if (user?.role === "learner" && courseId) {
      dispatch(fetchTestResults(courseId));
    }

    return () => {
      dispatch(clearCurrentCourse());
    };
  }, [courseId, dispatch, user?.role]);

  // Determine the initial video to display based on progress:
  useEffect(() => {
    if (!loading && !isLoading && courseModules?.length > 0 && !selectedVideo) {
      const allVideos = courseModules
        .flatMap((module) => module.videos)
        .filter((v) => !!v);

      const firstUnseenVideo = allVideos.find(
        (video) => progress[video._id] !== true
      );
      setSelectedVideo(firstUnseenVideo || allVideos[0]);
    }
  }, [loading, courseModules, selectedVideo, progress, isLoading]);

  // Handle next (sent to videoContainer)
  const handleNextContent = () => {
    if (!selectedVideo) return;

    // Find the module that contains the current video.
    const currentModule = courseModules?.find(
      (module) => module._id === selectedVideo.module_id
    );

    if (currentModule) {
      // Get the list of videos for the curent module.
      const videosInModule = currentModule.videos.filter((v) => !!v);
      const currentIndex = videosInModule.findIndex(
        (v) => v._id === selectedVideo._id
      );

      if (currentIndex < videosInModule.length - 1) {
        setSelectedVideo(videosInModule[currentIndex + 1]);
      } else if (currentModule?.test) {
        // show the test instead.
        setSelectedTest(currentModule.test);
        setCurrentQuestionIndex(0);
      } else {
        setSelectedVideo(videosInModule[0]);
      }
    }
  };

  // Test selection handler
  const handleTestSelect = (test) => {
    setSelectedTest(test);
    setSelectedVideo(null);
    setCurrentQuestionIndex(0);
  };

  const isModuleLocked = (index, courseModules, passedTestsIdList) => {
    // The first module is never locked.
    if (index === 0) return false;

    const previousModule = courseModules[index - 1];
    const previousTestId = previousModule?.test?._id;

    // If there's a test in the previous module and it hasn't been passed, lock the module.
    return previousTestId
      ? !passedTestsIdList?.includes(previousTestId)
      : false;
  };

  if (loading || isLoadiing) return <CustomSpinner />;
  if (error) {
    return (
      <ErrorPage
        emojis="😢🚫"
        text={
          error === "Course not found or archived"
            ? "Cette formation est archivée ou n'existe pas."
            : error
        }
      />
    );
  }
  if (!isEnrolled && !isInstructor) {
    return (
      <ErrorPage
        text={"Vous n'avez pas accès à cette page"}
        emojis={"(❁´⁔`❁)"}
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
            courseId={courseId}
            selectedTest={selectedTest}
            passedTestsIdList={passedTestsIdList}
            currentQuestionIndex={currentQuestionIndex}
            setCurrentQuestionIndex={setCurrentQuestionIndex}
            clearTest={() => setSelectedTest(null)}
          />
        ) : selectedVideo ? (
          <VideoPlayer
            key={selectedVideo._id}
            video={selectedVideo}
            setSelectedVideo={setSelectedVideo}
            videoList={courseModules
              .flatMap((m) => m.videos)
              .filter((v) => !!v)}
            onNext={handleNextContent}
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
          {user?.role === "learner" && (
            <div className="mb-5 mt-3" style={{ direction: "rtl" }}>
              <div className="d-flex gap-3">
                {testProgress?.overallProgress === 0 && <p>0%</p>}
                <label>Progrès</label>
              </div>
              <ProgressBar
                striped
                variant="info"
                now={testProgress?.overallProgress}
                label={`${testProgress?.overallProgress}%`}
                animated
              />
            </div>
          )}

          {/* Module Content */}
          {courseModules?.map((module, index) => (
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
              passedTestsIdList={passedTestsIdList}
              isLocked={isModuleLocked(index, courseModules, passedTestsIdList)}
            />
          ))}
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
};

export default CourseContent;
