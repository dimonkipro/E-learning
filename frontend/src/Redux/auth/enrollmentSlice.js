import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL_ADMIN = "http://localhost:5000/api/admin";
const API_URL_USER = "http://localhost:5000/api";
const token = localStorage.getItem("token");

// Fetch all inscriptions
export const fetchInscriptions = createAsyncThunk(
  "inscriptions/fetchInscriptions",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL_ADMIN}/inscriptions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.data; // Extract data array
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.msg || "Failed to fetch inscriptions"
      );
    }
  }
);

// Update inscription status
export const updateInscriptionStatus = createAsyncThunk(
  "inscriptions/updateStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_URL_ADMIN}/inscriptions/${id}/status`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success(response.data.msg);

      return response.data.data;
    } catch (error) {
      toast.error(error.response?.data?.msg);
      return rejectWithValue(
        error.response?.data?.msg || "Failed to update status"
      );
    }
  }
);

// Create inscription
export const createInscription = createAsyncThunk(
  "enrollments/createInscription",
  async ({ courseId, formData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_URL_USER}/inscription/new/:courseId`,
        { ...formData, courseId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Soumission envoyée avec succès");
      return response.data.data;
    } catch (error) {
      toast.error(error.response?.data?.msg || "Submission failed");
      return rejectWithValue(error.response?.data?.msg || "Submission failed");
    }
  }
);

// Fetch user's own inscriptions
export const fetchUserInscriptions = createAsyncThunk(
  "enrollments/fetchUserInscriptions",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL_USER}/inscriptions/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.inscriptions;
      
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.msg || "Failed to fetch your applications"
      );
    }
  }
);

const initialState = {
  enrollments: [],
  userEnrollments: [],
  loading: false,
  error: null,
  successMessage: null,
};

const enrollmentSlice = createSlice({
  name: "enrollments",
  initialState,
  reducers: {
    clearEnrollmentMessage: (state) => {
      state.successMessage = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch enrollments
      .addCase(fetchInscriptions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInscriptions.fulfilled, (state, action) => {
        state.loading = false;
        state.enrollments = action.payload;
      })
      .addCase(fetchInscriptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update enrollment status
      .addCase(updateInscriptionStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateInscriptionStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = "Enrollment status updated successfully";
        // Update the specific enrollment in the state
        state.enrollments = state.enrollments.map((enrollment) =>
          enrollment._id === action.payload._id ? action.payload : enrollment
        );
      })
      .addCase(updateInscriptionStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create inscription
      .addCase(createInscription.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createInscription.fulfilled, (state, action) => {
        state.loading = false;
        state.userEnrollments.push(action.payload);
        state.successMessage = "Application submitted successfully";
      })
      .addCase(createInscription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch user inscriptions
      .addCase(fetchUserInscriptions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserInscriptions.fulfilled, (state, action) => {
        state.loading = false;
        state.userEnrollments = action.payload;
      })
      .addCase(fetchUserInscriptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearEnrollmentMessage } = enrollmentSlice.actions;
export default enrollmentSlice.reducer;
