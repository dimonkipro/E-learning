import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../redux/auth/authSlice";
import { useState } from "react";
import Notifications from "../components/Notifications";
import Footer from "../components/Footer";
import CustomSpinner from "../components/CustomSpinner";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoading } = useSelector((state) => state.auth);

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

  if (isLoading) return <CustomSpinner />;

  return (
    <div className="col-12">
      <div className="container">
        <h1>Profile Page</h1>
        <button onClick={handleLogout}>Logout</button>
        {user !== null && (
          <div className="container m-4">
            <p>{user.name}</p>
            <p>{user.role}</p>
            <p>{!user.isVerified ? "User not verified" : "User verified"}</p>
            <p>
              {!user.isEmailVerified ? "Email not verified" : "Email verified"}
            </p>
          </div>
        )}

        {/* Render the notification component when set */}
        {notification && (
          <Notifications
            type={notification.type}
            message={notification.message}
          />
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
