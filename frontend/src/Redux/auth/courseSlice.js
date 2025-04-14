import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = "http://localhost:5000/api";
// Fetch all courses
export const fetchCourses = createAsyncThunk(
  "courses/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/course/all`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Add a new course
export const addCourse = createAsyncThunk(
  "courses/add",
  async (formData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_URL}/admin/course/new`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Formation ajoutée avec succée");
      return response.data.course;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchCourseById = createAsyncThunk(
  "courses/fetchById",
  async (courseId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/courses/${courseId}`);
      return response.data.course;
    } catch (error) {
      return rejectWithValue(error.response?.data?.msg || error.message);
    }
  }
);

export const fetchCourseDetailsById = createAsyncThunk(
  "courses/fetchById/details",
  async (courseId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${API_URL}/course/${courseId}/details`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.msg || error.message);
    }
  }
);

export const fetchTestResults = createAsyncThunk(
  "courses/fetchTestResults",
  async (courseId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${API_URL}/learner/course/${courseId}/testResults`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.msg || error.message);
    }
  }
);

export const toggleCourseArchive = createAsyncThunk(
  "courses/toggleArchive",
  async (courseId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `${API_URL}/admin/courses/${courseId}/toggle-archive`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(response.data.msg);
      return response.data.course;
    } catch (error) {
      return rejectWithValue(error.response?.data?.msg || error.message);
    }
  }
);


const courseSlice = createSlice({
  name: "courses",
  initialState: {
    courses: [],
    currentCourse: null,
    courseModules: null,
    videos: [],
    tests: [],
    testProgress: null,
    loading: false,
    error: null,
  },
  reducers: {
    // Clear current course when needed
    clearCurrentCourse: (state) => {
      state.currentCourse = null;
      state.courseModules = null;
      state.tests = [];
      state.testProgress = null;
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourses.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addCourse.fulfilled, (state, action) => {
        state.courses.push(action.payload);
      })
      // single course fetch
      .addCase(fetchCourseById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourseById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCourse = action.payload;
      })
      .addCase(fetchCourseById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Course dtails for instructor
      .addCase(fetchCourseDetailsById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCourseDetailsById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCourse = action.payload.course;
        state.courseModules = action.payload.modules;
        state.tests = action.payload.modules.reduce((acc, module) => {
          if (module.test) acc.push(module.test);
          return acc;
        }, []);
        state.videos = Array.isArray(action.payload.modules)
          ? action.payload.modules.flatMap((module) =>
              Array.isArray(module.videos) ? module.videos : []
            )
          : [];
      })
      .addCase(fetchCourseDetailsById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Handle fetching test progress results
      .addCase(fetchTestResults.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTestResults.fulfilled, (state, action) => {
        state.loading = false;
        state.testProgress = action.payload; // { totalTests, passedTests, progressPercentage }
      })
      .addCase(fetchTestResults.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default courseSlice.reducer;
export const { clearCurrentCourse } = courseSlice.actions;
