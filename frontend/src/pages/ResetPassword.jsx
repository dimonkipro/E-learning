import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useParams } from "react-router-dom";
import { resetPassword } from "../redux/auth/authSlice";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const { token } = useParams();
  const auth = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  const onSubmit = (e) => {
    e.preventDefault();

    dispatch(resetPassword({ token, password }))
  };

  return (
    <div className=" container col-5 mt-4">
      <form onSubmit={onSubmit}>
        <h1 className="text-center">Reset password</h1>

        {/* PASSWORD_FIELD */}
        <div className="input-group mb-3">
          <span className="input-group-text">
            <i className="bi bi-incognito h4"></i>
          </span>
          <div className="form-floating">
            <input
              type="password"
              id="PasswordInput"
              className="form-control"
              placeholder="Enter your Password !"
              onChange={(e) => setPassword(e.target.value)}
            />
            <label htmlFor="PasswordInput" className="form-label">
              Password
            </label>
          </div>
        </div>
        <div className="text-center d-grid gap-2 col-10 mx-auto">
          <button
            type="submit"
            className="btn btn-warning"
            disabled={auth.isLoading}
          >
            {auth.isLoading ? "Resetting..." : "Reset password"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ResetPassword;
