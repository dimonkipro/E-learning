import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import { ToastContainer } from "react-toastify";
import Signup from "./pages/Signup";
import VerifyEmail from "./pages/VerifyEmail";
import ForgotPassword from "./pages/ForgotPassword";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { checkAuth } from "./redux/auth/authSlice";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Users from "./pages/admin/Users";
import Courses from "./components/Courses";
import CoursePage from "./pages/CoursePage";
import EditCoursePage from "./pages/admin/EditCoursePage";


function App() {
  const dispatch = useDispatch();
  const { isLoading, isAuthChecked, user } = useSelector((state) => state.auth);
  const theme = localStorage.getItem("theme");

  useEffect(() => {
    if (!isAuthChecked) {
      dispatch(checkAuth());
    }
  }, [dispatch, isAuthChecked]);

  useEffect(() => {
    document.body.setAttribute("data-bs-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <ToastContainer />
      <Routes>
        {/* ------------------PublicRoute---------------------------- */}

        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/" replace />}
        />
        <Route
          path="/signup"
          element={!user ? <Signup /> : <Navigate to="/" replace />}
        />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:courseId" element={<CoursePage />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* ------------------AdminRoute---------------------------- */}

        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<Users />} />
            <Route path="courses" element={<Courses />} />
            <Route path="edit-course/:courseId" element={<EditCoursePage />} />
          </Route>
        </Route>

        {/* ------------------InstructorRoute---------------------------- */}

        <Route element={<ProtectedRoute allowedRoles={["instructor"]} />}>
          <Route path="/instructor" element={<AdminLayout />}>
            {/* <Route index element={<InstructorDashboard />} />
          <Route path="dashboard" element={<InstructorDashboard />} /> */}
          </Route>
        </Route>

        {/* ------------------LearnerRoute---------------------------- */}

        <Route
          path="/learner"
          // element={
          //   <ProtectedRoute>
          //     <LearnerRoute>
          //       <AdminLayout />
          //     </LearnerRoute>
          //   </ProtectedRoute>
          // }
        >
          {/* <Route index element={<LearnerDashboard />} />
          <Route path="dashboard" element={<LearnerDashboard />} /> */}
        </Route>
        <Route
          path="*"
          element={
            <p className="container display-1 text-center fw-bold position-absolute top-50 start-50 translate-middle ">
              (❁´⁔`❁) <br /> 404 Page Not Found
            </p>
          }
        />
      </Routes>
    </>
  );
}

export default App;
