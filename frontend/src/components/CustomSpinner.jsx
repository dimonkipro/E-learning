import LoadingLottie from "../assets/loading.json";
import LoadingLottie2 from "../assets/loading2.json";
import Lottie from "lottie-react";

const CustomSpinner = () => {
  return (
    <div className="col-8 col-md-2 mx-auto text-center text-secondary">
      <Lottie animationData={LoadingLottie} loop={true} />
      <div className="col-8 mx-auto">
        <Lottie animationData={LoadingLottie2} loop={true} />
      </div>
    </div>
  );
};

export default CustomSpinner;
