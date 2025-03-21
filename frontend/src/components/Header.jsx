import { useSelector } from "react-redux";
import DarkModeToggle from "./DarkModeToggle";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
const Header = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <nav className="navbar py-0 bg-body-tertiary mb-4">
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
            <Link className="btn" to={"/profile"}>
              Profile
            </Link>
          ) : (
            <>
              <Link className="btn" to={"/login"}>
                Login
              </Link>
              <Link className="btn" to={"/signup"}>
                SignUp
              </Link>
            </>
          )}
          <Link className="btn" to={"/courses"}>
            Courses
          </Link>

          <div className="rounded-pill bg-body-secondary p-2">
            <DarkModeToggle drop={"bottom-centered"} />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
