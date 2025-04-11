import { useDispatch, useSelector } from "react-redux";
import ExampleComponent from "../../components/ExampleComponent";
import { useEffect } from "react";
import { fetchInscriptions } from "../../redux/auth/enrollmentSlice";
import { fetchUsers } from "../../redux/auth/userSlice";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { enrollments } = useSelector((state) => state.enrollments);
  const { list: users } = useSelector((state) => state.users);

  useEffect(() => {
    if (!users?.length) {
      dispatch(fetchUsers());
    }
    dispatch(fetchInscriptions());
  }, [dispatch, users?.length]);

  const totalEarnings = enrollments
    .filter((enrollment) => enrollment.status === "approved")
    .reduce((sum, enrollment) => {
      const price = Number(enrollment?.courseId?.price) || 0;
      return sum + price;
    }, 0);

  const verifiedUsers = users.reduce(
    (count, user) => (user.isVerified ? count + 1 : count),
    0
  );
  const pendingEnrollments = enrollments.reduce(
    (count, enrollment) => (enrollment.status === "pending" ? count + 1 : count),
    0
  );

  return (
    <div className="col-11 mx-auto">
      <div>
        <h1>Admin Dashboard</h1>
        <p>Welcome, {user?.name}!</p>
        <p>Email: {user?.email}</p>
        <p>Role: {user?.role}</p>
      </div>

      {/* Courses / learner cards */}
      <div className="container mb-5">
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3">
          {/* Earnings */}
          <div className="col mt-5">
            <div
              className="card shadow h-100 py-2"
              style={{ borderLeft: " .25rem solid rgb(25, 135, 84)" }}
            >
              <div className="card-body text-center">
                <div className="row no-gutters ">
                  <div className="col">
                    <div className="small font-weight-bold text-success text-uppercase mb-1">
                      Gains
                    </div>
                    <div className="h5 mb-0 fw-bold text-secondary">
                      {totalEarnings}
                    </div>
                  </div>
                  <div className="mt-2">
                    <i className="bi bi-currency-dollar h1 mb-0"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Enrollments */}
          <div className="col mt-5">
            <Link to="/admin/enrollments" className="text-decoration-none">
              <div
                className="card shadow h-100 py-2"
                style={{ borderLeft: " .25rem solid rgb(78, 115, 223)" }}
              >
                <div className="card-body text-center">
                  <div className="row no-gutters align-items-center">
                    <div className="col">
                      <div className="small font-weight-bold text-primary text-uppercase mb-1">
                        Inscriptions
                      </div>
                      <div className="h5 mb-0 fw-bold text-secondary">
                        {enrollments?.length}
                      </div>
                    </div>
                    <div className="col">
                      <div className="small font-weight-bold text-primary text-uppercase mb-1">
                        En attente
                      </div>
                      <div className="h5 mb-0 fw-bold text-secondary">
                        {pendingEnrollments}
                      </div>
                    </div>
                    <div className="mt-2">
                      <i className="bi bi-collection h1 mb-0"></i>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
          {/* Users */}
          <div className="col mt-5">
            <Link to="/admin/users" className="text-decoration-none">
              <div
                className="card shadow h-100 py-2"
                style={{ borderLeft: " .25rem solid rgb(255, 193, 7) " }}
              >
                <div className="card-body text-center">
                  <div className="row  align-items-center">
                    <div className="col">
                      <div className="small font-weight-bold text-warning-emphasis text-uppercase mb-1">
                        Utilisateurs
                      </div>
                      <div className="h5 mb-0 fw-bold text-secondary">
                        {verifiedUsers}
                      </div>
                    </div>
                    <div className="col">
                      <div className="small font-weight-bold text-warning-emphasis text-uppercase mb-1">
                        Non vérifié
                      </div>
                      <div className="h5 mb-0 fw-bold text-secondary">
                        {users.length - verifiedUsers}
                      </div>
                    </div>
                    <div className="mt-2">
                      <i className="bi bi-people h1 mb-0"></i>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
      {/* Charts */}
      <div className="my-5">
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3">
          <div className="col">
            <div className="card shadow">
              <div className="card-header py-3">
                <h6 className="m-0 font-weight-bold text-primary">
                  Area Chart
                </h6>
              </div>
              <div className="card-body text-center">
                <div className="chart-area">
                  <canvas id="myAreaChart"></canvas>
                </div>
                <hr />
                Styling for the area chart can
              </div>
            </div>
          </div>
          <div className="col">
            <div className="card shadow">
              <div className="card-header py-3">
                <h6 className="m-0 font-weight-bold text-primary">Pie Chart</h6>
              </div>
              <div className="card-body text-center">
                <div className="chart-area">
                  <canvas id="myAreaChart"></canvas>
                </div>
                <hr />
                Styling for the area chart can
              </div>
            </div>
          </div>
          <div className="col">
            <div className="card shadow">
              <div className="card-header py-3">
                <h6 className="m-0 font-weight-bold text-primary">Bar Chart</h6>
              </div>
              <div className="card-body text-center">
                <div className="chart-area">
                  <canvas id="myAreaChart"></canvas>
                </div>
                <hr />
                Styling for the area chart can
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Collapsed Card */}
      <div className="row col-6">
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
