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
  LinearProgress 
} from "@mui/material";

const MOCK_COURSES = [
  {
    id: 1,
    title: "Full Stack Web Development",
    description: "Comprehensive course covering frontend and backend technologies",
    skills: ["React", "Node.js", "Express", "MongoDB"],
    difficulty: "Intermediate",
    progress: 60,
    imageUrl: "https://example.com/web-dev-course.jpg"
  },
  {
    id: 2,
    title: "Machine Learning Fundamentals",
    description: "Introduction to machine learning algorithms and techniques",
    skills: ["Python", "TensorFlow", "Data Science"],
    difficulty: "Advanced",
    progress: 30,
    imageUrl: "https://example.com/ml-course.jpg"
  }
];

const CourseRecommendations = () => {
  const [recommendedCourses, setRecommendedCourses] = useState([]);

  useEffect(() => {
    // Simulating recommendation logic
    const recommendations = MOCK_COURSES.sort((a, b) => b.progress - a.progress);
    setRecommendedCourses(recommendations);
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Personalized Course Recommendations
      </Typography>

      <Grid container spacing={3}>
        {recommendedCourses.map((course) => (
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

                <Typography variant="body2" sx={{ mb: 1 }}>
                  Difficulty: {course.difficulty}
                </Typography>

                <Typography variant="body2" sx={{ mb: 1 }}>
                  Your Progress
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={course.progress} 
                  color={course.progress < 50 ? "warning" : "success"}
                />
              </CardContent>
              
              <Box sx={{ p: 2 }}>
                <Button 
                  variant="contained" 
                  color="secondary" 
                  fullWidth
                >
                  Continue Learning
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default CourseRecommendations;
