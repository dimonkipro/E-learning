import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCourseById, clearCurrentCourse } from "../redux/auth/courseSlice";
import { toast } from "react-toastify";

const CoursePage = () => {
  // const theme = localStorage.getItem("theme");
  const { courseId } = useParams();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { currentCourse, loading, error } = useSelector(
    (state) => state.courses
  );
  useEffect(() => {
    dispatch(fetchCourseById(courseId));

    return () => {
      dispatch(clearCurrentCourse());
    };
  }, [courseId, dispatch]);
  const isInstructor = currentCourse?.instructor?._id === user?._id;

  const [activeLink, setActiveLink] = useState("desc");

  const getLevelBadgeClass = (level) => {
    switch (level.toLowerCase()) {
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="mb-5">
      {currentCourse && (
        <>
          {/* Hero */}
          {/* <div className="col-12 text-white shadow"> */}
          <div className="col-11 mx-auto text-white shadow rounded-5">
            <div className="col-xl-9 col-md-9">
              <div className="p-3">
                <span className="d-inline-block bg-light small rounded-3 px-3 py-2 text-dark">
                  Certificat obtenue à la fin de la formation 🤩
                </span>

                <p
                  className="m-3 lh-base display-2"
                  style={{ fontWeight: "400" }}
                >
                  {currentCourse?.title}
                </p>
                <h4 className=" mx-5 fw-light">{currentCourse?.description}</h4>
                <div className="d-flex flex-wrap d-block d-md-none mt-4">
                  <span
                    className={`badge ${getLevelBadgeClass(
                      currentCourse.level
                    )} rounded-pill p-2 me-2 mt-3`}
                  >
                    Niveau: {currentCourse.level}
                  </span>
                  <span className="badge bg-secondary rounded-pill p-2 me-2 mt-3">
                    Formateur: {currentCourse.instructor?.name}
                  </span>
                  <span className="badge bg-secondary rounded-pill p-2 me-2 mt-3">
                    Categorie: {currentCourse.category?.name}
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

          {/* Left Side Container */}
          <div className="container col-12 ">
            {/* Details Card */}
            <div className="col-12 col-md-7 mt-5">
              <div className="card-body">
                {/* Nav Links */}
                <ul
                  // className={`nav nav-tabs position-sticky top-0
                  // bg-${theme === "dark" ? "dark" : "white"}`}
                  className="nav nav-tabs position-sticky top-0 custom-bg rounded border-0 shadow z-3"
                >
                  <li className="nav-item">
                    <a
                      className={`nav-link link-secondary ${
                        activeLink === "desc"
                          ? "active link-light custom-bg "
                          : ""
                      }`}
                      href="#desc"
                      onClick={() => setActiveLink("desc")}
                    >
                      Description
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      className={`nav-link link-secondary ${
                        activeLink === "goals"
                          ? "active link-light custom-bg"
                          : ""
                      }`}
                      href="#goals"
                      onClick={() => setActiveLink("goals")}
                    >
                      Objectifs
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      className={`nav-link link-secondary ${
                        activeLink === "trainer"
                          ? "active link-light custom-bg"
                          : ""
                      }`}
                      href="#trainer"
                      onClick={() => setActiveLink("trainer")}
                    >
                      Formateur
                    </a>
                  </li>
                </ul>

                {/* Description Content */}
                <div id="desc">
                  <h3 className="m-4">Description</h3>
                  <p>{currentCourse?.longDescription}</p>
                </div>

                {/* Goals Content */}
                <div id="goals">
                  <h3 className="m-4">Objectifs</h3>
                  <p>{currentCourse?.goals}</p>
                </div>

                {/* Trainer Content */}
                <div id="trainer">
                  <h3 className="m-4">Formateur</h3>
                  {/* trainer Card */}
                  <div className="card col-6 col-lg-4 text-center shadow">
                    <div className="d-flex position-relative">
                      <img
                        src="https://placehold.co/400"
                        className="rounded-circle card-img-top object-fit-cover"
                        alt="..."
                      />
                    </div>
                    <div className="card-body">
                      <p className="card-title fw-bold">
                        {currentCourse.instructor?.name}
                      </p>

                      <p className="card-text">
                        {currentCourse.instructor?._id}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side Fixed Card */}
            <div
              className="col-3 position-fixed end-0 d-none d-md-block d-lg-block me-2"
              style={{ top: "15vh" }}
            >
              <div className="card text-center">
                <div className="d-flex position-relative">
                  <span
                    className="position-absolute top-0 start-0 badge rounded-pill 
                      text-bg-secondary m-2 shadow opacity-75 p-2"
                  >
                    {currentCourse.category.name}
                  </span>
                  <img
                    src={`http://localhost:5000/${currentCourse.image.replace(
                      /\\/g,
                      "/"
                    )}`}
                    className="card-img-top object-fit-cover"
                    alt="..."
                  />
                  <p className="card-text">
                    <span
                      className={`badge ${getLevelBadgeClass(
                        currentCourse.level
                      )} text-white position-absolute bottom-0 end-0 m-2 shadow`}
                    >
                      {currentCourse.level}
                    </span>
                  </p>
                </div>

                <div className="card-body">
                  <p className="card-title fw-bold">{currentCourse.title}</p>

                  <p className="card-text">{currentCourse.description}</p>

                  <div className="d-flex justify-content-between">
                    <p className="card-text bg-body-secondary rounded-4 p-1 m-0">
                      {currentCourse.price} TND
                    </p>

                    {!user ? (
                      <Link
                        to="/login"
                        className="link-secondary link-offset-2 link-underline-opacity-25
                 link-underline-opacity-100-hover"
                      >
                        S&apos;inscrire
                      </Link>
                    ) : (user.role === "user" || user.role === "learner") &&
                      user.isVerified ? (
                      // Show apply link for verified regular users
                      <Link
                        to={`/course/${currentCourse._id}/apply`}
                        className="link-secondary link-offset-2 link-underline-opacity-25
                 link-underline-opacity-100-hover"
                      >
                        S&apos;inscrire
                      </Link>
                    ) : !user.isVerified ? (
                      <Link
                        className="link-secondary link-offset-2 link-underline-opacity-25
                 link-underline-opacity-100-hover"
                        onClick={() =>
                          toast.info(
                            "Utilisateur non vérifié. Vous ne pouvez pas vous inscrire maintenant"
                          )
                        }
                      >
                        S&apos;inscrire
                      </Link>
                    ) : null}
                  </div>
                </div>
                {user?.role == "admin" ? (
                  <div className="card-footer">
                    <div className="d-flex justify-content-end">
                      <Link
                        to={`/admin/edit-course/${currentCourse._id}`}
                        className="link-secondary link-offset-2 link-underline-opacity-25 
                      link-underline-opacity-100-hover"
                      >
                        Modifier
                      </Link>
                    </div>
                  </div>
                ) : (
                  user?.role == "instructor" &&
                  isInstructor && (
                    <div className="card-footer">
                      <div className="d-flex justify-content-end">
                        <Link
                          to={`/instructor/course/${currentCourse._id}`}
                          className="link-secondary link-offset-2 link-underline-opacity-25 
                      link-underline-opacity-100-hover"
                        >
                          Modifier
                        </Link>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Enrollment Card */}
            <div
              className="col-12 col-md-6 col-lg-6 z-3 position-relative mx-auto mt-5 p-4 rounded-4 shadow text-white text-center"
              style={{ display: `${user?.role === "admin" ? "none" : ""}` }}
            >
              {isInstructor ? (
                <h2>Gérez votre cours</h2>
              ) : user?.role === "user" ||
                (user?.role === "learner" && user?.isVerified) ? (
                <>
                  <h2>Êtes-vous prêt à plonger ?</h2>
                  <p>
                    Postulez maintenant et commencez à apprendre instantanément.
                  </p>
                </>
              ) : !user || !user?.isVerified ? (
                <h2>Inscrivez-vous maintenant</h2>
              ) : null}
              {isInstructor ? (
                <Link
                  className="btn btn-light rounded-5"
                  to={`/instructor/course/${currentCourse._id}`}
                >
                  Modifier
                </Link>
              ) : !user ? (
                <Link className="btn btn-light rounded-5" to={"/login"}>
                  Inscrivez-vous maintenant
                </Link>
              ) : !user?.isVerified ? (
                <>
                  <button
                    className="btn btn-light rounded-5"
                    onClick={() =>
                      toast.info(
                        "Utilisateur non vérifié. Vous ne pouvez pas vous inscrire maintenant"
                      )
                    }
                  >
                    Inscrivez-vous maintenant
                  </button>
                </>
              ) : user?.role === "user" ||
                (user?.role === "learner" && user?.isVerified) ? (
                <Link
                  to={`/course/${currentCourse._id}/apply`}
                  className="btn btn-light rounded-5"
                >
                  Inscrivez-vous maintenant
                </Link>
              ) : null}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CoursePage;
