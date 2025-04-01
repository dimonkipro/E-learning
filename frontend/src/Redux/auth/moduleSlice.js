import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = "http://localhost:5000/api";
const token = localStorage.getItem("token");

export const addModule = createAsyncThunk(
  "module/add",
  async ({ title, order, courseId }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/instructor/course/${courseId}/module/new`,
        { title, order },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Module ajoutée avec succée");
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
export const addVideo = createAsyncThunk(
  "video/add",
  async ({ formData, moduleId }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/instructor/module/${moduleId}/video/new`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Video ajoutée avec succée");
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const addTest = createAsyncThunk(
  "test/add",
  async ({ testData, moduleId }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/instructor/module/${moduleId}/test/new`,
        testData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      toast.success("Test ajouté avec succès");
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const moduleSlice = createSlice({
  name: "modules",
  initialState: {
    modules: [],
    videos: [],
    tests: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder.addCase(addModule.fulfilled, (state, action) => {
      state.loading = false;
      state.modules.push(action.payload);
    });
    builder.addCase(addVideo.pending, (state, action) => {
      state.loading = true;
      state.modules.push(action.payload);
    });
    builder.addCase(addVideo.fulfilled, (state, action) => {
      state.loading = false;
      state.videos.push(action.payload);
    });
    builder.addCase(addVideo.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
    // New test reducers
    builder.addCase(addTest.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(addTest.fulfilled, (state, action) => {
      state.loading = false;
      state.tests.push(action.payload);
    });

    builder.addCase(addTest.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export default moduleSlice.reducer;
