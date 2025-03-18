import { useSelector } from "react-redux";

const AdminDashboard = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <>
      <div>
        <h1>Admin Dashboard</h1>
        <p>Welcome, {user?.name}!</p>
        <p>Email: {user?.email}</p>
        <p>Role: {user?.role}</p>
      </div>

      <ul>
        <li className="nav-item dropdown no-arrow mx-1">
          <button
            type="button"
            className="btn btn-primary position-relative"
            id="alertsDropdown"
            role="button"
            data-bs-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            <i className="bi bi-bell"></i>
            <span className="position-absolute top-0 start-100 translate-middle p-2 bg-danger border border-light rounded-circle"></span>
          </button>

          {/* Alert Modal */}
          <div
            className="dropdown-list dropdown-menu dropdown-menu-right shadow animated--grow-in"
            aria-labelledby="alertsDropdown"
          >
            <h6 className="dropdown-header">Alerts Center</h6>
            <a className="dropdown-item d-flex align-items-center" href="#">
              <div className="mr-3">
                <div className="icon-circle bg-primary">
                  <i className="fas fa-file-alt text-white"></i>
                </div>
              </div>
              <div>
                <div className="small text-gray-500">December 12, 2019</div>
                <span className="font-weight-bold">
                  A new monthly report is ready to download!
                </span>
              </div>
            </a>
            <a
              className="dropdown-item text-center small text-gray-500"
              href="#"
            >
              Show All Alerts
            </a>
          </div>
        </li>
      </ul>

      {/* Earning card */}
      <div className="col-xl-3 col-md-6 mb-4">
        <div
          className="card shadow h-100 py-2"
          style={{ borderLeft: " .25rem solid #4e73df" }}
        >
          <div className="card-body">
            <div className="row no-gutters align-items-center">
              <div className="col mr-2">
                <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                  Earnings (Annual)
                </div>
                <div className="h5 mb-0 font-weight-bold text-gray-800">
                  $215,000
                </div>
              </div>
              <div className="col-auto">
                <i className="fas fa-dollar-sign fa-2x text-gray-300"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Collapsed Card */}
      <div className="col-6">
        <button
          className="btn btn-primary"
          data-bs-toggle="collapse"
          href="#collapseExample"
          role="button"
          aria-expanded="false"
          aria-controls="collapseExample"
        >
          Link with href
        </button>
        <div className="collapse" id="collapseExample">
          <div className="card card-body">
            Some placeholder content for the collapse component. This panel is
            hidden by default but revealed when the user activates the relevant
            trigger.
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
