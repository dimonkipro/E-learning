import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { verifyEmail } from "../redux/auth/authSlice";
import Notifications from "../components/Notifications";

const VerifyEmail = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state) => state.auth);
  const [code, setCode] = useState("");
  const [notification, setNotification] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await dispatch(verifyEmail({ code }));
      if (res.type === "auth/verifyEmail/fulfilled") {
        setNotification({
          type: "success",
          message: "Email verified successfully",
        });
        navigate("/login");
      } else {
        setNotification({
          type: "error",
          message: res.payload || "Verifying email failed",
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
      <h2>Verify Email</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="code" className="form-label">
            Verification Code
          </label>
          <input
            type="text"
            className="form-control"
            id="code"
            name="code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        <button type="submit" className="btn btn-primary" disabled={isLoading}>
          {isLoading ? "Verifying..." : "Verify Email"}
        </button>
      </form>
      {notification && (
        <Notifications
          type={notification.type}
          message={notification.message}
        />
      )}
    </div>
  );
};

export default VerifyEmail;
