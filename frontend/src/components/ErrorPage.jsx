/* eslint-disable react/prop-types */

const ErrorPage = ({text}) => {
  return (
    <div>
      <p className="container display-1 text-center fw-bold position-absolute top-50 start-50 translate-middle ">
        (❁´⁔`❁) <br /> {text}
      </p>
    </div>
  );
}

export default ErrorPage
