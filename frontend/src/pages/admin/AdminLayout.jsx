import { Outlet } from "react-router-dom";
import Sidebar from "../../components/Sidebar";

const AdminLayout = () => {
  return (
    <>
      <Sidebar />
      <div className="d-flex">
        {/* <div className="main-content flex-grow-1 p-2 ms-sm-5 bg-dark-subtle"> */}
        <div className="main-content flex-grow-1 p-2 ">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default AdminLayout;
