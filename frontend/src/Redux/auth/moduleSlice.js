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

export const fetchProgress = createAsyncThunk(
  "progress/fetch",
  async ({ userId, videoId }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/progress/${userId}/${videoId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return { videoId, isCompleted: response.data.isCompleted };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const saveVideoProgress = createAsyncThunk(
  "progress/save",
  async (
    { userId, videoId, watchedTime, videoDuration },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        `${API_URL}/progress`,
        { userId, videoId, watchedTime, videoDuration },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return { videoId, progress: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const submitTest = createAsyncThunk(
  "test/submit",
  async ({ testId, userAnswers }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/learner/test/${testId}/submit`,
        { answers: userAnswers },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(response.data.msg);
      return response.data; // expected structure from controller: { msg, score, passed, totalQuestions, correctCount, results }
    } catch (error) {
      toast.error(error.response?.data?.msg);
      return rejectWithValue(error.response?.data?.msg || error.message);
    }
  }
);

const moduleSlice = createSlice({
  name: "modules",
  initialState: {
    modules: [],
    videos: [],
    tests: [],
    videoProgress: {},
    progress: {},
    testResults: null,
    isTestSubmitted: false,
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
    // Test reducers
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

    // Save VideoProgress
    builder.addCase(saveVideoProgress.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(saveVideoProgress.fulfilled, (state, action) => {
      state.loading = false;
      // You can store or update the progress result for the video
      state.videoProgress[action.payload.videoId] = action.payload.progress;
    });
    builder.addCase(saveVideoProgress.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // fetchVideoProgress reducers
    builder.addCase(fetchProgress.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchProgress.fulfilled, (state, action) => {
      state.loading = false;
      state.progress[action.payload.videoId] = action.payload.isCompleted;
    });
    builder.addCase(fetchProgress.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Test submission reducers
    builder.addCase(submitTest.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(submitTest.fulfilled, (state, action) => {
      state.loading = false;
      state.testResults = action.payload;
      state.isTestSubmitted = true;
    });
    builder.addCase(submitTest.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isTestSubmitted = false;
    });
  },
});

export default moduleSlice.reducer;
