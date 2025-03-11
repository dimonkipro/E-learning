import { useState } from "react";
import { Button, Nav, Offcanvas } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import DarkModeToggle from "./DarkModeToggle";
import logo from "../assets/logo.png";
import { logoutUser } from "../redux/auth/authSlice";

const Sidebar = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const theme = localStorage.getItem("theme");

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      {/* Offcanvas sidebar */}
      <Offcanvas
        show={show}
        onHide={handleClose}
        placement="end"
        className={theme === "light" ? "bg-dark" : "bg-light"}
        style={{ width: "300px" }}
      >
        {/* Offcanvas header */}
        <Offcanvas.Header
          closeButton
          closeVariant={theme === "light" ? "white" : undefined}
          className="bg-dark "
        >
          <Offcanvas.Title>
            <p className="text-warning mx-5">Admin Panel</p>
          </Offcanvas.Title>
        </Offcanvas.Header>

        {/* Offcanvas body */}
        <Offcanvas.Body className="p-0 text-end">
          <Nav
            className={`flex-column p-3 ${
              theme === "light" ? "bg-dark" : "bg-light"
            }`}
            style={{ width: "250px", minHeight: "87vh" }}
          >
            {/* Offcanvas Items */}
            <Nav.Item>
              <Nav.Link
                className={theme === "light" ? "text-white" : "text-dark"}
              >
                Logged in as: {user?.name}
              </Nav.Link>
            </Nav.Item>

            <Nav.Item>
              <Nav.Link
                as={Link}
                to={
                  user?.role === "admin"
                    ? "/admin/dashboard"
                    : user?.role === "instructor"
                    ? "/trainer/dashboard"
                    : null
                }
                onClick={handleClose}
                className={theme === "light" ? "text-white" : "text-dark"}
              >
                Dashboard
                <i className="bi bi-speedometer2 ms-2"></i>
              </Nav.Link>
            </Nav.Item>

            <Nav.Item>
              <Nav.Link
                as={Link}
                to="/admin/users"
                onClick={handleClose}
                className={theme === "light" ? "text-white" : "text-dark"}
              >
                Users
                <i className="bi bi-people ms-2"></i>
              </Nav.Link>
            </Nav.Item>

            <Nav.Item>
              <Nav.Link
                as={Link}
                to="/admin/courses"
                onClick={handleClose}
                className={theme === "light" ? "text-white" : "text-dark"}
              >
                Courses
                <i className="bi bi-box-seam ms-2"></i>
              </Nav.Link>
            </Nav.Item>

            <Nav.Item className=" mt-auto">
              <Nav.Link
                onClick={() => {
                  handleClose();
                }}
                className="text-danger"
                data-bs-toggle="modal"
                data-bs-target="#logoutModal"
              >
                Logout
                <i className="bi bi-box-arrow-right ms-2"></i>
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>

      {/* Admin_Trainer_Header */}
      <div className="d-flex justify-content-between align-items-center mx-4">
        <div className="rounded-pill bg-body-secondary p-2">
          <DarkModeToggle drop={"bottom-centered"} />
        </div>

        <Nav.Item>
          <Nav.Link as={Link} to="/">
            <img
              src={logo}
              alt="Logo"
              className="logo"
              style={{ width: "80%" }}
            />
          </Nav.Link>
        </Nav.Item>

        <Button variant="warning" onClick={handleShow}>
          <i className="bi bi-list h3"></i>
        </Button>
      </div>

      {/* Logout alert */}
      <div
        className="modal fade"
        id="logoutModal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header d-flex justify-content-between">
              <h5 className="modal-title" id="exampleModalLabel">
                Prêt à partir ?
              </h5>
              <button
                className="btn-close"
                type="button"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              Sélectionnez ci-dessous si vous êtes prêt à terminer votre session
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
                onClick={() => {
                  handleLogout();
                }}
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
