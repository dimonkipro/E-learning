import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { Route, Routes } from "react-router-dom";
function App() {
  return (
    <>
      <Routes>
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
