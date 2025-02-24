import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <>
      <ToastContainer />
      <Routes>
        {/* ------------------PublicRoute---------------------------- */}

        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />

        {/* ------------------AdminRoute---------------------------- */}

        <Route
          path="/admin"
          // element={
          //   <ProtectedRoute>
          //     <AdminRoute>
          //       <AdminLayout />
          //     </AdminRoute>
          //   </ProtectedRoute>
          // }
        >
          {/* <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} /> */}
        </Route>

        {/* ------------------InstructorRoute---------------------------- */}

        <Route
          path="/instructor"
          // element={
          //   <ProtectedRoute>
          //     <InstructorRoute>
          //       <AdminLayout />
          //     </InstructorRoute>
          //   </ProtectedRoute>
          // }
        >
          {/* <Route index element={<InstructorDashboard />} />
          <Route path="dashboard" element={<InstructorDashboard />} /> */}
        </Route>
      </Routes>
    </>
  );
}

export default App;
