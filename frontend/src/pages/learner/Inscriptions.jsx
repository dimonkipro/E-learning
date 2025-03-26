import { useDispatch, useSelector } from "react-redux";
import { fetchUserInscriptions } from "../../redux/auth/enrollmentSlice";
import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Pagination from "../../components/Pagination";

const Inscriptions = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page")) || 1;

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
  const handlePageChange = (pageNumber) => {
    setSearchParams({ page: pageNumber });
  };

  return (
    <div className="container mb-4">
      {loading ? (
        <p>Loading...</p>
      ) : userEnrollments.length > 0 ? (
        <>
          {/* Upper Pagination */}
          <div className="d-flex justify-content-between align-items-center flex-wrap mb-4">
            <h2>Mes formations</h2>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>

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
                  <Link
                    to={`/learner/course/${inscription.courseId._id}/${inscription._id}`}
                  >
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
                  </Link>
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
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      ) : (
        <p>No courses found</p>
      )}
    </div>
  );
};

export default Inscriptions;
