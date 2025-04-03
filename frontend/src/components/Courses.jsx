import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useSearchParams } from "react-router-dom";
import { fetchCourses } from "../redux/auth/courseSlice";
import AddCourseForm from "./AddCourseForm";
import Pagination from "./Pagination";
import { LinkToolTip } from "../pages/learner/CourseDetails";
import Footer from "./Footer";

const Courses = () => {
  const dispatch = useDispatch();

  const { courses } = useSelector((state) => state.courses);
  const { user } = useSelector((state) => state.auth);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showMyCourses, setShowMyCourses] = useState(false);
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [sortOrder, setSortOrder] = useState("all"); // or "desc"

  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = parseInt(searchParams.get("page")) || 1;

  const categoryMap = {};

  courses.forEach((course) => {
    const cat = course.category;
    categoryMap[cat._id] = cat;
  });

  const categories = Object.values(categoryMap);

  // Filter courses based on selected category
  const filteredCourses = selectedCategory
    ? courses.filter((course) => course.category._id === selectedCategory)
    : courses;

  let finalFilteredCourses = filteredCourses;

  if (user?.role === "instructor" && showMyCourses) {
    finalFilteredCourses = filteredCourses.filter(
      (course) => course?.instructor?._id === user?._id
    );
  }

  // Sort courses by price
  finalFilteredCourses = [...finalFilteredCourses].sort((a, b) => {
    return sortOrder === "asc"
      ? a.price - b.price
      : sortOrder === "desc"
      ? b.price - a.price
      : filteredCourses;
  });

  const coursesPerPage = 4;
  const totalPages = Math.ceil(finalFilteredCourses.length / coursesPerPage);
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentcourses = finalFilteredCourses.slice(
    indexOfFirstCourse,
    indexOfLastCourse
  );

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

  useEffect(() => {
    dispatch(fetchCourses());
  }, [dispatch]);

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setSearchParams({ page: 1 });
  };

  // Handle pagination actions
  const handlePageChange = (pageNumber) => {
    setSearchParams({ page: pageNumber });
  };

  return (
    <div className="col-12">
      <div className="col-11 mx-auto">
        {/* Text / Upper Pagination */}
        <div className="d-flex justify-content-between align-items-center flex-wrap mb-4">
          <div className="d-flex align-items-center gap-4 col-8  flex-wrap">
            <h2 className="">
              {selectedCategory
                ? categories.find((c) => c._id === selectedCategory)?.name
                : "Tout les Formations"}
            </h2>

            {/* Ctegories toggle button */}
            <LinkToolTip
              title={"Categories / Prix"}
              placement={"bottom"}
              onClick={() => setShowOffcanvas(true)}
              className={
                "link-primary fs-5 animate link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover me-4"
              }
            >
              {" "}
              Trier <i className="bi bi-funnel"></i>
            </LinkToolTip>

            {/* Add Course Button */}
            {user?.role === "admin" && (
              <LinkToolTip
                title="Ajouter une formation"
                placement={"bottom"}
                className={
                  "link-primary fs-5 link-offset-2 animate link-underline-opacity-25 link-underline-opacity-100-hover me-4"
                }
                onClick={() => {
                  setShowModal(true);
                  setShowOffcanvas(false);
                }}
              >
                Ajouter.. {">"}
              </LinkToolTip>
            )}
          </div>

          {/* Categories Offcanvas  */}
          <div
            className={`offcanvas offcanvas-start ${
              showOffcanvas ? "show" : ""
            }`}
            tabIndex="-1"
            id="offcanvasCategories"
            aria-labelledby="offcanvasCategoriesLabel"
            data-bs-backdrop="true"
            style={{
              visibility: showOffcanvas ? "visible" : "hidden",
              width: "18rem",
            }}
          >
            <div className="offcanvas-header">
              <div className="d-flex align-items-center gap-2">
                <h3 className="offcanvas-title" id="offcanvasCategoriesLabel">
                  Filtre
                </h3>
                <i className="bi bi-funnel h3 mb-0"></i>
              </div>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowOffcanvas(false)}
                aria-label="Close"
              ></button>
            </div>

            {/* Filter */}
            <div className="offcanvas-body">
              {/* Instructor Filter */}
              {user?.role === "instructor" && (
                <div className="mb-3">
                  <LinkToolTip
                    title="Trier"
                    placement={"bottom"}
                    onClick={() => {
                      setShowMyCourses(!showMyCourses);
                      setShowOffcanvas(false);
                    }}
                    className={
                      "link-primary fs-5 link-offset-2 bounce-hover link-underline-opacity-25 link-underline-opacity-100-hover me-4"
                    }
                  >
                    {showMyCourses ? "Afficher tout" : "Cours attribués"} {">"}
                  </LinkToolTip>
                </div>
              )}
              {/* Category Filter */}
              <h5 className="mb-3">Trier par categorie</h5>
              <div className="list-group shadow mb-4">
                <Link
                  onClick={() => {
                    setSelectedCategory(null);
                    setShowOffcanvas(false);
                  }}
                  className={`list-group-item list-group-item-warning d-flex justify-content-between align-items-center text-break ${
                    !selectedCategory ? "active" : ""
                  }`}
                >
                  All Categories
                  <span className="badge bg-secondary rounded-pill">
                    {courses.length}
                  </span>
                </Link>
                {categories.map((category) => (
                  <Link
                    key={category._id}
                    onClick={() => {
                      handleCategoryChange(category._id);
                      setShowOffcanvas(false);
                    }}
                    className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center text-break${
                      selectedCategory === category._id ? "active" : ""
                    }`}
                  >
                    {category.name}
                    <span className="badge bg-secondary rounded-pill">
                      {
                        courses.filter((c) => c.category._id === category._id)
                          .length
                      }
                    </span>
                  </Link>
                ))}
              </div>

              {/* Price Filter */}
              <h5 className="mb-3">Trier par prix</h5>
              <div className=" shadow rounded p-3">
                <div
                  className="d-flex justify-content-between"
                  onClick={() => {
                    setSortOrder("asc");
                    setShowOffcanvas(false);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  Croissant
                  <i className="bi bi-sort-numeric-up-alt h4 mx-3"></i>
                </div>
                <div
                  className="d-flex justify-content-between"
                  onClick={() => {
                    setSortOrder("desc");
                    setShowOffcanvas(false);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  Décroissant
                  <i className="bi bi-sort-numeric-down-alt h4 mx-3"></i>
                </div>
              </div>
            </div>
          </div>

          {/* Upper Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>

        {/* Cards */}
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4 mb-3">
          {/* Card */}
          {currentcourses.length > 0 ? (
            currentcourses.map((course) => (
              <div className="col" key={course._id}>
                <div className="card  text-center shadow bounce-hover">
                  {/* <div className="card h-100 text-center shadow"> */}
                  <Link
                    to={`/courses/${course._id}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    {/* Card Header */}
                    <div
                      className="d-flex position-relative"
                      // style={{ height: "12.5rem " }}
                    >
                      <span
                        className="position-absolute top-0 start-0 badge  
                      bg-secondary m-2 shadow opacity-75"
                      >
                        {course.category.name}
                      </span>

                      <img
                        src={`http://localhost:5000/${course?.image.replaceAll(
                          "\\",
                          "/"
                        )}`}
                        className="card-img-top object-fit-contain"
                        alt="..."
                        // style={{ height: "11.5rem " }}
                      />

                      <span
                        className={`badge ${getLevelBadgeClass(
                          course.level
                        )} text-white position-absolute bottom-0 end-0 m-2 shadow`}
                      >
                        {course.level}
                      </span>
                    </div>
                  </Link>
                  <div className="card-body d-flex flex-column justify-content-evenly">
                    <p className="card-title fw-bold">{course.title}</p>

                    <p className="card-text bg-body-secondary rounded-4 p-1 col-8 mx-auto">
                      {course.price} TND
                    </p>
                  </div>
                  {user?.role == "admin" ? (
                    <div className="card-footer">
                      <div className="d-flex justify-content-end">
                        <Link
                          to={`/admin/edit-course/${course._id}`}
                          className="link-secondary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover"
                        >
                          Modifier
                        </Link>
                      </div>
                    </div>
                  ) : (
                    course?.instructor?._id === user?._id && (
                      <div className="card-footer">
                        <div className="d-flex justify-content-end">
                          <Link
                            to={`/instructor/course/${course._id}`}
                            className="link-secondary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover"
                          >
                            Modifier
                          </Link>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            ))
          ) : (
            <p>Rien á afficher.</p>
          )}
        </div>

        {/* Lower Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />

        {/* Modal for Adding a Course */}
        <div
          className={`modal ${showModal ? "show" : ""}`}
          style={{ display: showModal ? "block" : "none" }}
          aria-labelledby="courseModal"
          aria-hidden={!showModal}
        >
          <div className="modal-dialog modal-lg modal-fullscreen-lg-down mx-auto">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="courseModal">
                  Ajouter une nouvelle formation
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body col-12 col-lg-12 col-md-11 col-sm-11  mx-auto">
                <AddCourseForm />
              </div>
            </div>
          </div>
        </div>
      </div>
      {!user && <Footer />}
    </div>
  );
};

export default Courses;
