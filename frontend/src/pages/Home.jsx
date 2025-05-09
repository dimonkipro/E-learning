import image from "../assets/Logo.png";
import Footer from "../components/Footer";
const Home = () => {
  return (
    <div className="col-12">
      <div className="container">
        <h1>Home Page</h1>
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
            <img src={image} alt="..." />
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
      <Footer />
    </div>
  );
};

export default Home;
