/* eslint-disable react/prop-types */

const ErrorPage = ({text, emojis}) => {
  return (
    <div className="container">
      <p className="display-1 text-center fw-bold my-5">
        {emojis} <br /> {text}
      </p>
    </div>
  );
}

export default ErrorPage
