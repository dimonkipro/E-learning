import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = "http://localhost:5000/api";

export const addModule = createAsyncThunk(
  "module/add",
  async ({ title, order, courseId }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
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
      const token = localStorage.getItem("token");
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
      const token = localStorage.getItem("token");
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
      const token = localStorage.getItem("token");
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
      const token = localStorage.getItem("token");
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
      const token = localStorage.getItem("token");
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

// Deleting a module with its related videos and test.
export const deleteModule = createAsyncThunk(
  "module/delete",
  async (moduleId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `${API_URL}/instructor/modules/${moduleId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success(response.data.msg);
      // Return the deleted module id so you can remove it from your store.
      return { moduleId };
    } catch (error) {
      toast.error(error.response?.data?.msg || error.message);
      return rejectWithValue(
        error.response?.data?.msg || error.message || "Failed to delete module"
      );
    }
  }
);

// Deleting a single video by its ID.
export const deleteVideo = createAsyncThunk(
  "video/delete",
  async (videoId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `${API_URL}/instructor/videos/${videoId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success(response.data.msg);
      // Return the deleted video id so you can update the state accordingly.
      return { videoId };
    } catch (error) {
      toast.error(error.response?.data?.msg || error.message);
      return rejectWithValue(
        error.response?.data?.msg || error.message || "Failed to delete video"
      );
    }
  }
);

// Deleting a test by its ID.
export const deleteTestById = createAsyncThunk(
  "test/delete",
  async (testId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `${API_URL}/instructor/tests/${testId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success(response.data.msg);
      // Return the deleted test id so you can update the state accordingly.
      return { testId };
    } catch (error) {
      toast.error(error.response?.data?.msg || error.message);
      return rejectWithValue(
        error.response?.data?.msg || error.message || "Failed to delete test"
      );
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
    // -------------------------------------- Add Module -----------------------------------
    builder.addCase(addModule.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(addModule.fulfilled, (state, action) => {
      state.loading = false;
      state.modules.push(action.payload);
    });
    builder.addCase(addModule.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // -------------------------------------- Add Video -----------------------------------

    builder.addCase(addVideo.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(addVideo.fulfilled, (state, action) => {
      state.loading = false;
      state.videos.push(action.payload);
    });
    builder.addCase(addVideo.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // -------------------------------------- Add Test -----------------------------------

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

    // -------------------------------------- Save VideoProgress -----------------------------------

    builder.addCase(saveVideoProgress.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(saveVideoProgress.fulfilled, (state, action) => {
      state.loading = false;
      state.videoProgress[action.payload.videoId] = action.payload.progress;
    });
    builder.addCase(saveVideoProgress.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // -------------------------------------- fetchVideoProgress -----------------------------------

    builder.addCase(fetchProgress.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchProgress.fulfilled, (state, action) => {
      state.loading = false;
      state.progress[action.payload.videoId] = action.payload.isCompleted;
    });
    builder.addCase(fetchProgress.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // -------------------------------------- Test submission -----------------------------------

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

    // -------------------------------------- Delete module -----------------------------------

    builder.addCase(deleteModule.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteModule.fulfilled, (state, action) => {
      state.loading = false;
      state.modules = state.modules.filter(
        (module) => module._id !== action.payload.moduleId
      );
    });
    builder.addCase(deleteModule.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // -------------------------------------- Delete video -----------------------------------

    builder.addCase(deleteVideo.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteVideo.fulfilled, (state, action) => {
      state.loading = false;
      state.videos = state.videos.filter(
        (video) => video._id !== action.payload.videoId
      );
    });
    builder.addCase(deleteVideo.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // -------------------------------------- Delete test-----------------------------------

    builder.addCase(deleteTestById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteTestById.fulfilled, (state, action) => {
      state.loading = false;
      state.tests = state.tests.filter(
        (test) => test._id !== action.payload.testId
      );
    });
    builder.addCase(deleteTestById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export default moduleSlice.reducer;
