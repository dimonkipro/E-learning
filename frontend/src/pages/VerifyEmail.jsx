import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { verifyEmail } from "../redux/auth/authSlice";
import Lottie from "lottie-react";
import VerifyLottie from "../assets/verify.json";
import Footer from "../components/Footer";
import CustomSpinner from "../components/CustomSpinner";
import { toast } from "react-toastify";

const VerifyEmail = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const inputRefs = useRef([]);
  const { isLoading } = useSelector((state) => state.auth);
  const [code, setCode] = useState(["", "", "", "", "", ""]);

  const handleChange = (index, value) => {
    const newCode = [...code];
    if (value.length > 1) {
      const pastedCode = value.slice(0, 6).split("");
      for (let i = 0; i < 6; i++) {
        newCode[i] = pastedCode[i] || "";
      }
      setCode(newCode);
      const lastFilledIndex = newCode.findLastIndex((digit) => digit !== "");
      const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
      inputRefs.current[focusIndex].focus();
    } else {
      newCode[index] = value;
      setCode(newCode);
      if (value && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const verificationCode = code.join("");
    console.log(verificationCode);

    try {
      const res = await dispatch(verifyEmail({ code: verificationCode }));
      if (res.type === "auth/verifyEmail/fulfilled") {
        toast.success("Email verifié avec succès 🎉");
        navigate("/login");
      } else {
        toast.error("Verification email échouée 😢");
      }
    } catch (error) {
      toast.error(error.message || "Une erreur s'est produite lors de la vérification de l'email");
    }
  };
  useEffect(() => {
    if (code.every((digit) => digit !== "")) {
      setTimeout(() => handleSubmit(new Event("submit")), 500); // Small delay to ensure smooth UX
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);
  if (isLoading) return <CustomSpinner />;

  return (
    <div>
      <div className="col-8 mx-auto row my-5 py-4 rounded-4 align-items-center shadow">
        <h1 className="text-center">Verifier votre E-mail</h1>
        <div className=" col-md-6 mx-auto d-flex justify-content-center p-4">
          <Lottie animationData={VerifyLottie} loop={true} />
        </div>
        <div className="col-md-6 mx-auto my-2 mx-auto text-center ">
          <p className="mb-5">
            Entrez le code à 6 chiffres envoyé à votre adresse e-mail.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="input-group  mb-4">
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  maxLength="6"
                  className="form-control text-center rounded-pill mb-2 p-0 mx-1 focus-ring focus-ring-warning border"
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                />
              ))}
            </div>
            <div className="d-grid col-8 mx-auto">
              <button
                className="btn btn-warning rounded-5 p-2"
                type="submit"
                disabled={isLoading || code.some((digit) => !digit)}
              >
                {isLoading ? "En train de verifier..." : "Verifier E-mail"}
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default VerifyEmail;
