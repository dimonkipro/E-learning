import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../redux/auth/authSlice";
import notificationReducer from "../redux/notifications/notificationSlice";


const store = configureStore({
  reducer: {
    auth: authReducer,
    notifications: notificationReducer,
  },
});

export default store;

