import { Outlet, useNavigate } from "react-router-dom";
import Footer from "../../components/Footer";

const AdminLayout = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className="px-4 mb-2">
        <button
          onClick={() => navigate(-1)}
          className="btn btn-outline-secondary  "
        >
          <i className="bi bi-arrow-bar-left me-1"></i>
          Revenir en arrière
        </button>
      </div>
      <div className="d-flex col-12">
        <Outlet />
      </div>
      <Footer />
    </>
  );
};

export default AdminLayout;
