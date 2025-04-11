/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import {
  clearCurrentCourse,
  fetchCourseDetailsById,
  fetchTestResults,
} from "../../redux/auth/courseSlice";
import { OverlayTrigger, ProgressBar, Tooltip } from "react-bootstrap";
import ErrorPage from "../../components/ErrorPage";
import {
  addModule,
  addVideo,
  fetchProgress,
} from "../../redux/auth/moduleSlice";
import AddTestForm from "../../components/AddTestForm";
import ModuleContent from "../../components/ModuleContent";

const CourseDetails = () => {
  const dispatch = useDispatch();
  const { courseId, enrollementId } = useParams();

  const [showModal, setShowModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);

  const [selectedModuleId, setSelectedModuleId] = useState(null);
  const [selectedModuleTitle, setSelectedModuleTitle] = useState(null);

  const [title, setTitle] = useState("");
  const [order, setOrder] = useState("");
  const [showTestModal, setShowTestModal] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const {
    currentCourse,
    courseModules,
    loading,
    error,
    tests,
    videos,
    testProgress,
  } = useSelector((state) => state.courses);

  const isInstructor = currentCourse?.instructor?._id === user?._id;

  const userId = user?._id;

  const [formData, setFormData] = useState({
    videoTitle: "",
    videoOrder: "",
    videoDuration: "",
    video: null,
  });
  // Fetch Course Details By Id
  useEffect(() => {
    if (courseId) {
      dispatch(fetchCourseDetailsById(courseId));
    }

    return () => {
      dispatch(clearCurrentCourse());
    };
  }, [courseId, dispatch]);

// Fetch Test Results
  useEffect(() => {
    if (user?.role === "learner" && courseId) {
      dispatch(fetchTestResults(courseId));
    }

    return () => {
      dispatch(clearCurrentCourse());
    };
  }, [courseId, dispatch, user?.role]);

  // Fetch progress for each video in every module
  useEffect(() => {
    if (user?.role === "learner" && userId && courseModules?.length > 0) {
      courseModules.forEach((module) => {
        module.videos.forEach((video) => {
          dispatch(fetchProgress({ userId, videoId: video._id }));
        });
      });
    }
  }, [userId, dispatch, courseModules, user?.role]);

  const { userEnrollments } = useSelector((state) => state.enrollments);

  const isEnrolled =
    user?.role === "admin" ||
    userEnrollments?.some(
      (enrollment) =>
        enrollment?._id === enrollementId &&
        enrollment?.userId === user?._id &&
        enrollment?.courseId?._id === courseId &&
        (enrollment?.status === "approved" || enrollment?.status === "pending")
    );

  const getLevelBadgeClass = (level) => {
    switch (level?.toLowerCase()) {
      case "beginner":
        return "bg-success";
      case "intermediate":
        return "bg-info";
      case "advanced":
        return "custom-bg-warning";
      case "expert":
        return "bg-danger";
      default:
        return "bg-secondary";
    }
  };

  // Handle Input Change
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle File Change
  const handleFileChange = (e) => {
    setFormData({ ...formData, video: e.target.files[0] });
  };

  const handleAddModule = (e) => {
    e.preventDefault();
    dispatch(addModule({ title, order: Number(order), courseId }))
      .unwrap()
      .then(() => {
        dispatch(fetchCourseDetailsById(courseId));

        setShowModal(false);
        setTitle("");
        setOrder("");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleAddVideo = (e) => {
    e.preventDefault();
    if (!selectedModuleId) return;

    const formDataToSend = new FormData();

    formDataToSend.append("title", formData.videoTitle);
    formDataToSend.append("order", formData.videoOrder);
    formDataToSend.append("duration", formData.videoDuration);
    formDataToSend.append("video", formData.video);

    dispatch(
      addVideo({
        formData: formDataToSend,
        moduleId: selectedModuleId,
      })
    )
      .unwrap()
      .then(() => {
        dispatch(fetchCourseDetailsById(courseId));
        setFormData({
          videoTitle: "",
          videoOrder: "",
          videoDuration: "",
          video: null,
        });
        setShowVideoModal(false);
      })
      .catch((error) => console.error(error));
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
  console.log("testProgress", testProgress);
  
  return (
    <div className="col-12">
      {/* Hero */}
      {/* <div className="col-12 text-white shadow"> */}
      <div className="col-11 mx-auto d-flex flex-wrap text-white shadow rounded-5 p-2">
        {/* <div className="col-12 p-3"> */}
        <div className="col-12 col-sm-9 p-3">
          <span className="d-inline-block bg-light small rounded-3 px-3 py-2 text-dark">
            Certificat obtenue à la fin de la formation 🤩
          </span>

          <p
            className="m-3 lh-base display-2 text-center"
            style={{ fontWeight: "300" }}
          >
            {currentCourse?.title}
          </p>
          <h4 className=" m-5 fw-light">{currentCourse?.description}</h4>

          {/* Count And Progress */}
          <div className="col-10 col-md-5">
            <span className="badge bg-secondary p-2">
              {courseModules?.length} Module(s)
            </span>
            <span className="badge bg-secondary p-2 mt-2 mx-2">
              {videos?.length} vidéo(s)
            </span>
            <span className="badge bg-secondary p-2 mt-2">
              {tests?.length} Test(s)
            </span>
            {user?.role === "learner" && (
              <div className="mt-2">
                <div className="d-flex gap-3">
                  <label>Progrès</label>
                  {testProgress?.overallProgress === 0 && <p>0%</p>}
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
          </div>

          {/* Course Details */}
          <div className="d-flex flex-wrap mt-2">
            <span
              className={`badge ${getLevelBadgeClass(
                currentCourse?.level
              )} rounded-pill p-2 me-2 mt-3`}
            >
              Niveau: {currentCourse?.level}
            </span>
            <span className="badge bg-secondary rounded-pill p-2 me-2 mt-3">
              Formateur: {currentCourse?.instructor?.name}
            </span>
            <span className="badge bg-secondary rounded-pill p-2 me-2 mt-3">
              Categorie: {currentCourse?.category?.name}
            </span>
          </div>
        </div>

        {/* Image */}
        <div className="col-8 col-sm-3 col-lg-3 mx-auto d-flex flex-column justify-content-center d-none d-sm-flex">
          <img
            src={`http://localhost:5000/${currentCourse?.image.replaceAll(
              "\\",
              "/"
            )}`}
            alt=""
            className="col-12 mx-auto rounded-start-pill"
          />
        </div>
      </div>

      {/* Module Details */}
      <div className="col-10 col-md-7 mx-auto mt-5">
        {/* Link To Course Content */}
        <div className="d-flex mb-5 col-10 mx-auto justify-content-center bounce bounce-hover p-4 ">
          <LinkToolTip
            title="Voir Plus..."
            placement={"right"}
            to={
              user?.role === "learner"
                ? `/learner/course/content/${courseId}/${enrollementId}`
                : user?.role === "instructor"
                ? `/instructor/course/content/${courseId}`
                : user?.role === "admin"
                ? `/admin/course/content/${courseId}`
                : null
            }
            className={
              "d-flex gap-3 link-body-emphasis link-offset-2 link-underline-opacity-25 link-underline-opacity-75-hover"
            }
          >
            <h2>Formation: {currentCourse?.title}</h2>
            <i className="bi bi-box-arrow-in-up-right h3"></i>
          </LinkToolTip>
        </div>

        {/* Add Module Button */}
        {user?.role === "instructor" && (
          <div className="text-success col mb-4">
            <button
              className="btn p-2 flex-wrap d-flex justify-content-around align-items-center border-secondary border-bottom rounded-3"
              onClick={() => {
                setShowModal(true);
              }}
              style={{ border: "0px" }}
            >
              <h6 className="mb-0 me-3 animate">Ajouter un module</h6>
              <i className="bi bi-journal-plus h4 mb-0 text-success animate"></i>
            </button>
          </div>
        )}

        {/* Module Content */}
        {courseModules?.length > 0 ? (
          courseModules.map((module) => (
            <ModuleContent
              key={module?._id}
              module={module}
              isInstructor={user?.role === "instructor" ? true : false}
              onAddVideo={() => {
                setSelectedModuleId(module._id);
                setSelectedModuleTitle(module.title);
                setShowVideoModal(true);
              }}
              onAddTest={() => {
                setSelectedModuleId(module._id);
                setShowTestModal(true);
              }}
            />
          ))
        ) : (
          <p>No modules available.</p>
        )}
      </div>

      {/* Modal for Adding a Module */}
      <div
        className={`modal ${showModal ? "show" : ""}`}
        style={{ display: showModal ? "block" : "none" }}
        aria-labelledby="courseModal"
        // aria-hidden={!showModal}
        onClick={(e) => {
          if (e.target.classList.contains("modal")) {
            setShowModal(false);
            console.log(e.target.classList);
          }
        }}
      >
        <form onSubmit={handleAddModule}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header p-4">
                <h6 className="modal-title" id="courseModal">
                  Ajouter un nouveau module
                </h6>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body col-12 col-lg-12 col-md-11 col-sm-11 mx-auto p-4">
                <input
                  type="text"
                  name="title"
                  className="form-control mb-3"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Nom du module"
                  required
                />
                <input
                  type="text"
                  name="order"
                  className="form-control"
                  value={order}
                  onChange={(e) => setOrder(e.target.value)}
                  placeholder="Ordre"
                  required
                />
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Fermer
                </button>

                <button type="submit" className="btn btn-warning">
                  Ajouter module
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Modal for Adding a Video */}
      <div
        className={`modal ${showVideoModal ? "show" : ""}`}
        style={{ display: showVideoModal ? "block" : "none" }}
        aria-labelledby="videoModal"
        aria-hidden={!showVideoModal}
        onClick={(e) => {
          if (e.target.classList.contains("modal")) {
            setShowVideoModal(false);
          }
        }}
      >
        <form onSubmit={handleAddVideo}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header p-4">
                <h6 className="modal-title" id="videoModal">
                  Ajouter un nouveau vidéo
                </h6>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowVideoModal(false)}
                ></button>
              </div>
              <div className="modal-body col-12 col-lg-12 col-md-11 col-sm-11 mx-auto p-4">
                <h2>{selectedModuleTitle}</h2>
                <input
                  type="text"
                  name="videoTitle"
                  className="form-control my-3"
                  onChange={handleInputChange}
                  placeholder="Nom du video"
                  required
                />

                <input
                  type="text"
                  name="videoOrder"
                  className="form-control mb-3"
                  onChange={handleInputChange}
                  placeholder="Ordre"
                  required
                />

                <input
                  type="number"
                  name="videoDuration"
                  className="form-control mb-3"
                  onChange={handleInputChange}
                  placeholder="Durée de video"
                  required
                />

                <input
                  type="file"
                  name="video"
                  className="form-control"
                  onChange={handleFileChange}
                  required
                />
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowVideoModal(false)}
                >
                  Fermer
                </button>

                <button type="submit" className="btn btn-warning">
                  Ajouter Vidéo
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
      {/* // Add Test Modal */}
      <AddTestForm
        showTestModal={showTestModal}
        setShowTestModal={setShowTestModal}
        selectedModuleId={selectedModuleId}
        courseId={courseId}
      />
    </div>
  );
};

export const LinkToolTip = ({
  id,
  children,
  title,
  to,
  className,
  onClick,
  placement,
}) => (
  <OverlayTrigger
    placement={placement}
    overlay={<Tooltip id={id}>{title}</Tooltip>}
  >
    <Link to={to} className={className} onClick={onClick}>
      {children}
    </Link>
  </OverlayTrigger>
);

export default CourseDetails;
