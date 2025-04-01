/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import {
  clearCurrentCourse,
  fetchCourseDetailsById,
} from "../../redux/auth/courseSlice";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import ErrorPage from "../../components/ErrorPage";
import { addModule, addVideo } from "../../redux/auth/moduleSlice";
import AddTestForm from "../../components/AddTestForm";

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

  const [formData, setFormData] = useState({
    videoTitle: "",
    videoOrder: "",
    videoDuration: "",
    video: null,
  });
useEffect(() => {
  if (courseId) {
    dispatch(fetchCourseDetailsById(courseId));
  }

  return () => {
    dispatch(clearCurrentCourse());
  };
}, [courseId, dispatch]);

  const { currentCourse, courseModules, loading, error } = useSelector(
    (state) => state.courses
  );

  const { user } = useSelector((state) => state.auth);

  const { userEnrollments } = useSelector((state) => state.enrollments);
  
  const isEnrolled = userEnrollments?.some(
    (enrollment) =>
      enrollment?._id === enrollementId &&
    enrollment?.userId === user?._id &&
      enrollment?.courseId?._id === courseId &&
      (enrollment?.status === "approved" || enrollment?.status === "pending")
    );
    const isInstructor = currentCourse?.instructor?._id === user?._id;
    
if (!isEnrolled && !isInstructor) {
  return (
    <ErrorPage
      text={"Vous n'avez pas accès à cette page"}
      emojis={"(❁´⁔`❁)"}
      to={user?.role === "instructor" ? "/instructor/courses" : "/"}
    />
  );
}

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

  return (
    <div className="col-12">
      {/* Hero */}
      {/* <div className="col-12 text-white shadow"> */}
      <div className="col-11 mx-auto text-white shadow rounded-5">
        <div className="col-xl-7 mb-5 mb-xl-0">
          <div className="p-3">
            <span className="d-inline-block bg-light small rounded-3 px-3 py-2 text-dark">
              Certificat obtenue à la fin de la formation 🤩
            </span>

            <p className="m-3 lh-base display-2" style={{ fontWeight: "300" }}>
              {currentCourse?.title}
            </p>
            <h4 className=" m-5 fw-light">{currentCourse?.description}</h4>
            <div className="d-flex flex-wrap d-block d-md-none mt-4">
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
              <span
                className="badge rounded-pill p-2 mt-3"
                style={{ backgroundColor: "#28c76f" }}
              >
                Prix: {currentCourse?.price} TND
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Module Details */}
      <div className="col-8 mx-auto mt-5">
        {/* Link To Course Content */}
        <div className="d-flex mb-5 justify-content-center bounce bounce-hover p-4 ">
          <LinkToolTip
            title="Voir Plus..."
            placement={"right"}
            to={
              user?.role === "learner"
                ? `/learner/course/content/${courseId}/${enrollementId}`
                : user?.role === "instructor"
                ? `/instructor/course/content/${courseId}`
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
        aria-hidden={!showModal}
      >
        <form onSubmit={handleAddModule}>
          <div className="modal-dialog modal-lg modal-fullscreen-lg-down mx-auto">
            <div className="modal-content">
              <div className="modal-header col-12 col-lg-12 col-md-11 col-sm-11 p-4">
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
      >
        <form onSubmit={handleAddVideo}>
          <div className="modal-dialog modal-lg modal-fullscreen-lg-down mx-auto">
            <div className="modal-content">
              <div className="modal-header col-12 col-lg-12 col-md-11 col-sm-11 p-4">
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

const ModuleContent = ({ module, onAddVideo, isInstructor, onAddTest }) => (
  <div className="p-2 mb-4 shadow border-bottom border-end border-secondary rounded-4 animate">
    {/* Collapsible Module Title */}
    <div className="d-flex align-items-center">
      <button
        className="btn w-100 p-2 rounded text-start d-flex align-items-end"
        data-bs-toggle="collapse"
        data-bs-target={`#${module?._id}`}
        style={{ border: "0px" }}
      >
        <i className="bi bi-check-circle p-2 h5 mb-0"></i>
        <h6 className="fw-bold text-capitalize">{module?.title}</h6>
      </button>
      <i className="bi bi-chevron-down me-2 h4"></i>
    </div>

    {/* Collapsible Content */}
    <div id={module?._id} className="col-10 mx-auto collapse show mt-2">
      {/* Video Title */}
      {module?.videos.map((video) => (
        <div
          key={video?._id}
          className="d-flex justify-content-between align-items-center p-2 border-bottom border-secondary rounded mb-2 flex-wrap"
        >
          <p className="mb-0 me-3 text-capitalize">{video?.title}</p>
          <i className="bi bi-camera-video h5 mb-0"></i>
        </div>
      ))}
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
export default CourseDetails;
