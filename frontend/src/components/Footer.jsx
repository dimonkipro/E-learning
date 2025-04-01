import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="text-bg-light mt-3">
      <div className="col-12 mx-auto p-4 d-flex flex-column">
        {/* About */}
        <div className="col-12 col-md-9 col-lg-10 mx-auto d-flex flex-wrap">
          <div className="text-center p-4">
            <h3 className="mb-4">Qui sommes-nous</h3>
            <p>
              Société Laghazala du désert formations et services est une société
              SARL crée en 2021 et à comme activité principale une école de
              formation professionnelle et une deuxième activité services
              informatiques basé à Kébili et à Gabes . Notre société est
              enregistrée sous l&apos;agrément numéro 73-064-22 auprès du
              ministère de l&apos;emploi et la formation professionnelle.
            </p>
          </div>
        </div>

        {/* Numbers */}
        <div className="col-12 mx-auto d-flex flex-wrap gap-4">
          <div className="flex-fill d-flex flex-column text-center rounded-4 p-3 custom-card">
            <i className="bi bi-people-fill h3 d-flex flex-column" />
            Apprenants
            <p className="mb-0 fs-2 fw-bold">+50</p>
          </div>
          <div className="flex-fill d-flex flex-column text-center rounded-4 p-3 custom-card">
            <i className="bi bi-collection  h3 d-flex flex-column" />
            Formations
            <p className="mb-0 fs-2 fw-bold">+20</p>
          </div>
          <div className="flex-fill d-flex flex-column text-center rounded-4 p-3 custom-card">
            <i className="bi bi-person-hearts h3 d-flex flex-column" />
            Partenaires
            <p className="mb-0 fs-2 fw-bold">+15</p>
          </div>
        </div>

        {/* Lower Side */}
        <div className="col-12 col-md-10 col-lg-11 mx-auto d-flex flex-wrap gap-4 my-4">
          {/* Social */}
          <div className="flex-fill col-12 col-md-5 col-sm-5 d-flex text-center justify-content-around rounded-4 p-2 custom-card shadow">
            {/* <div className="col-12 col-lg-6 col-md-6 mx-auto d-flex flex-wrap justify-content-around rounded-4 p-4 custom-card my-3 shadow "> */}
            <Link to={""} target="_blank">
              <i className="bi bi-instagram h2"></i>
            </Link>
            <Link
              to={"https://www.facebook.com/Carthagoformation"}
              target="_blank"
            >
              <i className="bi bi-facebook h2"></i>
            </Link>
            <Link
              to={
                "https://www.linkedin.com/company/soci%C3%A9t%C3%A9-laghazala-du-d%C3%A9sert-formations-et-services/"
              }
              target="_blank"
            >
              <i className="bi bi-linkedin h2"></i>
            </Link>
            <Link to={"https://laghazala.tn/"} target="_blank">
              <i className="bi bi-globe-europe-africa h2"></i>{" "}
            </Link>
          </div>

          {/* Phone */}
          <div className="flex-fill col-12 col-md-5 col-sm-5 d-flex text-center justify-content-around rounded-4 p-2 custom-card shadow">
            <i className="bi bi-telephone-outbound h2 m-0"></i>
            <p className="fs-3 m-0">(+216) 50 464 602</p>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center text-bg-dark">
        <p className="m-0 p-2">
          &copy; Copyright 2025 Laghazala du désert formations et services
        </p>
      </div>
    </div>
  );
};

export default Footer;
