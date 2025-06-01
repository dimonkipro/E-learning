import { useDispatch, useSelector } from "react-redux";
import { fetchUserInscriptions } from "../../redux/auth/enrollmentSlice";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Pagination from "../../components/Pagination";
import CustomSpinner from "../../components/CustomSpinner";
import ErrorPage from "../../components/ErrorPage";

const Inscriptions = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get("page")) || 1;

  const [status, setStatus] = useState("all");
  const { user } = useSelector((state) => state.auth);
  const { userEnrollments, loading, error } = useSelector(
    (state) => state.enrollments
  );

  let finalUserEnrollments = userEnrollments;
  if (user && status) {
    finalUserEnrollments = userEnrollments.filter(
      (enrollment) => enrollment?.status === status || status === "all"
    );
  }

  const coursesPerPage = 4;
  const totalPages = Math.ceil(finalUserEnrollments.length / coursesPerPage);
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentEnrollments = finalUserEnrollments.slice(
    indexOfFirstCourse,
    indexOfLastCourse
  );

  useEffect(() => {
    dispatch(fetchUserInscriptions());
  }, [dispatch]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${String(date.getDate()).padStart(2, "0")}/${String(
      date.getMonth() + 1
    ).padStart(2, "0")}/${date.getFullYear()}`;
  };

  // Handle pagination actions
  const handlePageChange = (pageNumber) => {
    setSearchParams({ page: pageNumber });
  };

  const handleStatusChange = (status) => {
    setStatus(status);
    setSearchParams({ page: 1 });
  };

  if (loading) return <CustomSpinner />;
  if (error) return <div>Error: {error}</div>;
  return (
    <div className="col-11 mx-auto">
      {userEnrollments.length > 0 ? (
        <>
          {/* Upper Pagination */}
          <div className="d-flex justify-content-between align-items-center flex-wrap mb-4">
            <div className="d-flex justify-content-between align-items-center gap-4 flex-wrap">
              <h2>Mes inscriptions</h2>

              <select
                className="form-select form-select-sm col"
                value={status}
                onChange={(e) => handleStatusChange(e.target.value)}
              >
                <option value="all">Tout</option>
                <option value="approved">Approuvé</option>
                <option value="pending">En attente</option>
                <option value="rejected">Rejeté</option>
              </select>
            </div>
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
                        {inscription.courseId.category?.name}
                      </span>
                      <img
                        src={`http://localhost:5000/${inscription.courseId.image?.replace(
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
        <ErrorPage emojis="😢" text={"Pas d'inscriptions"} />
      )}
    </div>
  );
};

export default Inscriptions;
