import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:5000/api/admin";
const token = localStorage.getItem("token");

// Fetch all users
export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.msg || "Failed to fetch users"
      );
    }
  }
);

// Edit user role
export const editUserRole = createAsyncThunk(
  "users/editUserRole",
  async ({ id, role }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_URL}/users/${id}/role`,
        { role }, // Body should contain only the role
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.user;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.msg || "Failed to update role"
      );
    }
  }
);

// Delete user
export const deleteUser = createAsyncThunk(
  "users/deleteUser",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return id; // Return deleted user ID
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.msg || "Failed to delete user"
      );
    }
  }
);

export const verifyUser = createAsyncThunk(
  "users/verifyUser",
  async (id, { rejectWithValue }) => {
    try {
      if (!token) throw new Error("No authentication token found");

      const response = await axios.put(
        `${API_URL}/users/${id}/verify`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data.user; // Return updated user
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.msg || "Failed to verify user"
      );
    }
  }
);

const usersSlice = createSlice({
  name: "users",
  initialState: { list: [], isLoading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.list = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(editUserRole.fulfilled, (state, action) => {
        const index = state.list.findIndex(
          (user) => user._id === action.payload._id
        );
        if (index !== -1) state.list[index] = action.payload;
      })

      .addCase(deleteUser.fulfilled, (state, action) => {
        state.list = state.list.filter((user) => user._id !== action.payload);
      });
  },
});

export default usersSlice.reducer;
