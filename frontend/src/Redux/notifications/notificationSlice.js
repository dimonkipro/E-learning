import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notifications",
  initialState: {
    messages: [],
  },
  reducers: {
    addNotification: (state, action) => {
      state.messages.push(action.payload);
    },
    removeNotification: (state, action) => {
      state.messages = state.messages.filter(
        (msg) => msg.id !== action.payload
      );
    },
    clearNotifications: (state) => {
      state.messages = [];
    },
  },
});

export const { addNotification, removeNotification, clearNotifications } =
  notificationSlice.actions;
export default notificationSlice.reducer;
