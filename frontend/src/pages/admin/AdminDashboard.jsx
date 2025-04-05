import { useDispatch, useSelector } from "react-redux";
import ExampleComponent from "../../components/ExampleComponent";
import { useEffect } from "react";
import { fetchInscriptions } from "../../redux/auth/enrollmentSlice";

const AdminDashboard = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth);
  const { enrollments } = useSelector((state) => state.enrollments);
  useEffect(() => {
    dispatch(fetchInscriptions());
  }, [dispatch]);

  return (
    <div className="container">
      <div>
        <h1>Admin Dashboard</h1>
        <p>Welcome, {user?.name}!</p>
        <p>Email: {user?.email}</p>
        <p>Role: {user?.role}</p>
      </div>

      {/* Courses / learner cards */}
      <div className="d-flex gap-4 mb-5 flex-wrap">
        <div
          className="col-md card shadow h-100 py-2"
          style={{ borderLeft: " .25rem solid #4e73df" }}
        >
          <div className="card-body">
            <div className="row no-gutters align-items-center">
              <div className="col mr-2">
                <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                  Earnings (Annual)
                </div>
                <div className="h5 mb-0 font-weight-bold text-gray-800">
                  215,000
                </div>
              </div>
              <div className="col-auto">
                <i className="bi bi-currency-dollar h1"></i>
              </div>
            </div>
          </div>
        </div>
        <div
          className="col-md card shadow h-100 py-2"
          style={{ borderLeft: " .25rem solid #4e73df" }}
        >
          <div className="card-body">
            <div className="row no-gutters align-items-center">
              <div className="col mr-2">
                <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                  Inscriptions
                </div>
                <div className="h5 mb-0 font-weight-bold text-gray-800">
                  {enrollments?.length}
                </div>
              </div>
              <div className="col-auto">
                <i className="bi bi-collection h1"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Charts */}
      <div className="d-flex gap-4 flex-wrap">
        <div className="col-md card shadow mb-4">
          <div className="card-header py-3">
            <h6 className="m-0 font-weight-bold text-primary">Area Chart</h6>
          </div>
          <div className="card-body">
            <div className="chart-area">
              <canvas id="myAreaChart"></canvas>
            </div>
            <hr />
            Styling for the area chart can be found in the
            <code>/js/demo/chart-area-demo.js</code> file.
          </div>
        </div>
        <div className="col-md card shadow mb-4">
          <div className="card-header py-3">
            <h6 className="m-0 font-weight-bold text-primary">Pie Chart</h6>
          </div>
          <div className="card-body">
            <div className="chart-area">
              <canvas id="myAreaChart"></canvas>
            </div>
            <hr />
            Styling for the area chart can be found in the
            <code>/js/demo/chart-area-demo.js</code> file.
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

      <ExampleComponent />
    </div>
  );
};

export default AdminDashboard;
