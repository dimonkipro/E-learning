import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signupUser } from "../redux/auth/authSlice";
import { useNavigate } from "react-router-dom";
import Notifications from "../components/Notifications";

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading} = useSelector((state) => state.auth);
  const [notification, setNotification] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    cin: "",
    tel: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

    const handleSubmit = async (e) => {
      e.preventDefault();
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
    <div className="container mt-5">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Name
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email address
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="cin" className="form-label">
            CIN
          </label>
          <input
            type="text"
            className="form-control"
            id="cin"
            name="cin"
            value={formData.cin}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="tel" className="form-label">
            Phone
          </label>
          <input
            type="text"
            className="form-control"
            id="tel"
            name="tel"
            value={formData.tel}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={isLoading}>
          {isLoading ? "Signing up..." : "Sign Up"}
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

export default Signup;
