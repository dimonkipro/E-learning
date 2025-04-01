import { useState } from "react";
import { loginUser } from "../redux/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import LoginLottie from "../assets/login.json";
import { toast } from "react-toastify";
import Lottie, {  } from "lottie-react";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(loginUser({ email, password })).unwrap(); // Get returned user data
      toast.success("Logged in successfully");
    } catch (error) {
      toast.error(error);
    }
  };
  return (
    <div className="container col-8 rounded-4 my-5 py-4  shadow">
      <h2 className="text-center">Se connecter</h2>
      <div className="col-12 d-flex justify-content-center">
          <Lottie
            animationData={LoginLottie}
            loop={true}
            style={{ width: "40%" }}
          />
      </div>
      <div className=" container col-10 text-center my-4">
        <form onSubmit={handleSubmit}>
          <div className="form-floating mb-3">
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

          <div className="form-floating mb-3">
            <input
              type="password"
              className="form-control rounded-5 focus-ring focus-ring-warning border"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />

            <label htmlFor="password" className="form-label">
              Mot de passe
            </label>
          </div>
          <div className="d-grid col-10 mx-auto my-4">
            <button
              type="submit"
              className="btn btn-warning rounded-5 p-2"
              disabled={isLoading}
            >
              {isLoading ? "Connexion en cours..." : "Se connecter"}
            </button>
          </div>
          <hr className="col-8 mx-auto my-4" />
          <Link className="small text-secondary" to="/forgot-password">
            Informations de compte oubliées ?
          </Link>
          <br />
          <Link className="small text-secondary" to="/signup">
            Créer un compte!
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Login;
