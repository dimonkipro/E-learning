import image from "../assets/Logo.png";
const Home = () => {
  return (
    <div className="container">
      <h1>Home Page</h1>
      <a className="btn" href="/login">
        Login
      </a>
      <a className="btn" href="/signup">
        SignUp
      </a>
      <a className="btn" href="/admin">
        Admin
      </a>
      <a className="btn" href="/profile">
        Profile
      </a>
      <a className="btn" href="/courses">
        Courses
      </a>

      <div className="row">
        <div className="col-md-7">
          <h2>
            First featurette heading.{" "}
            <span className="text-body-secondary">It’ll blow your mind.</span>
          </h2>
          <p className="lead">
            Some great placeholder content for the first featurette here.
            Imagine some exciting prose here.
          </p>
        </div>

        <div className="col-md-5">
          <img src={image} alt="" />
        </div>
      </div>

      <hr className="featurette-divider" />
      <div className="row">
        <div className="col-md-7 order-md-2">
          <h2>
            Oh yeah, it’s that good.{" "}
            <span className="text-body-secondary">See for yourself.</span>
          </h2>
          <p className="lead">
            Another featurette? Of course. More placeholder content here to give
            you an idea of how this layout would work with some actual
            real-world content in place.
          </p>
        </div>
        <div className="col-md-5 order-md-1">
          <img src={image} alt="" />
        </div>
      </div>
    </div>
  );
};

export default Home;
