/* eslint-disable react/prop-types */

const ErrorPage = ({ text, emojis }) => {
  return (
    <div className="container my-5">
      <p className="display-2 text-center fw-bold">{emojis}</p>
      <p className="display-2 text-center">{text}</p>
    </div>
  );
};

export default ErrorPage;
