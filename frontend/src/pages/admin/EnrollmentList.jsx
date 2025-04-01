import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  fetchInscriptions,
  updateInscriptionStatus,
} from "../../redux/auth/enrollmentSlice";
import { Link } from "react-router-dom";

const EnrollmentList = () => {
  const dispatch = useDispatch();
  const [showPending, setShowPending] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedMotivation, setSelectedMotivation] = useState("");

  const { enrollments, loading } = useSelector((state) => state.enrollments);

  useEffect(() => {
    dispatch(fetchInscriptions());
  }, [dispatch]);

  const handleStatusChange = (id, status) => {
    dispatch(updateInscriptionStatus({ id, status }));
  };

  const filteredEnrollments = showPending
    ? enrollments.filter((enr) => enr.status === "pending")
    : enrollments;

  return (
    <div className="col-11 mx-auto">
      {loading && (
        <p className="position-absolute top-50 start-50">Loading...</p>
      )}
      <div className=" pb-4">
        <h2>Liste des inscriptions</h2>
        <button
          className="btn btn-secondary rounded-5 p-2"
          onClick={() => setShowPending(!showPending)}
        >
          {showPending ? "Afficher tout" : "Inscriptions non validé"}
        </button>
      </div>
      <div className="table-responsive rounded">
        <table className=" table table-hover align-middle table-borderless table-striped">
          <thead className="table-light position-sticky text-center">
            <tr>
              <th>Nom (E-mail)</th>
              <th>Cin</th>
              <th>N° telephone</th>
              <th>Paiement</th>
              <th>Formation</th>
              <th>Motivation</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          {filteredEnrollments.length > 0 ? (
            <tbody className="text-center">
              {filteredEnrollments.map((enrollment) => (
                <tr key={enrollment._id}>
                  <td>{`${enrollment.formData.name} (${enrollment.formData.email})`}</td>
                  <td>{enrollment.formData.cin}</td>
                  <td>{enrollment.formData.tel}</td>
                  <td>{enrollment.formData.paymentMethod}</td>
                  <td>{enrollment.courseId.title}</td>
                  {enrollment.formData.motivation.length > 1 ? (
                    <td>
                      {/* Button to open the modal */}
                      <Link
                        className="link-secondary link-offset-2 link-underline-opacity-25
                 link-underline-opacity-100-hover"
                        onClick={() => {
                          setSelectedMotivation(
                            enrollment.formData?.motivation
                          );
                          setShowModal(true);
                        }}
                      >
                        Voir plus
                      </Link>
                    </td>
                  ) : (
                    <td>Null</td>
                  )}

                  <td>
                    <strong
                      className={
                        enrollment.status === "approved"
                          ? "text-success"
                          : enrollment.status === "rejected"
                          ? "text-danger"
                          : "text-warning"
                      }
                    >
                      {enrollment.status}
                    </strong>
                  </td>
                  <td>
                    <select
                      className="form-select form-select-sm focus-ring focus-ring-warning border"
                      value={enrollment.status}
                      onChange={(e) =>
                        handleStatusChange(enrollment._id, e.target.value)
                      }
                    >
                      <option value="approved">Accepté</option>
                      <option value="pending">En attente</option>
                      <option value="rejected">Réfusé</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          ) : null}
        </table>

        {/* Modal for Motivation Letter */}
        <div
          className={`modal ${showModal ? "show" : ""}`}
          style={{ display: showModal ? "block" : "none" }}
          onClick={(e) => {
            if (e.target.classList.contains("modal")) {
              setShowModal(false);
            }
          }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="motivation">
                  Lettre de motivation
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>

              <div className="modal-body">
                <p>{selectedMotivation}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnrollmentList;
