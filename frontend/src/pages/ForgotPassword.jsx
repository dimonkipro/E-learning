import { useState } from "react";
import forgotImage from "../assets/forgotPassword.jpg";
import { useDispatch, useSelector } from "react-redux";
import Notifications from "../components/Notifications";
import { Link, useNavigate } from "react-router-dom";
import { forgotPassword } from "../redux/auth/authSlice";

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [notification, setNotification] = useState(null);
  const { isLoading } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(forgotPassword({ email })).unwrap();
      setNotification({ type: "success", message: "Email sent successfully" });
      navigate("/login");
    } catch (error) {
      setNotification({ type: "error", message: error });
    }
  };

  return (
    <div>
      <div className="container text-center col-8 rounded-4 my-5 py-4 shadow">
        <div className="col-8 mx-auto text-center">
          <h1>Mot de passe oublié ?</h1>
          <p>
            Nous l&apos;obtenons, des trucs comme ça se passe. Veuillez entrer
            votre e-mail, nous vous enverrons un lien pour réinitialiser votre
            mot de passe.
          </p>
        </div>
        <div>
          <div className="col-12 text-center">
            <img src={forgotImage} alt="..." style={{ width: "50%" }} />
          </div>
          <div className="col-10 mx-auto text-center my-4">
            <form onSubmit={handleSubmit}>
              <div className="form-floating mb-3 col-10 mx-auto">
                <input
                  type="email"
                  value={email}
                  name="email"
                  className="form-control rounded-5 focus-ring focus-ring-warning border"
                  id="email"
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  required
                  autoFocus
                />

                <label htmlFor="email" className="form-label">
                  E-mail
                </label>
              </div>
              <div className="d-grid col-6 mx-auto my-4">
                <button
                  type="submit"
                  className="btn btn-warning rounded-5 p-2"
                  disabled={isLoading}
                >
                  {isLoading ? "Envoie en cours..." : "Envoyer"}
                </button>
              </div>
            </form>
            <hr className="col-8 mx-auto my-4" />

            <Link className="small text-secondary" to="/login">
              Vous vous en souvenez ?
            </Link>
          </div>
        </div>
      </div>
      {notification && (
        <Notifications
          type={notification.type}
          message={notification.message}
        />
      )}
    </div>
  );
};

export default ForgotPassword;
