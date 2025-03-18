import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../redux/auth/authSlice";
import userReducers from "../redux/auth/userSlice";
import notificationReducer from "../redux/notifications/notificationSlice";
import categoryReducer from "../redux/auth/categorySlice";
import courseReducer from "../redux/auth/courseSlice";
import enrollmentReducer from "../redux/auth/enrollmentSlice";
const store = configureStore({
  reducer: {
    auth: authReducer,
    notifications: notificationReducer,
    users: userReducers,
    categories: categoryReducer,
    courses: courseReducer,
    enrollments: enrollmentReducer,
  },
});

export default store;
