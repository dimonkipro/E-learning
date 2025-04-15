/* eslint-disable react/prop-types */

import { Link, useNavigate } from "react-router-dom";

const ErrorPage = ({ text, emojis }) => {
  const navigate = useNavigate();

  return (
    <div className="container text-center my-5">
      <p className="display-2 fw-bold">{emojis}</p>
      <p className="display-2">{text}</p>
      <Link onClick={() => navigate(-1)}>Retour</Link>
    </div>
  );
};

export default ErrorPage;
