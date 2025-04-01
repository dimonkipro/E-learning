import { useDispatch } from "react-redux";
import { addNotification } from "../redux/notifications/notificationSlice";

const ExampleComponent = () => {
  const dispatch = useDispatch();

  const notifyUser = () => {
    dispatch(addNotification({ id: Date.now(), message: "New course added!" }));
  };

  return <button onClick={notifyUser}>Notify</button>;
};

export default ExampleComponent