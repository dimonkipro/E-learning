import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useSearchParams } from "react-router-dom";
import { fetchCourses } from "../redux/auth/courseSlice";
import AddCourseForm from "./AddCourseForm";
import Pagination from "./Pagination";

const Courses = () => {
  const dispatch = useDispatch();

  const { courses } = useSelector((state) => state.courses);
  const { user } = useSelector((state) => state.auth);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showOffcanvas, setShowOffcanvas] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = parseInt(searchParams.get("page")) || 1;

  // Get unique categories from courses
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

  const coursesPerPage = 6;
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentcourses = filteredCourses.slice(
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
    <div className="row col-12 mx-auto">
      {/* Categories Column */}
      <div className="d-none d-lg-block col-lg-2 mb-4">
        <h4 className="mb-3">Categories</h4>
        <div className="list-group shadow">
          <Link
            onClick={() => setSelectedCategory(null)}
            className={`list-group-item list-group-item-warning d-flex justify-content-between align-items-center text-break ${
              !selectedCategory ? "active" : ""
            }`}
          >
            All Categories{" "}
            <span className="badge bg-secondary rounded-pill ms-1">
              {courses.length}
            </span>
          </Link>
          {categories.map((category) => (
            <Link
              key={category._id}
              onClick={() => handleCategoryChange(category._id)}
              className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center text-break${
                selectedCategory === category._id ? "active" : ""
              }`}
            >
              {category.name}
              <span className="badge bg-secondary rounded-pill ms-1">
                {courses.filter((c) => c.category._id === category._id).length}
              </span>
            </Link>
          ))}
        </div>

        {/* Button to open AddCourse modal */}
        {user?.role === "admin" ? (
          <>
            <div className="m-3">
              <Link
                className="link-secondary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover"
                onClick={() => setShowModal(true)}
              >
                Ajouter une formation
              </Link>
            </div>
          </>
        ) : null}
      </div>

      {/* Modal for Adding a Course */}
      <div
        className={`modal ${showModal ? "show" : ""}`}
        style={{ display: showModal ? "block" : "none" }}
        aria-labelledby="courseModal"
        aria-hidden={!showModal}
      >
        <div className="modal-dialog modal-lg modal-fullscreen-lg-down mx-auto">
          <div className="modal-content">
            <div className="modal-header col-11">
              <h5 className="modal-title" id="courseModal">
                Ajouter une nouvelle formation
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowModal(false)}
              ></button>
            </div>
            <div className="modal-body col-11">
              <AddCourseForm />
            </div>
          </div>
        </div>
      </div>

      {/* Courses Column */}
      <div className="col-12 col-lg-10">
        <div className="d-flex justify-content-between flex-wrap">
          <h3 className="mb-4">
            {selectedCategory
              ? categories.find((c) => c._id === selectedCategory)?.name
              : "Tout les Formations"}
          </h3>

          {/* Mobile-only toggle button */}
          <button
            className="d-lg-none btn btn-warning mb-3"
            onClick={() => setShowOffcanvas(true)}
          >
            Afficher categories
          </button>

          {/* Mobile Offcanvas */}
          <div
            className={`offcanvas offcanvas-start ${
              showOffcanvas ? "show" : ""
            }`}
            tabIndex="-1"
            id="offcanvasCategories"
            aria-labelledby="offcanvasCategoriesLabel"
            data-bs-backdrop="true"
            style={{ visibility: showOffcanvas ? "visible" : "hidden" }}
          >
            <div className="offcanvas-header">
              <h5 className="offcanvas-title" id="offcanvasCategoriesLabel">
                Categories
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowOffcanvas(false)}
                aria-label="Close"
              ></button>
            </div>
            <div className="offcanvas-body">
              <div className="list-group shadow">
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
                      setSelectedCategory(category._id);
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
              {user?.role === "admin" && (
                <div className="mt-3">
                  <Link
                    className="link-secondary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover"
                    onClick={() => {
                      setShowModal(true);
                      setShowOffcanvas(false);
                    }}
                  >
                    Ajouter une formation
                  </Link>
                </div>
              )}
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
        <div className="row row-cols-2 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
          {/* Card */}
          {currentcourses.map((course) => (
            <div className="col" key={course._id}>
              <div className="card h-100 text-center shadow">
                {/* <div className="card h-100 text-center shadow"> */}
                <Link
                  to={`/courses/${course._id}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
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
                      className="card-img-top w-100 h-100 object-fit-cover"
                      alt="..."
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
                {user?.role == "admin" && (
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
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Lower Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default Courses;
