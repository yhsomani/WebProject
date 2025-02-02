import React, { useState, useEffect } from "react";
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Chip, 
  Button, 
  LinearProgress,
  Tabs,
  Tab,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@mui/material";

const MOCK_COURSES = [
  {
    id: 1,
    title: "Full Stack Web Development Bootcamp",
    description: "Comprehensive course covering modern web technologies",
    skills: ["React", "Node.js", "Express", "MongoDB"],
    difficulty: "Advanced",
    duration: "12 weeks",
    progress: 60,
    category: "Web Development",
    imageUrl: "https://example.com/web-dev-course.jpg",
    price: 499,
    instructors: ["John Doe", "Jane Smith"]
  },
  {
    id: 2,
    title: "Machine Learning Fundamentals",
    description: "Dive deep into machine learning algorithms and techniques",
    skills: ["Python", "TensorFlow", "Data Science", "Scikit-learn"],
    difficulty: "Intermediate",
    duration: "8 weeks",
    progress: 30,
    category: "Data Science",
    imageUrl: "https://example.com/ml-course.jpg",
    price: 399,
    instructors: ["Alex Johnson"]
  }
];

const AdvancedCourseRecommendation = () => {
  const [courses, setCourses] = useState(MOCK_COURSES);
  const [activeTab, setActiveTab] = useState(0);
  const [filters, setFilters] = useState({
    category: "",
    difficulty: "",
    priceRange: [0, 1000],
    skills: []
  });

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleFilterChange = (prop) => (event, newValue) => {
    setFilters({ ...filters, [prop]: newValue });
  };

  const applyFilters = () => {
    const filteredCourses = MOCK_COURSES.filter(course => 
      (filters.category === "" || course.category === filters.category) &&
      (filters.difficulty === "" || course.difficulty === filters.difficulty) &&
      course.price >= filters.priceRange[0] &&
      course.price <= filters.priceRange[1]
    );

    setCourses(filteredCourses);
  };

  useEffect(() => {
    applyFilters();
  }, [filters]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Course Recommendation Engine
      </Typography>

      <Tabs 
        value={activeTab} 
        onChange={handleTabChange} 
        sx={{ mb: 3 }}
      >
        <Tab label="Recommended" />
        <Tab label="Explore Courses" />
        <Tab label="My Learning Path" />
      </Tabs>

      {activeTab === 1 && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Category</InputLabel>
              <Select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                label="Category"
              >
                <MenuItem value="">All Categories</MenuItem>
                <MenuItem value="Web Development">Web Development</MenuItem>
                <MenuItem value="Data Science">Data Science</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={3}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Difficulty</InputLabel>
              <Select
                value={filters.difficulty}
                onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
                label="Difficulty"
              >
                <MenuItem value="">All Levels</MenuItem>
                <MenuItem value="Beginner">Beginner</MenuItem>
                <MenuItem value="Intermediate">Intermediate</MenuItem>
                <MenuItem value="Advanced">Advanced</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography gutterBottom>Price Range</Typography>
            <Slider
              value={filters.priceRange}
              onChange={handleFilterChange("priceRange")}
              valueLabelDisplay="auto"
              min={0}
              max={1000}
              valueLabelFormat={(value) => `$${value}`}
            />
          </Grid>
        </Grid>
      )}

      <Grid container spacing={3}>
        {courses.map((course) => (
          <Grid item xs={12} md={4} key={course.id}>
            <Card elevation={3} sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
              <CardMedia
                component="img"
                height="200"
                image={course.imageUrl}
                alt={course.title}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6">{course.title}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {course.description}
                </Typography>

                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
                  {course.skills.map((skill) => (
                    <Chip 
                      key={skill} 
                      label={skill} 
                      size="small" 
                      color="primary" 
                      variant="outlined" 
                    />
                  ))}
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                  <Typography variant="body2">
                    Difficulty: {course.difficulty}
                  </Typography>
                  <Typography variant="body2">
                    Duration: {course.duration}
                  </Typography>
                </Box>

                <Typography variant="body2" sx={{ mb: 1 }}>
                  Instructors: {course.instructors.join(", ")}
                </Typography>

                <Typography variant="h6" color="primary">
                  ${course.price}
                </Typography>

                {activeTab === 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      Your Progress
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={course.progress} 
                      color={course.progress < 50 ? "warning" : "success"}
                    />
                  </Box>
                )}
              </CardContent>
              
              <Box sx={{ p: 2 }}>
                <Button 
                  variant="contained" 
                  color="secondary" 
                  fullWidth
                >
                  {activeTab === 0 ? "Continue Learning" : "Enroll Now"}
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default AdvancedCourseRecommendation;
