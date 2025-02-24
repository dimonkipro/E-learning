import { configureStore } from "@reduxjs/toolkit";


const store = configureStore({
  reducer: {
    // auth: authReducer,
    // add other reducers here if needed
  },
});

export default store;
