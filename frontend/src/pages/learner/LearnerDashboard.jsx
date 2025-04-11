import { useState } from "react";
import { useSelector } from "react-redux";
import userImage from "../../assets/user.png";

const LearnerDashboard = () => {
  const [formData, setFormData] = useState({
    password: "",
    tel: "",
  });

  const { user } = useSelector((state) => state.auth);
  const { userEnrollments, loading } = useSelector(
    (state) => state.enrollments
  );

  const handleChange = (e) => {
    e.preventDefault();
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const totalEnrollments =
    userEnrollments?.map((enrollment) => enrollment).length || 0;

  const totalApproved =
    userEnrollments?.filter((enrollment) => enrollment?.status === "approved")
      .length || 0;

  const totalPending =
    userEnrollments?.filter((enrollment) => enrollment?.status === "pending")
      .length || 0;

  const totalRejected =
    userEnrollments?.filter((enrollment) => enrollment?.status === "rejected")
      .length || 0;

  return (
    <div className="col-11 mx-auto">
      <h2 className="mb-5 text-center">Bienvenue, {user?.name} ^_^</h2>
      <div className="col-12 mb-4 d-flex">
        <div className="col-6 d-flex align-items-center flex-column">
          <img src={userImage} alt="" className="col-6" />
          <button className="btn btn-outline-secondary">
            <i className="bi bi-upload"> Changer</i>
          </button>
        </div>
        <div className="col-6">
          <h2 className="text-center text-decoration-underline text-white fw-light">
            Coordonnées
          </h2>
          <h3 className="text-secondary">E-mail</h3>
          <h4 className="text-center  fw-light">{user?.email}</h4>

          <form>
            <div className="col mx-auto my-3">
              <div className="row col-12 mb-3">
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
                    Password
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
                  className="btn btn-primary rounded p-2"
                  // disabled={isLoading}
                >
                  Confirmer
                  {/* {isLoading ? "Connexion en cours..." : "Se connecter"} */}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Enrollments Cards */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        userEnrollments?.length > 0 && (
          <div>
            <h2>Inscriptions</h2>
            <div className="container col-11 mx-auto row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4">
              <div className="col my-3">
                <div
                  className="card  py-2"
                  style={{ borderLeft: " 10px solid rgb(42, 144, 167)" }}
                >
                  <div className="card-body">
                    <div className="col d-flex align-items-center justify-content-between text-info-emphasis text-uppercase">
                      Mes inscriptions{" "}
                      <div className="h3 mb-0 fw-bold ">{totalEnrollments}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col my-3">
                <div
                  className="card py-2"
                  style={{ borderLeft: " 10px solid rgb(25, 135, 84)" }}
                >
                  <div className="card-body">
                    <div className="col d-flex align-items-center justify-content-between text-success text-uppercase">
                      Inscriptions acceptée
                      <div className="h3 mb-0 fw-bold ">{totalApproved}</div>
                    </div>
                  </div>
                </div>
              </div>

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
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default LearnerDashboard;
