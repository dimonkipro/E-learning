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
import EnrollmentList from "./pages/admin/EnrollmentList";
import ApplyEnrollment from "./pages/ApplyEnrollment";
import LearnerDashboard from "./pages/learner/LearnerDashboard";
import Inscriptions from "./pages/learner/Inscriptions";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import InstructorDashboard from "./pages/instructor/InstructorDashboard";
import EditCourseModelPage from "./pages/instructor/EditCourseModelPage";
import CourseDetails from "./pages/learner/CourseDetails";
import CourseContent from "./pages/learner/CourseContent";
import ErrorPage from "./components/ErrorPage";

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

  const hideHeader =
    user?.role === "admin" ||
    user?.role === "instructor" ||
    user?.role === "learner";

  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <>
      {!hideHeader ? <Header /> : <Sidebar />}
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

        {/* ------------------UserRoute---------------------------- */}

        <Route element={<ProtectedRoute allowedRoles={["user", "learner"]} />}>
          <Route
            path="/profile"
            element={
              user?.role === "user" ? (
                <Profile />
              ) : (
                <Navigate to="/learner" replace />
              )
            }
          />
          <Route path="/course/:courseId/apply" element={<ApplyEnrollment />} />
        </Route>

        {/* ------------------AdminRoute---------------------------- */}

        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<Users />} />
            <Route path="courses" element={<Courses />} />
            <Route path="edit-course/:courseId" element={<EditCoursePage />} />
            <Route path="enrollments" element={<EnrollmentList />} />
          </Route>
        </Route>

        {/* ------------------InstructorRoute---------------------------- */}

        <Route element={<ProtectedRoute allowedRoles={["instructor"]} />}>
          <Route path="/instructor" element={<AdminLayout />}>
            <Route index element={<InstructorDashboard />} />
            <Route path="dashboard" element={<InstructorDashboard />} />
            <Route path="courses" element={<Courses />} />
            <Route path="course/:courseId" element={<CourseDetails />} />
            <Route
              path="course/content/:courseId"
              element={<CourseContent />}
            />
            <Route
              path="edit-course/:courseId"
              element={<EditCourseModelPage />}
            />
          </Route>
        </Route>

        {/* ------------------LearnerRoute---------------------------- */}
        <Route element={<ProtectedRoute allowedRoles={["learner"]} />}>
          <Route path="/learner" element={<AdminLayout />}>
            <Route index element={<LearnerDashboard />} />
            <Route path="dashboard" element={<LearnerDashboard />} />
            <Route path="my-courses" element={<Inscriptions />} />
            <Route path="courses" element={<Courses />} />
            <Route
              path="course/:courseId/:enrollementId"
              element={<CourseDetails />}
            />

            <Route
              path="course/content/:courseId/:enrollementId"
              element={<CourseContent />}
            />
            <Route
              path="enrollment/success"
              element={
                <ErrorPage
                  text={"L'inscriptions au cours envoyée avec succée"}
                  emojis={"(●'◡'●)"}
                />
              }
            />
          </Route>
        </Route>
        {/* ------------------ErrorRoute---------------------------- */}

        <Route
          path="*"
          element={<ErrorPage text={"404 Page Not Found"} emojis={"(❁´⁔`❁)"} />}
        />
      </Routes>
    </>
  );
}

export default App;
