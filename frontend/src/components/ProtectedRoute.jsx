import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import CustomSpinner from "./CustomSpinner";

// eslint-disable-next-line react/prop-types
const ProtectedRoute = ({ allowedRoles }) => {
  const { user, isAuthChecked } = useSelector((state) => state.auth);

  // Prevent redirect until auth check completes
  if (!isAuthChecked) {
    return <CustomSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // eslint-disable-next-line react/prop-types
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
