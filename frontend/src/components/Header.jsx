import { useDispatch, useSelector } from "react-redux";
// import DarkModeToggle from "./DarkModeToggle";
import { Link } from "react-router-dom";
import logo from "../assets/logoGm.png";
import { logoutUser } from "../redux/auth/authSlice";
const Header = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <nav className="navbar py-0 mb-4">
      <div className="container-fluid container">
        <Link to={"/"}>
          <img
            src={logo}
            alt="Logo"
            className="logo"
            style={{ width: "190px", height: "auto" }}
          />
        </Link>
        <div className="d-flex flex-wrap align-items-center" role="search">
          {user ? (
            <>
              <Link
                className="link-dark link-offset-2 link-offset-3-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover mx-2"
                to={"/courses"}
              >
                Formations
              </Link>
              <Link
                className="link-dark link-offset-2 link-offset-3-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover mx-2"
                to={"/profile"}
              >
                Profile
              </Link>
              <Link
                className="link-danger mx-2"
                data-bs-toggle="modal"
                data-bs-target="#logoutModal"
              >
                <i className="bi bi-box-arrow-right ms-2"></i> Déconnecter
              </Link>
            </>
          ) : (
            <>
              <Link
                className="link-dark link-offset-2 link-offset-3-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover mx-2"
                to={"/login"}
              >
                Se connecter
              </Link>
              <Link
                className="link-dark link-offset-2 link-offset-3-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover mx-2"
                to={"/signup"}
              >
                S&apos;inscrire
              </Link>
              <Link
                className="link-dark link-offset-2 link-offset-3-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover mx-2"
                to={"/courses"}
              >
                Formations
              </Link>
            </>
          )}
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
    </nav>
  );
};

export default Header;
