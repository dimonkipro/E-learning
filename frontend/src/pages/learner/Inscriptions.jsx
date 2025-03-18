import { useDispatch, useSelector } from "react-redux";
import { fetchUserInscriptions } from "../../redux/auth/enrollmentSlice";
import { useEffect, useState } from "react";

const Inscriptions = () => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);

  const { userEnrollments, loading } = useSelector(
    (state) => state.enrollments
  );

  const coursesPerPage = 4;
  const totalPages = Math.ceil(userEnrollments.length / coursesPerPage);
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentEnrollments = userEnrollments.slice(
    indexOfFirstCourse,
    indexOfLastCourse
  );

  useEffect(() => {
    dispatch(fetchUserInscriptions());
  }, [dispatch]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}/${String(date.getDate()).padStart(
      2,
      "0"
    )}/${String(date.getMonth() + 1).padStart(2, "0")}`;
  };

  // Handle pagination actions
  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="container">
      <h2>Mes formations</h2>
      {loading ? (
        <p>Loading...</p>
      ) : userEnrollments.length > 0 ? (
        <>
          {/* Upper Pagination */}
          <nav aria-label="Courses" className="d-flex justify-content-end">
            <ul className="pagination m-0">
              {/* Previous Page */}
              <li
                className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
              >
                <button
                  className="page-link pagination"
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  aria-label="Previous"
                  style={{
                    backgroundColor: "#fff",
                    color: "black",
                    boxShadow: "0 0 0 0",
                  }}
                >
                  <span aria-hidden="true">&laquo;</span>
                </button>
              </li>

              {/* Pages Number */}
              {Array.from({ length: totalPages }, (_, index) => {
                const pageNumber = index + 1;
                return (
                  <li
                    key={pageNumber}
                    className={`page-item ${
                      currentPage === pageNumber ? "active" : ""
                    } custom-pagination`}
                  >
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(pageNumber)}
                      style={{
                        backgroundColor: "#fff",
                        color: "black",
                        boxShadow: "0 0 0 0",
                      }}
                    >
                      {pageNumber}
                    </button>
                  </li>
                );
              })}

              {/* Next Page */}
              <li
                className={`page-item ${
                  currentPage === totalPages ? "disabled" : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  aria-label="Next"
                  style={{
                    backgroundColor: "#fff",
                    color: "black",
                    boxShadow: "0 0 0 0",
                  }}
                >
                  <span aria-hidden="true">&raquo;</span>
                </button>
              </li>
            </ul>
          </nav>

          {/* Cards */}
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 my-3">
            {currentEnrollments.map((inscription) => (
              //   Card
              <div
                className="col"
                style={{ top: "15vh" }}
                key={inscription._id}
              >
                <div className="card text-center shadow">
                  <div className="d-flex position-relative">
                    <span
                      className="position-absolute top-0 start-0 badge rounded-pill 
                          text-bg-secondary m-2 shadow opacity-75 p-2"
                    >
                      {inscription.courseId.category.name}
                    </span>
                    <img
                      src={`http://localhost:5000/${inscription.courseId.image.replace(
                        /\\/g,
                        "/"
                      )}`}
                      className="card-img-top object-fit-cover"
                      alt="..."
                    />
                  </div>

                  <div className="card-body">
                    <p className="card-title fw-bold">
                      {inscription.courseId.title}
                    </p>

                    <p className="card-text">
                      {inscription.courseId.description}
                    </p>

                    <div className="d-flex justify-content-between align-items-center flex-wrap">
                      <div>
                        <span className="badge bg-primary-subtle">
                          Inscrit le
                        </span>
                        <p className="card-text">
                          {formatDate(inscription.createdAt)}
                        </p>
                      </div>
                      {inscription.status == "approved" ? (
                        <div>
                          <span className="badge bg-success">Approuver le</span>
                          <p className="card-text">
                            {formatDate(inscription.updatedAt)}
                          </p>
                        </div>
                      ) : inscription.status == "rejected" ? (
                        <div>
                          <span className="badge bg-danger">Réfuser le</span>
                          <p className="card-text">
                            {formatDate(inscription.updatedAt)}
                          </p>
                        </div>
                      ) : (
                        <span className="badge bg-warning">En attente</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Lower Pagination */}
          <nav aria-label="Courses" className="d-flex justify-content-end">
            <ul className="pagination m-0">
              {/* Previous Page */}
              <li
                className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
              >
                <button
                  className="page-link pagination"
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  aria-label="Previous"
                  style={{
                    backgroundColor: "#fff",
                    color: "black",
                    boxShadow: "0 0 0 0",
                  }}
                >
                  <span aria-hidden="true">&laquo;</span>
                </button>
              </li>

              {/* Pages Number */}
              {Array.from({ length: totalPages }, (_, index) => {
                const pageNumber = index + 1;
                return (
                  <li
                    key={pageNumber}
                    className={`page-item ${
                      currentPage === pageNumber ? "active" : ""
                    } custom-pagination`}
                  >
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(pageNumber)}
                      style={{
                        backgroundColor: "#fff",
                        color: "black",
                        boxShadow: "0 0 0 0",
                      }}
                    >
                      {pageNumber}
                    </button>
                  </li>
                );
              })}

              {/* Next Page */}
              <li
                className={`page-item ${
                  currentPage === totalPages ? "disabled" : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  aria-label="Next"
                  style={{
                    backgroundColor: "#fff",
                    color: "black",
                    boxShadow: "0 0 0 0",
                  }}
                >
                  <span aria-hidden="true">&raquo;</span>
                </button>
              </li>
            </ul>
          </nav>
        </>
      ) : (
        <p>No courses found</p>
      )}
    </div>
  );
};

export default Inscriptions;
