import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../redux/auth/authSlice";
import { useState } from "react";
import Notifications from "../components/Notifications";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [notification, setNotification] = useState(null);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser());
      setNotification({
        type: "info",
        message: "Logged out successfully",
      });
      navigate("/");
    } catch (error) {
      setNotification({ type: "error", message: error });
    }
  };
  return (
    <div className="container">
      <h1>Profile Page</h1>
      <button onClick={handleLogout}>Logout</button>
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

export default Profile;
