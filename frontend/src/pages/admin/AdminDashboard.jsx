import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { fetchInscriptions } from "../../redux/auth/enrollmentSlice";
import { fetchUsers } from "../../redux/auth/userSlice";
import { Link } from "react-router-dom";
import { fetchCourses } from "../../redux/auth/courseSlice";
import { toast } from "react-toastify";
import { updateUser } from "../../redux/auth/authSlice";
import CustomSpinner from "../../components/CustomSpinner";
import userImage from "../../assets/user.png";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { enrollments } = useSelector((state) => state.enrollments);
  const { list: users } = useSelector((state) => state.users);

  const [showProfilePanel, setShowProfilePanel] = useState(true);
  const [formData, setFormData] = useState({
    password: "",
    tel: "",
  });

  const { courses, loading, error } = useSelector((state) => state.courses);
  // const instructorCourses = courses.filter(
  //   (course) => course?.instructor?._id === user?._id
  // );

  useEffect(() => {
    dispatch(fetchCourses());
  }, [dispatch]);

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

  useEffect(() => {
    if (!users?.length) {
      dispatch(fetchUsers());
    }
    dispatch(fetchInscriptions());
  }, [dispatch, users?.length]);

  const totalEarnings = enrollments
    .filter((enrollment) => enrollment.status === "approved")
    .reduce((sum, enrollment) => {
      const price = Number(enrollment?.courseId?.price) || 0;
      return sum + price;
    }, 0);

  const verifiedUsers = users.reduce(
    (count, user) => (user.isVerified ? count + 1 : count),
    0
  );
  const pendingEnrollments = enrollments.reduce(
    (count, enrollment) =>
      enrollment.status === "pending" ? count + 1 : count,
    0
  );

  if (loading) return <CustomSpinner />;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="row col-11 mx-auto mb-4">
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
          <p className="text-secondary text-center">
            {user?.isVerified ? "Compte vérifié" : "Compte non vérifié"}
            <span className="text-danger">
              {user?.isVerified ? "" : " (Veuillez vérifier votre compte)"}
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
                  disabled={loading}
                >
                  {loading ? "Mise à jour..." : "Confirmer"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/*Cards */}
      {courses?.length > 0 && (
        <div
          className={`d-flex align-items-center ${
            showProfilePanel ? "col-md-9" : "col-md-12"
          }`}
        >
          <div className="row row-cols-1 row-cols-sm-2 g-4">
            {/* Gains */}
            <div className="col">
              <div
                className="card shadow h-100 py-2"
                style={{ borderLeft: " .25rem solid rgb(25, 135, 84)" }}
              >
                <div className="card-body text-center">
                  <div className="row no-gutters ">
                    <div className="col">
                      <div className="small font-weight-bold text-success text-uppercase mb-1">
                        Gains
                      </div>
                      <div className="h5 mb-0 fw-bold text-secondary">
                        {totalEarnings}
                      </div>
                    </div>
                    <div className="mt-2">
                      <i className="bi bi-currency-dollar h1 mb-0"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Link to="/admin/enrollments" className="text-decoration-none">
              <div
                className="card shadow h-100 py-2"
                style={{ borderLeft: " .25rem solid rgb(78, 115, 223)" }}
              >
                <div className="card-body text-center">
                  <div className="row no-gutters align-items-center">
                    <div className="col">
                      <div className="small font-weight-bold text-primary text-uppercase mb-1">
                        Inscriptions
                      </div>
                      <div className="h5 mb-0 fw-bold text-secondary">
                        {enrollments?.length}
                      </div>
                    </div>
                    <div className="col">
                      <div className="small font-weight-bold text-primary text-uppercase mb-1">
                        En attente
                      </div>
                      <div className="h5 mb-0 fw-bold text-secondary">
                        {pendingEnrollments}
                      </div>
                    </div>
                    <div className="mt-2">
                      <i className="bi bi-collection h1 mb-0"></i>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
            <Link to="/admin/users" className="text-decoration-none">
              <div
                className="card shadow h-100 py-2"
                style={{ borderLeft: " .25rem solid rgb(255, 193, 7) " }}
              >
                <div className="card-body text-center">
                  <div className="row  align-items-center">
                    <div className="col">
                      <div className="small font-weight-bold text-warning-emphasis text-uppercase mb-1">
                        Utilisateurs
                      </div>
                      <div className="h5 mb-0 fw-bold text-secondary">
                        {verifiedUsers}
                      </div>
                    </div>
                    <div className="col">
                      <div className="small font-weight-bold text-warning-emphasis text-uppercase mb-1">
                        Non vérifié
                      </div>
                      <div className="h5 mb-0 fw-bold text-secondary">
                        {users.length - verifiedUsers}
                      </div>
                    </div>
                    <div className="mt-2">
                      <i className="bi bi-people h1 mb-0"></i>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
            <Link to="/admin/courses" className="text-decoration-none">
              <div className="col">
                <div
                  className="card shadow h-100 py-2"
                  style={{ borderLeft: " .25rem solid rgb(92, 165, 234)" }}
                >
                  <div className="card-body text-center">
                    <div className="row no-gutters ">
                      <div className="col">
                        <div className="small font-weight-bold text-info-emphasis text-uppercase mb-1">
                          Formations
                        </div>
                        <div className="h5 mb-0 fw-bold text-secondary">
                          {courses?.length}
                        </div>
                      </div>
                      <div className="mt-2">
                        <i className="bi bi-bookshelf h1 mb-0"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      )}
    </div>

    // {/* Charts */}
    // {/* <div className="my-5">
    //   <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3">
    //     <div className="col">
    //       <div className="card shadow">
    //         <div className="card-header py-3">
    //           <h6 className="m-0 font-weight-bold text-primary">
    //             Area Chart
    //           </h6>
    //         </div>
    //         <div className="card-body text-center">
    //           <div className="chart-area">
    //             <canvas id="myAreaChart"></canvas>
    //           </div>
    //           <hr />
    //           Styling for the area chart can
    //         </div>
    //       </div>
    //     </div>
    //     <div className="col">
    //       <div className="card shadow">
    //         <div className="card-header py-3">
    //           <h6 className="m-0 font-weight-bold text-primary">Pie Chart</h6>
    //         </div>
    //         <div className="card-body text-center">
    //           <div className="chart-area">
    //             <canvas id="myAreaChart"></canvas>
    //           </div>
    //           <hr />
    //           Styling for the area chart can
    //         </div>
    //       </div>
    //     </div>
    //     <div className="col">
    //       <div className="card shadow">
    //         <div className="card-header py-3">
    //           <h6 className="m-0 font-weight-bold text-primary">Bar Chart</h6>
    //         </div>
    //         <div className="card-body text-center">
    //           <div className="chart-area">
    //             <canvas id="myAreaChart"></canvas>
    //           </div>
    //           <hr />
    //           Styling for the area chart can
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </div> */}
  );
};

export default AdminDashboard;
