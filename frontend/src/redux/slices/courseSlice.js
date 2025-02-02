import { createSlice } from "@reduxjs/toolkit";
import { 
  fetchCourses, 
  enrollCourse, 
  trackCourseProgress,
  recommendCourses 
} from "../actions/courseActions";

const courseSlice = createSlice({
  name: "courses",
  initialState: {
    courses: [],
    recommendedCourses: [],
    loading: false,
    error: null,
    enrollment: null
  },
  reducers: {},
  extraReducers: (builder) => {
    // Fetch Courses
    builder.addCase(fetchCourses.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchCourses.fulfilled, (state, action) => {
      state.loading = false;
      state.courses = action.payload;
    });
    builder.addCase(fetchCourses.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Enroll Course
    builder.addCase(enrollCourse.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(enrollCourse.fulfilled, (state, action) => {
      state.loading = false;
      state.enrollment = action.payload;
    });
    builder.addCase(enrollCourse.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Track Course Progress
    builder.addCase(trackCourseProgress.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(trackCourseProgress.fulfilled, (state, action) => {
      state.loading = false;
      const updatedCourseIndex = state.courses.findIndex(
        course => course.id === action.payload.courseId
      );
      
      if (updatedCourseIndex !== -1) {
        state.courses[updatedCourseIndex].progress = action.payload.progress;
      }
    });
    builder.addCase(trackCourseProgress.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Recommend Courses
    builder.addCase(recommendCourses.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(recommendCourses.fulfilled, (state, action) => {
      state.loading = false;
      state.recommendedCourses = action.payload;
    });
    builder.addCase(recommendCourses.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  }
});

export default courseSlice.reducer;
