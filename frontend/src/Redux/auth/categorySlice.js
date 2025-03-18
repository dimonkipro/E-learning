import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = "http://localhost:5000/api";
const token = localStorage.getItem("token");


// Fetch all categories
export const fetchCategories = createAsyncThunk(
  "categories/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/category/all`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Add a new category
export const addCategory = createAsyncThunk(
  "categories/add",
  async (name, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/admin/category/new`, { name },{
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success("Catégorie ajoutée avec succée")
      return response.data.category;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const categorySlice = createSlice({
  name: "categories",
  initialState: { categories: [], loading: false, error: null },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addCategory.fulfilled, (state, action) => {
        state.categories.push(action.payload);
      });
  },
});

export default categorySlice.reducer;
