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
  const theme = localStorage.getItem("theme");

  const [show, setShow] = useState(false);

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
        className={theme === "light" ? "bg-dark" : "bg-light"}
        style={{ width: "300px", transition: "all 0.7s ease" }}
      >
        <Offcanvas.Header
          closeButton
          closeVariant={theme === "light" ? "white" : undefined}
          className="bg-dark"
        >
          <Offcanvas.Title>
            <p className="text-warning mx-5">{user?.role} Panel</p>
          </Offcanvas.Title>
        </Offcanvas.Header>

        <Offcanvas.Body className="p-0 text-end">
          <Nav
            className={`flex-column p-3 ${
              theme === "light" ? "bg-dark" : "bg-light"
            }`}
            style={{ width: "250px", minHeight: "87vh" }}
          >
            <p className={theme === "light" ? "text-white" : "text-dark"}>
              Logged in as: {user?.name}
            </p>

            {/* Links */}
            <Nav.Item>
              {/* Admin Navs - Visible only for Admin */}
              {user?.role === "admin" && (
                <>
                  {/* Dashboard */}
                  <Nav.Link
                    as={Link}
                    to="/admin/dashboard"
                    className={theme === "light" ? "text-white" : "text-dark"}
                    onClick={handleClose}
                  >
                    Dashboard <i className="bi bi-speedometer2 ms-2"></i>
                  </Nav.Link>

                  {/* Courses Management */}
                  <Nav.Link
                    as={Link}
                    to="/admin/courses"
                    onClick={handleClose}
                    className={theme === "light" ? "text-white" : "text-dark"}
                  >
                    Formations <i className="bi bi-box-seam ms-2"></i>
                  </Nav.Link>

                  {/* Users Management */}
                  <Nav.Link
                    as={Link}
                    to="/admin/users"
                    onClick={handleClose}
                    className={theme === "light" ? "text-white" : "text-dark"}
                  >
                    Utilisateurs <i className="bi bi-people ms-2"></i>
                  </Nav.Link>

                  {/* Inscriptions */}
                  <Nav.Link
                    as={Link}
                    to="/admin/enrollments"
                    onClick={handleClose}
                    className={theme === "light" ? "text-white" : "text-dark"}
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
                    className={theme === "light" ? "text-white" : "text-dark"}
                    onClick={handleClose}
                  >
                    Dashboard <i className="bi bi-speedometer2 ms-2"></i>
                  </Nav.Link>

                  {/* Courses */}
                  <Nav.Link
                    as={Link}
                    to="/instructor/courses"
                    onClick={handleClose}
                    className={theme === "light" ? "text-white" : "text-dark"}
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
                    className={theme === "light" ? "text-white" : "text-dark"}
                  >
                    Dashboard <i className="bi bi-speedometer2 ms-2"></i>
                  </Nav.Link>
                  <Nav.Link
                    as={Link}
                    to="/learner/courses"
                    onClick={handleClose}
                    className={theme === "light" ? "text-white" : "text-dark"}
                  >
                    Formations <i className="bi bi-book ms-2"></i>
                  </Nav.Link>
                  <Nav.Link
                    as={Link}
                    to="/learner/my-courses"
                    onClick={handleClose}
                    className={theme === "light" ? "text-white" : "text-dark"}
                  >
                    Mes Inscriptions <i className="bi bi-journal-check"></i>
                  </Nav.Link>
                </>
              )}
            </Nav.Item>

            {/* Logout */}
            <Nav.Item className="mt-auto">
              <Nav.Link
                className="text-danger"
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
              style={{ width: "190px", height: "auto" }}
            />
          </Nav.Link>
        </Nav.Item>

        {/* SideBar Button */}
        <Button variant="warning" onClick={handleShow}>
          <i className="bi bi-list h3"></i>
        </Button>
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
