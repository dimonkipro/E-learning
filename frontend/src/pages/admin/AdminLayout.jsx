import { Outlet, useNavigate } from "react-router-dom";
import Footer from "../../components/Footer";

const AdminLayout = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className="px-4 mb-4">
        <button
          onClick={() => navigate(-1)}
          className="btn btn-outline-secondary  "
        >
          <i className="bi bi-arrow-bar-left me-1"></i>
          Revenir en arrière
        </button>
      </div>
      {/* <div className="main-content flex-grow-1 p-2 "> */}
      <div className="d-flex col-12">
        <Outlet />
      </div>
      <Footer />
    </>
  );
};

export default AdminLayout;
