import "./slide.css";
import image1 from "../assets/partners/BritishCouncil_Logo.png";
import image2 from "../assets/partners/Crescent_Petroleum_logo.svg.png";
import image3 from "../assets/partners/IFRC_logo_2020.png";
import image4 from "../assets/partners/ISOC-Logo.png";
import image5 from "../assets/partners/pmi-logo-png.png";
import image6 from "../assets/partners/unicef_logo.png";
const PartnersSlide = () => {
  const products = [image1, image2, image3, image4, image5, image6];
  return (
    <div
      style={{
        overflow: "clip",
      }}
    >
      <div
        className="carousel-container position-relative my-2"
        style={{
          display: "flex",
          gap: "0.5rem",
        }}
      >
        {products.map((product, index) => (
          <div
            key={index}
            className="image-container-carousel col-4 flex-shrink-0 rounded-3 my-1"
          >
            <img src={product} alt="..." />
          </div>
        ))}
      </div>
    </div>
  );
};
export default PartnersSlide;
