import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { verifyEmail } from "../redux/auth/authSlice";
import Notifications from "../components/Notifications";
import image from "../assets/verifyEmail.jpg";

const VerifyEmail = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const inputRefs = useRef([]);
  const { isLoading } = useSelector((state) => state.auth);
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [notification, setNotification] = useState(null);
  const [focusedIndex, setFocusedIndex] = useState(null);

  const handleFocus = (index) => {
    setFocusedIndex(index);
  };
  const handleBlur = () => {
    setFocusedIndex(null);
  };
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
        setNotification({
          type: "success",
          message: "Email verified successfully",
        });
        navigate("/login");
      } else {
        setNotification({
          type: "error",
          message: res.payload || "Verifying email failed",
        });
      }
    } catch (error) {
      setNotification({
        type: "error",
        message: error.message || "An unexpected error occurred",
      });
    }
  };
  useEffect(() => {
    if (code.every((digit) => digit !== "")) {
      setTimeout(() => handleSubmit(new Event("submit")), 500); // Small delay to ensure smooth UX
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  return (
    <div
      className="container col-8 position-absolute top-50 start-50 translate-middle
     p-4 rounded-4 shadow"
    >
      <div className="row p-4">
        <div className="col-6 ">
          <img src={image} alt="..." style={{ width: "100%" }} />
        </div>
        <div className="col-6 text-center">
          <div className="mb-5">
            <h1>Verifier votre E-mail</h1>
            <p>Entrez le code à 6 chiffres envoyé à votre adresse e-mail.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  maxLength="6"
                  className="form-control text-center fs-2 mb-4 rounded-circle mx-1"
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onFocus={() => handleFocus(index)}
                  onBlur={handleBlur}
                  style={
                    focusedIndex === index
                      ? {
                          borderColor: "rgba(255, 193, 7, 0.77)",
                          boxShadow: "0 0 0 .25rem rgba(255, 193, 7, 0.28)",
                        }
                      : {}
                  }
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
      {notification && (
        <Notifications
          type={notification.type}
          message={notification.message}
        />
      )}
    </div>
  );
};

export default VerifyEmail;
