import { useEffect } from "react";
import { toast } from "react-toastify";
// eslint-disable-next-line react/prop-types
const Notifications = ({ type, message }) => {
  useEffect(() => {
    if (message && type) {
      const options = {
        autoClose: 5000,
        position: "bottom-right",
        draggable: true,
        closeOnClick: true,
        theme: "dark",
      };

      switch (type) {
        case "success":
          toast.success(message, options);
          break;
        case "error":
          toast.error(message, options);
          break;
        case "info":
          toast.info(message, options);
          break;
        default:
          toast(message, options);
      }
    }
  }, [type, message]);

  return null;
};
export default Notifications;
