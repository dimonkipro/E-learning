/* eslint-disable react/prop-types */

import { Link } from "react-router-dom";

const ErrorPage = ({ text, emojis, to }) => {
  return (
    <div className="container text-center my-5">
      <p className="display-2 fw-bold">{emojis}</p>
      <p className="display-2">{text}</p>
      <Link to={to ? to : "/"}>Retour</Link>
    </div>
  );
};

export default ErrorPage;
