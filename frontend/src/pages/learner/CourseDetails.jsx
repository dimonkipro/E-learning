/* eslint-disable react/prop-types */
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import {
  clearCurrentCourse,
  fetchCourseDetailsById,
} from "../../redux/auth/courseSlice";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import ErrorPage from "../../components/ErrorPage";

const CourseDetails = () => {
  const dispatch = useDispatch();
  const { courseId, enrollementId } = useParams();

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

  useEffect(() => {
    if (courseId) {
      dispatch(fetchCourseDetailsById(courseId));
    }

    return () => {
      dispatch(clearCurrentCourse());
    };
  }, [courseId, dispatch]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!isEnrolled)
    return (
      <ErrorPage
        text={"Votre inscription au formation été refusée"}
        emojis={"(❁´⁔`❁)"}
      />
    );

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

            <p className="m-3 lh-base display-1" style={{ fontWeight: "400" }}>
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
        <div className="d-flex mb-5 justify-content-center">
          <LinkToolTip
            title="Voir Plus..."
            placement={"right"}
            to={`/learner/course/content/${courseId}/${enrollementId}`}
            className={
              "d-flex gap-3 link-body-emphasis link-offset-2 link-underline-opacity-25 link-underline-opacity-75-hover"
            }
          >
            <h1>Formation: {currentCourse?.title}</h1>
            <i className="bi bi-box-arrow-in-up-right h3"></i>
          </LinkToolTip>
        </div>

        {/* Module Content */}
        {courseModules?.length > 0 ? (
          courseModules.map((module) => (
            <ModuleContent key={module?._id} module={module} />
          ))
        ) : (
          <p>No modules available.</p>
        )}
      </div>
    </div>
  );
};

export const LinkToolTip = ({ id, children, title, to, className, onClick, placement }) => (
  <OverlayTrigger
    placement={placement}
    overlay={<Tooltip id={id}>{title}</Tooltip>}
  >
    <Link to={to} className={className} onClick={onClick}>
      {children}
    </Link>
  </OverlayTrigger>
);

const ModuleContent = ({ module }) => (
  <div className=" p-2 mb-4 shadow border-bottom border-end border-secondary rounded-4 ">
    {/* Collapsible Module Title */}
    <div className="d-flex align-items-center">
      <button
        className="btn w-100 p-2 rounded text-start d-flex align-items-end"
        data-bs-toggle="collapse"
        data-bs-target={`#${module?._id}`}
      >
        <i className="bi bi-check-circle p-2 h3 mb-0"></i>
        <h4>{module?.title}</h4>
      </button>
      <i className="bi bi-chevron-down me-2"></i>
    </div>

    {/* Collapsible Content */}
    <div id={module?._id} className="col-10 mx-auto collapse show mt-2">
      {/* Video Title */}
      {module?.videos.map((video) => (
        <div
          key={video?._id}
          className="d-flex justify-content-between align-items-center p-2 border-bottom border-secondary rounded mb-2"
        >
          <h5>{video?.title}</h5>
          <i className="bi bi-camera-video h4 mb-0"></i>
        </div>
      ))}
      {/* Test */}
      <div className="d-flex justify-content-between align-items-center p-2 border-bottom border-secondary rounded-3 mb-2">
        <h5>Test</h5>
        <i className="bi bi-file-earmark-text h4 mb-0"></i>
      </div>
    </div>
  </div>
);
export default CourseDetails;
