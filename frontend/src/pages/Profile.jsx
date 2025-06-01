import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import userImage from "../assets/user.png";
import CustomSpinner from "../components/CustomSpinner";
import { Link } from "react-router";
import { updateUser } from "../redux/auth/authSlice";
import { toast } from "react-toastify";
import { fetchUserInscriptions } from "../redux/auth/enrollmentSlice";

const LearnerDashboard = () => {
  const dispatch = useDispatch();

  const [showProfilePanel, setShowProfilePanel] = useState(true);
  const [formData, setFormData] = useState({
    password: "",
    tel: "",
  });

  const { user, isLoading } = useSelector((state) => state.auth);
  const { userEnrollments, loading, error } = useSelector(
    (state) => state.enrollments
  );
  useEffect(() => {
    if (user?.isVerified) {
      dispatch(fetchUserInscriptions());
    }
  }, [dispatch, user?.isVerified]);
  const handleChange = (e) => {
    e.preventDefault();
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateUser({ id: user?._id, ...formData }))
      .unwrap()
      .then(() => {
        toast.success("Informations mises à jour avec succès");
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  const totalEnrollments =
    userEnrollments?.map((enrollment) => enrollment).length || 0;

  const totalPending =
    userEnrollments?.filter((enrollment) => enrollment?.status === "pending")
      .length || 0;

  const totalRejected =
    userEnrollments?.filter((enrollment) => enrollment?.status === "rejected")
      .length || 0;

  if (loading) return <CustomSpinner />;
  if (!user?.isEmailVerified) {
    return (
      <div className="text-center mt-5">
        <h2>
          Veuillez vérifier votre email pour accéder à votre tableau de bord.
        </h2>
        <Link to={"/verify-email"} className="btn btn-primary mt-3">
          Vérifier l&apos;email
        </Link>
      </div>
    );
  }
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      {!user?.isVerified && (
        <div
          className="alert alert-warning alert-dismissible fade show"
          role="alert"
        >
          <strong>Utilisateur non verifié!</strong> Vous devriez attendre
          l&apos;approbation de l&apos;administrateur.
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="alert"
            aria-label="Close"
          ></button>
        </div>
      )}
      <div className="row col-11 mx-auto">
        <h2 className=" text-center">Bienvenue, {user?.name} ^_^</h2>
        {/* Show Profile Panel Button */}
        <div
          className="d-flex justify-content-start position-sticky top me-1 mb-2"
          style={{ top: "50px" }}
        >
          <i
            className="bi bi-person-vcard fs-4 cursor-pointer p-2 rounded-pill text-bg-secondary"
            style={{
              cursor: "pointer",
              zIndex: 1000,
              transition: "all 0.3s ease",
            }}
            onClick={() => setShowProfilePanel(!showProfilePanel)}
          />
        </div>
        {/* Profile Panel  */}
        <div
          className={`mb-4 flex-column ${
            showProfilePanel ? "d-flex col-md-3" : "d-none"
          }`}
        >
          <div className="d-flex align-items-center flex-column">
            <img src={userImage} alt="" className="col-6" />
            <h5 className="text-center mt-2">{user?.name}</h5>
            <p className="text-secondary text-center">{user?.role}</p>
            <p className="text-center">
              {!user.isVerified
                ? "Utilisateur non verifié"
                : "Utilisateur verifié"}
              <br />
              <span className="text-danger">
                {user?.isVerified ? "" : " (En attente de vérification)"}
              </span>
            </p>
          </div>
          <div>
            <form>
              <div className="">
                <div className="mb-3">
                  <div className="col-md">
                    <label className="text-secondary">E-mail</label>
                    <h6 className="text-center ">{user?.email}</h6>
                  </div>
                  <div className="col-md">
                    <label htmlFor="Tel" className="form-label">
                      Numéro de téléphone
                    </label>
                    <input
                      type="text"
                      className="form-control rounded-4"
                      id="Tel"
                      name="tel"
                      value={user?.tel}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-md">
                    <label htmlFor="Password" className="form-label">
                      Nouveau mot de passe
                    </label>
                    <input
                      type="password"
                      className="form-control rounded-4"
                      id="Password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="d-grid col-8 mx-auto my-4">
                  <button
                    type="submit"
                    className="btn btn-warning rounded p-2"
                    onClick={handleSubmit}
                    disabled={isLoading}
                  >
                    {isLoading ? "Mise à jour..." : "Confirmer"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Enrollments Cards */}
        {user?.isVerified && userEnrollments && (
          <div className={showProfilePanel ? "col-md-9" : "col-md-12"}>
            <h2>Mes inscriptions</h2>
            <div className="container col-11 mx-auto row row-cols-1 row-cols-sm-2 ">
              <Link to={"/my-courses"} className="text-decoration-none">
                <div className="col my-3">
                  <div
                    className="card  py-2"
                    style={{ borderLeft: " 10px solid rgb(42, 144, 167)" }}
                  >
                    <div className="card-body">
                      <div className="col d-flex align-items-center justify-content-between text-info-emphasis text-uppercase">
                        Mes inscriptions{" "}
                        <div className="h3 mb-0 fw-bold ">
                          {totalEnrollments}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
              <Link to={"/my-courses"} className="text-decoration-none">
                <div className="col my-3">
                  <div
                    className="card py-2"
                    style={{ borderLeft: " 10px solid rgb(255, 193, 7) " }}
                  >
                    <div className="card-body">
                      <div className="col d-flex align-items-center justify-content-between text-warning-emphasis text-uppercase">
                        Inscription en attente
                        <div className="h3 mb-0 fw-bold ">{totalPending}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
              <Link to={"/my-courses"} className="text-decoration-none">
                <div className="col my-3">
                  <div
                    className="card py-2"
                    style={{ borderLeft: " 10px solid rgb(220, 53, 69)" }}
                  >
                    <div className="card-body">
                      <div className="col d-flex align-items-center justify-content-between text-danger-emphasis text-uppercase">
                        Inscription rejetée
                        <div className="h3 mb-0 fw-bold ">{totalRejected}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default LearnerDashboard;
