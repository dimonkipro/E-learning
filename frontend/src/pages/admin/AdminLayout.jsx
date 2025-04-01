import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <>
      {/* <div className="main-content flex-grow-1 p-2 "> */}
      <div className="d-flex col-12">
        <Outlet />
      </div>
    </>
  );
};

export default AdminLayout;
