import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchCourses = createAsyncThunk(
  "courses/fetchCourses",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/courses", { params: filters });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const enrollCourse = createAsyncThunk(
  "courses/enrollCourse",
  async (courseId, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/api/courses/${courseId}/enroll`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const trackCourseProgress = createAsyncThunk(
  "courses/trackProgress",
  async ({ courseId, moduleId, completedPercentage }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/api/courses/${courseId}/progress`, {
        moduleId,
        completedPercentage
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const recommendCourses = createAsyncThunk(
  "courses/recommendCourses",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/courses/recommendations");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
