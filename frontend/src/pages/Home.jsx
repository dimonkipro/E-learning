import Footer from "../components/Footer";
import BooksLottie from "../assets/hero.json";
import Lottie from "lottie-react";
import { useDispatch, useSelector } from "react-redux";
import CustomSpinner from "../components/CustomSpinner";
import { useEffect, useState } from "react";
import { fetchCourses } from "../redux/auth/courseSlice";
import { Link } from "react-router";
import PartnersSlide from "../components/PartnersSlide";

const Home = () => {
  const dispatch = useDispatch();
  const { courses, loading, error } = useSelector((state) => state.courses);
  const [random, setRandom] = useState([]);

  useEffect(() => {
    dispatch(fetchCourses());
  }, [dispatch]);

  useEffect(() => {
    if (!loading && !error && courses.length) {
      const filtered = courses.filter((c) => !c.archived);
      const shuffled = [...filtered].sort(() => Math.random() - 0.5);
      setRandom(shuffled.slice(0, 4));
    }
  }, [courses, loading, error]);

  if (loading) return <CustomSpinner />;
  if (error) return <div>Error: {error}</div>;

  // chunk into pairs of 2
  const slides = [];
  for (let i = 0; i < random.length; i += 2) {
    slides.push(random.slice(i, i + 2));
  }

  return (
    <div className="col-12">
      {/* Hero Section */}
      <div
        id="hero"
        className="row col-12 mx-auto text-center d-flex flex-wrap p-4"
      >
        <div className="col-md-8">
          <h1>
            Moins de pression, <span></span>
          </h1>
          <h1>
            Plus d’apprentissage. <span></span>
          </h1>
          <p className="col-10 mx-auto fw-bold mt-5 ">
            Une nouvelle façon d’apprendre, 100% chill mais 100% efficace. T’as
            envie de progresser sans te prendre la tête ? Bienvenue chez nous.{" "}
            <span></span>
          </p>
        </div>
        <div className="col-md-4 d-flex align-items-center">
          <div className="col-10 mx-auto mb-4">
            <Lottie animationData={BooksLottie} loop={true} />
          </div>
        </div>
        <div className=" bounce-hover fs-3 text-secondary">
          <Link
            to="/courses"
            className="link-secondary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover fs-3 fw-bold"
          >
            Commencer maintenant
          </Link>
          {" >"}
        </div>
      </div>

      <hr className="featurette-divider my-5 col-10 mx-auto" />

      <div
        id="courseCarousel"
        className="carousel slide container mb-5 p-4"
        data-bs-ride="carousel"
      >
        <div className="carousel-indicators">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              data-bs-target="#courseCarousel"
              data-bs-slide-to={i}
              className={i === 0 ? "active" : ""}
              aria-current={i === 0 ? "true" : undefined}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
        <div className="carousel-inner">
          {slides.map((pair, idx) => (
            <div
              className={`carousel-item ${idx === 0 ? "active" : ""}`}
              key={idx}
            >
              {pair.map((course, index) => (
                <div className="row" key={course._id}>
                  <Link
                    title="Voir plus"
                    to={`/courses/${course._id}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <div className="row animate">
                      <div
                        className={`col-md-7 ${
                          index % 2 === 0 && "order-md-2"
                        } overflow-hidden`}
                        style={{ maxHeight: "10rem" }}
                      >
                        <h2>{course.title}</h2>
                        <p
                          className="lead overflow-hidden"
                          style={{ maxHeight: "100%" }}
                        >
                          {course.longDescription}
                        </p>
                      </div>

                      <div className="col-md-5 overflow-hidden mx-auto text-center order-md-1 p-2">
                        <img
                          style={{ height: "11.5rem" }}
                          className="rounded object-fit-contain col-12"
                          src={`http://localhost:5000/${course.image.replaceAll(
                            "\\",
                            "/"
                          )}`}
                          alt="..."
                        />
                        <hr className="featurette-divider my-4" />
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
              {pair.length === 1 && <div className="col-md-6" />}
            </div>
          ))}
        </div>

        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#courseCarousel"
          data-bs-slide="prev"
        >
          <span className="carousel-control-prev-icon" />
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#courseCarousel"
          data-bs-slide="next"
        >
          <span className="carousel-control-next-icon" />
          <span className="visually-hidden">Next</span>
        </button>
      </div>
      <hr className="featurette-divider my-5 col-10 mx-auto" />
      <h1 className="text-center text-secondary">Nos Partenaires</h1>
      <PartnersSlide />
      <Footer />
    </div>
  );
};

export default Home;
