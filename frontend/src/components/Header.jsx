import { useSelector } from "react-redux";
import DarkModeToggle from "./DarkModeToggle";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
const Header = () => {
  const { user } = useSelector((state) => state.auth);

  return (

    <nav className="navbar bg-body-tertiary">
      <div className="container-fluid container">
        <Link to={"/"}>
          <img
            src={logo}
            alt="Logo"
            className="logo"
            style={{ width: "80%" }}
          />
        </Link>
        <div className="d-flex flex-wrap" role="search">
          {user ? (
            <a className="btn" href="/profile">
              Profile
            </a>
          ) : (
            <>
              <a className="btn" href="/login">
                Login
              </a>
              <a className="btn" href="/signup">
                SignUp
              </a>
            </>
          )}
          <a className="btn" href="/courses">
            Courses
          </a>

          <div className="rounded-pill bg-body-secondary p-2">
            <DarkModeToggle drop={"bottom-centered"} />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
