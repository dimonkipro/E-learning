import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/auth/authSlice";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Notifications from "./Notifications";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state) => state.auth);
  const [notification, setNotification] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(loginUser({ email, password })).unwrap();
      // Set notification to trigger the toast
      setNotification({ type: "success", message: "Logged in successfully" });
      // Redirect to the profile page after login
      navigate("/profile");
    } catch (error) {
      setNotification({ type: "error", message: error });
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>
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

export default LoginForm;
