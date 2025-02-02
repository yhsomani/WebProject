import React, { useState, useEffect } from 'react';
import { 
  Grid, 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Slider, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem 
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import CourseCard from '../components/courses/CourseCard';
import { fetchCourses } from '../redux/actions/courseActions';

function CoursesPage() {
  const dispatch = useDispatch();
  const { courses, loading } = useSelector(state => state.courses);

  const [filters, setFilters] = useState({
    skillLevel: '',
    priceRange: [0, 1000],
    category: '',
    technology: ''
  });

  useEffect(() => {
    dispatch(fetchCourses(filters));
  }, [dispatch, filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [key]: value
    }));
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Explore Courses
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Filters
            </Typography>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Skill Level</InputLabel>
              <Select
                value={filters.skillLevel}
                label="Skill Level"
                onChange={(e) => handleFilterChange('skillLevel', e.target.value)}
              >
                <MenuItem value="">All Levels</MenuItem>
                <MenuItem value="beginner">Beginner</MenuItem>
                <MenuItem value="intermediate">Intermediate</MenuItem>
                <MenuItem value="advanced">Advanced</MenuItem>
              </Select>
            </FormControl>

            <Box sx={{ px: 2 }}>
              <Typography gutterBottom>Price Range</Typography>
              <Slider
                value={filters.priceRange}
                onChange={(e, newValue) => handleFilterChange('priceRange', newValue)}
                valueLabelDisplay="auto"
                min={0}
                max={1000}
              />
            </Box>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Category</InputLabel>
              <Select
                value={filters.category}
                label="Category"
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                <MenuItem value="">All Categories</MenuItem>
                <MenuItem value="web_development">Web Development</MenuItem>
                <MenuItem value="data_science">Data Science</MenuItem>
                <MenuItem value="ai_ml">AI/Machine Learning</MenuItem>
              </Select>
            </FormControl>
          </Paper>
        </Grid>

        <Grid item xs={12} md={9}>
          <Grid container spacing={3}>
            {loading ? (
              <Typography>Loading courses...</Typography>
            ) : (
              courses.map(course => (
                <Grid item xs={12} sm={6} md={4} key={course.id}>
                  <CourseCard course={course} />
                </Grid>
              ))
            )}
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}

export default CoursesPage;
