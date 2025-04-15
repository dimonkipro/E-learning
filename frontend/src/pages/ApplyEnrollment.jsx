import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { createInscription } from "../redux/auth/enrollmentSlice";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { clearCurrentCourse, fetchCourseById } from "../redux/auth/courseSlice";
import Footer from "../components/Footer";
import CustomSpinner from "../components/CustomSpinner";

const ApplyEnrollment = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { courseId } = useParams();

  const { user } = useSelector((state) => state.auth);
  const { loading } = useSelector((state) => state.enrollments);
  const { currentCourse, loading: isLoading } = useSelector((state) => state.courses);

  useEffect(() => {
    dispatch(fetchCourseById(courseId));
    return () => {
      dispatch(clearCurrentCourse());
    };
  }, [dispatch, courseId]);

  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    cin: user.cin,
    tel: user.tel || "",
    paymentMethod: "cash",
    motivation: "",
  });

  // Handle change for fields that are editable
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createInscription({ courseId, formData }))
      .unwrap()
      .then(() => {
        navigate("/learner/enrollment/success");
      });
  };

  const getLevelBadgeClass = (level) => {
    switch (level) {
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
  if (!user?.isEmailVerified) return <Navigate to={"/verify-email"} />;
    if (isLoading) return <CustomSpinner />;

  return (
    <div className="col-12">
      {/* Hero */}
      <div className="col-11 mx-auto text-white shadow rounded-5">
        <div className="col-xl-9 col-md-9 mb-5">
          <div className="p-3">
            <span className="d-inline-block bg-light small rounded-3 px-3 py-2 text-dark">
              Certificat obtenue à la fin de la formation 🤩
            </span>

            <p className="m-3 lh-base display-2" style={{ fontWeight: "400" }}>
              {currentCourse?.title}
            </p>
            <h4 className="mx-5 fw-light">{currentCourse?.description}</h4>
            <div className="d-flex flex-wrap d-block d-md-none mt-4">
              <span
                className={`badge ${getLevelBadgeClass(
                  currentCourse?.level
                )} rounded-pill p-2 me-2 mt-3`}
              >
                Niveau: {currentCourse?.level}
              </span>
              <span className="badge bg-secondary rounded-pill p-2 me-2 mt-3">
                Formateur: {currentCourse?.instructor?.name}
              </span>
              <span className="badge bg-secondary rounded-pill p-2 me-2 mt-3">
                Categorie: {currentCourse?.category?.name}
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

      <div className="row container mx-auto mb-5">
        {/* Apply Form */}
        <div className="container col-10 col-md-8">
          <h1 className=" text-center">Demande d&apos;inscription</h1>
          <form onSubmit={handleSubmit}>
            <div className="row g-2">
              {/* Name Field */}
              <div className="col-md mb-3">
                <div className="col-md form-floating">
                  <input
                    type="text"
                    className="form-control rounded-5"
                    name="name"
                    value={formData.name}
                    disabled
                  />
                  <label className="form-label">Nom complet</label>
                </div>
              </div>

              {/* CIN Field */}
              <div className="col-md mb-3">
                <div className="col-md form-floating">
                  <input
                    type="text"
                    className="form-control rounded-5"
                    name="cin"
                    value={user?.cin}
                    disabled
                  />
                  <label className="form-label">N° carte d&apos;identité</label>
                </div>
              </div>
            </div>

            {/* Email Field */}
            <div className="form-floating mb-3">
              <input
                type="email"
                className="form-control rounded-5"
                name="email"
                value={formData.email}
                disabled
              />
              <label className="form-label">Email</label>
            </div>

            <div className="row g-2">
              {/* Phone Field */}
              <div className="col-md mb-3">
                <div className="form-floating">
                  <input
                    type="text"
                    className="form-control rounded-5 focus-ring focus-ring-warning border"
                    name="tel"
                    value={formData.tel}
                    onChange={handleChange}
                    required
                  />
                  <label className="form-label">N° téléphone</label>
                </div>
              </div>

              {/* Payment Field */}
              <div className="col-md mb-3">
                <div className="form-floating">
                  <select
                    name="paymentMethod"
                    className="form-select focus-ring focus-ring-warning border rounded-5"
                    value={formData.paymentMethod}
                    onChange={handleChange}
                  >
                    <option value="cash">Espèces</option>
                    <option value="Virement bancaire">Virement bancaire</option>
                  </select>
                  <label className="form-label">Paiement</label>
                </div>
              </div>
            </div>

            {/* Motivation Field */}
            <div className="form-floating mb-3">
              <textarea
                value={formData.motivation}
                id="motivation"
                onChange={(e) =>
                  setFormData({ ...formData, motivation: e.target.value })
                }
                className="form-control  border rounded focus-ring focus-ring-warning border"
                autoFocus
              />
              <label htmlFor="motivation" className="form-label">
                Lettre de motivation
              </label>
            </div>

            {/* Button */}
            <div className="d-grid col-10 mx-auto my-4">
              <button
                type="submit"
                className="btn btn-warning rounded-5 p-2"
                disabled={loading || !user.isVerified}
              >
                {loading ? "Envoi en cours..." : "Envoyer la demande"}
              </button>
            </div>
          </form>
        </div>
        {/* Right Side Fixed Card */}
        <div className="col-4 mx-auto d-none d-md-block d-lg-block">
          <div
            className="card text-center position-sticky"
            style={{ top: "5vh" }}
          >
            <div className="d-flex position-relative">
              <span
                className="position-absolute top-0 start-0 badge rounded-pill 
                        text-bg-secondary m-2 shadow opacity-75 p-2"
              >
                {currentCourse?.category.name}
              </span>
              <img
                src={`http://localhost:5000/${currentCourse?.image.replace(
                  /\\/g,
                  "/"
                )}`}
                className="card-img-top object-fit-cover"
                alt="..."
              />
              <p className="card-text">
                <span
                  className={`badge ${getLevelBadgeClass(
                    currentCourse?.level
                  )} text-white position-absolute bottom-0 end-0 m-2 shadow`}
                >
                  {currentCourse?.level}
                </span>
              </p>
            </div>

            <div className="card-body">
              <p className="card-title fw-bold">{currentCourse?.title}</p>

              <p className="card-text">{currentCourse?.description}</p>

              <div className="d-flex justify-content-between">
                <p className="card-text bg-body-secondary rounded-4 p-1 m-0">
                  {currentCourse?.price} TND
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ApplyEnrollment;
