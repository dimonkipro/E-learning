import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signupUser } from "../redux/auth/authSlice";
import { Link, useNavigate } from "react-router-dom";
import Notifications from "../components/Notifications";
import registerImage from "../assets/register.jpg";

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading } = useSelector((state) => state.auth);
  const [notification, setNotification] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    cin: "",
    tel: "",
  });

  const handleChange = (e) => {
    e.preventDefault();
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setNotification({
        type: "error",
        message: "Passwords do not match!",
      });
      return;
    }
    try {
      const res = await dispatch(signupUser(formData));
      if (res.type === "auth/signupUser/fulfilled") {
        setNotification({
          type: "success",
          message: "Account created successfully",
        });
        navigate("/verify-email");
      } else {
        setNotification({
          type: "error",
          message: res.payload || "Signup failed",
        });
      }
    } catch (error) {
      setNotification({
        type: "error",
        message: error.message || "An unexpected error occurred",
      });
    }
  };

  return (
    <div className="container col-8 rounded-4 p-4 position-absolute top-50 start-50 translate-middle shadow">
      <div className="row">
        <div className="col-5 d-flex align-items-center">
          <img src={registerImage} alt="..." />
        </div>
        <div className="col-7 text-center">
          <h2>Créer un compte </h2>
          <p>C&apos;est simple et rapide.</p>
          <form onSubmit={handleSubmit}>
            <div className="row g-2 mb-3">
              <div className="col-md">
                <div className="form-floating">
                  <input
                    type="text"
                    className="form-control rounded-5"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="nom et prénom"
                    required
                    autoFocus
                  />
                  <label htmlFor="name" className="form-label">
                    Nom complet
                  </label>
                </div>
              </div>
              <div className="col-md">
                <div className="form-floating">
                  <input
                    type="text"
                    className="form-control rounded-5"
                    id="cin"
                    name="cin"
                    value={formData.cin}
                    onChange={handleChange}
                    placeholder="N° carte identité"
                    required
                  />
                  <label htmlFor="cin" className="form-label">
                    CIN
                  </label>
                </div>
              </div>
            </div>

            <div className="form-floating mb-3">
              <input
                type="email"
                className="form-control rounded-5"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Tapez votre e-mail"
                aria-describedby="emailHelp"
                required
              />
              <label htmlFor="email" className="form-label">
                E-mail
              </label>
              <div id="emailHelp" className="form-text">
                We&apos;ll never share your email with anyone else (❁´◡`❁) .
              </div>
            </div>
            <div className="form-floating mb-3">
              <input
                type="text"
                className="form-control rounded-5"
                id="tel"
                name="tel"
                value={formData.tel}
                onChange={handleChange}
                placeholder="Numero de telephone"
                required
              />
              <label htmlFor="tel" className="form-label">
                Numero de telephone
              </label>
            </div>
            <div className="row g-2 mb-3">
              <div className="col-md">
                <div className="form-floating">
                  <input
                    type="password"
                    className="form-control rounded-5"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Mot de passe"
                    required
                  />
                  <label htmlFor="password" className="form-label">
                    Mot de passe
                  </label>
                </div>
              </div>
              <div className="col-md">
                <div className="form-floating">
                  <input
                    type="password"
                    className="form-control rounded-5"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirmer mot de passe"
                    required
                  />
                  <label htmlFor="confirmPassword" className="form-label">
                    Confirmation mot de passe
                  </label>
                </div>
              </div>
            </div>
            <div className="d-grid col-10 mx-auto my-4">
              <button
                type="submit"
                className="btn btn-warning rounded-5 p-2"
                disabled={isLoading}
              >
                {isLoading ? "Inscription en cours..." : "S'inscrire"}
              </button>
            </div>
          </form>
          <hr className="col-8 mx-auto my-4" />

          <Link className="small text-secondary" to="/login">
            Vous avez déjà un compte ?
          </Link>
        </div>
      </div>
      {/* Render the notification component when set */}
      {notification && (
        <Notifications
          type={notification.type}
          message={notification.message}
        />
      )}
    </div>
  );
};

export default Signup;
