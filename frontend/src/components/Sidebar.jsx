import { useEffect, useState } from "react";
import { Button, Nav, Offcanvas } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
// import DarkModeToggle from "./DarkModeToggle";
import logo from "../assets/logoGm.png";
import { logoutUser } from "../redux/auth/authSlice";
import { fetchUserInscriptions } from "../redux/auth/enrollmentSlice";

const Sidebar = () => {
  const dispatch = useDispatch();
  // const theme = localStorage.getItem("theme");

  const [show, setShow] = useState(true);

  const { user } = useSelector((state) => state.auth);
  const { userEnrollments } = useSelector((state) => state.enrollments);

  useEffect(() => {
    if (user?.role === "learner") {
      dispatch(fetchUserInscriptions());
    }
  }, [dispatch, user]);

  const isLearner = userEnrollments?.length > 0;
  const showSidebar =
    user?.role === "admin" || user?.role === "instructor" || isLearner;

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  if (!showSidebar) return null;
  return (
    <>
      {/* Offcanvas Sidebar */}
      <Offcanvas
        show={show}
        onHide={handleClose}
        placement="end"
        className="bg-dark"
        style={{ width: "300px", transition: "all 0.7s ease" }}
      >
        <Offcanvas.Header
          closeButton
          // closeVariant="white"
          className="bg-light rounded-bottom pb-4 mb-3"
        >
          <Offcanvas.Title>
            <p className="text-warning mx-5 mb-0">{user?.role} Panel</p>
          </Offcanvas.Title>
        </Offcanvas.Header>
        <p className="text-white text-center pt-2">
          Logged in as : {user?.name}
        </p>
        <Offcanvas.Body className="p-0 text-end">
          <Nav
            className="flex-column p-2"
            style={{ width: "250px", minHeight: "73vh" }}
          >
            {/* <p className="text-white">Logged in as: {user?.name}</p> */}

            {/* Links */}
            <Nav.Item>
              {/* Admin Navs - Visible only for Admin */}
              {user?.role === "admin" && (
                <>
                  {/* Dashboard */}
                  <Nav.Link
                    as={Link}
                    to="/admin/dashboard"
                    // className={theme === "light" ? "text-white" : "text-dark"}
                    className="link-secondary"
                    onClick={handleClose}
                  >
                    Dashboard <i className="bi bi-speedometer2 ms-2"></i>
                  </Nav.Link>

                  {/* Courses Management */}
                  <Nav.Link
                    as={Link}
                    to="/admin/courses"
                    onClick={handleClose}
                    // className={theme === "light" ? "text-white" : "text-dark"}
                    className="link-secondary"
                  >
                    Formations <i className="bi bi-box-seam ms-2"></i>
                  </Nav.Link>

                  {/* Users Management */}
                  <Nav.Link
                    as={Link}
                    to="/admin/users"
                    onClick={handleClose}
                    // className={theme === "light" ? "text-white" : "text-dark"}
                    className="link-secondary"
                  >
                    Utilisateurs <i className="bi bi-people ms-2"></i>
                  </Nav.Link>

                  {/* Inscriptions */}
                  <Nav.Link
                    as={Link}
                    to="/admin/enrollments"
                    onClick={handleClose}
                    // className={theme === "light" ? "text-white" : "text-dark"}
                    className="link-secondary"
                  >
                    Inscriptions <i className="bi bi-list-check ms-2"></i>
                  </Nav.Link>
                </>
              )}

              {/* Instructor Navs - Visible only for Instructor */}
              {user?.role === "instructor" && (
                <>
                  <Nav.Link
                    as={Link}
                    to="/instructor/dashboard"
                    // className={theme === "light" ? "text-white" : "text-dark"}
                    className="link-secondary"
                    onClick={handleClose}
                  >
                    Dashboard <i className="bi bi-speedometer2 ms-2"></i>
                  </Nav.Link>

                  {/* Courses */}
                  <Nav.Link
                    as={Link}
                    to="/instructor/courses"
                    onClick={handleClose}
                    // className={theme === "light" ? "text-white" : "text-dark"}
                    className="link-secondary"
                  >
                    Formations <i className="bi bi-box-seam ms-2"></i>
                  </Nav.Link>
                </>
              )}

              {/* Learner Navs - Visible only for Users with Inscriptions */}
              {isLearner && (
                <>
                  <Nav.Link
                    as={Link}
                    to="/learner/dashboard"
                    onClick={handleClose}
                    // className={theme === "light" ? "text-white" : "text-dark"}
                    className="link-secondary"
                  >
                    Dashboard <i className="bi bi-speedometer2 ms-2"></i>
                  </Nav.Link>
                  <Nav.Link
                    as={Link}
                    to="/learner/courses"
                    onClick={handleClose}
                    // className={theme === "light" ? "text-white" : "text-dark"}
                    className="link-secondary"
                  >
                    Formations <i className="bi bi-book ms-2"></i>
                  </Nav.Link>
                  <Nav.Link
                    as={Link}
                    to="/learner/my-courses"
                    onClick={handleClose}
                    // className={theme === "light" ? "text-white" : "text-dark"}
                    className="link-secondary"
                  >
                    Mes Inscriptions <i className="bi bi-journal-check"></i>
                  </Nav.Link>
                </>
              )}
            </Nav.Item>

            {/* Logout */}
            <Nav.Item className="mt-auto">
              <Nav.Link
                className="link-danger"
                data-bs-toggle="modal"
                data-bs-target="#logoutModal"
              >
                Déconnecter <i className="bi bi-box-arrow-right ms-2"></i>
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>

      {/* Header */}
      <div className="navbar py-0 px-5 mb-4">
        {/* Dark Mode Button */}
        {/* <div className="rounded-pill bg-body-secondary p-2">
          <DarkModeToggle drop={"bottom-centered"} />
        </div> */}

        {/* Logo */}
        <Nav.Item>
          <Nav.Link as={Link} to="/">
            <img
              src={logo}
              alt="Logo"
              className="logo"
              style={{ width: "10rem", height: "auto" }}
            />
          </Nav.Link>
        </Nav.Item>
        <div className="d-flex gap-">
          {/* Notification Button */}
          <div className="btn-group dropstart">
            <button
              type="button"
              className="btn btn-warning position-relative mx-4"
              id="alertsDropdown"
              role="button"
              data-bs-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <i className="bi bi-bell"></i>
              <span className="position-absolute top-0 start-100 translate-middle p-2 bg-danger border border-light rounded-circle"></span>
            </button>

            <ul className="dropdown-menu py-0">
              <h6 className="dropdown-header bg-primary text-white rounded-top">
                Notifications
              </h6>
              <a
                className="dropdown-item d-flex align-items-center"
                href="#"
              >
                <div className="mr-3">
                  <div className="icon-circle bg-warning rounded me-2">
                    <i className="bi bi-info text-white h4"></i>
                  </div>
                </div>
                <div>
                  <div className="small text-secondary">December 12, 2019</div>
                  <span className="fw-bold">
                    A new monthly report is ready to download!
                  </span>
                </div>
              </a>
              <a className="dropdown-item text-center small rounded-bottom" href="#">
                Show All Alerts
              </a>
            </ul>
          </div>

          {/* SideBar Button */}
          <Button variant="warning" onClick={handleShow}>
            <i className="bi bi-list h3"></i>
          </Button>
        </div>
      </div>

      {/* Logout Modal */}
      <div
        className="modal"
        id="logoutModal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header d-flex justify-content-between">
              <h5 className="modal-title" id="exampleModalLabel">
                Prêt à partir?
              </h5>
              <button
                className="btn-close"
                type="button"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              Cliquez ci-dessous pour vous déconnecter de votre session
              actuelle.
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                type="button"
                data-bs-dismiss="modal"
              >
                Annuler
              </button>
              <button
                className="btn btn-danger"
                onClick={handleLogout}
                data-bs-dismiss="modal"
              >
                Déconnecter
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
