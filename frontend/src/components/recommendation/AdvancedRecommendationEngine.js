import React, { useState, useEffect } from "react";
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Button, 
  Chip, 
  Avatar 
} from "@mui/material";
import { 
  School as SchoolIcon, 
  WorkOutline as WorkIcon, 
  Recommend as RecommendIcon 
} from "@mui/icons-material";

const MOCK_RECOMMENDATION_DATA = {
  courses: [
    {
      id: 1,
      title: "Advanced React Development",
      description: "Master modern React with hooks, context, and advanced state management",
      difficulty: "Advanced",
      duration: "6 weeks",
      coverImage: "https://example.com/react-course.jpg",
      instructors: [
        { name: "John Doe", avatar: "https://example.com/john.jpg" }
      ],
      skills: ["React", "State Management", "Performance Optimization"]
    },
    {
      id: 2,
      title: "Machine Learning Fundamentals",
      description: "Comprehensive introduction to machine learning algorithms and techniques",
      difficulty: "Intermediate",
      duration: "8 weeks",
      coverImage: "https://example.com/ml-course.jpg",
      instructors: [
        { name: "Jane Smith", avatar: "https://example.com/jane.jpg" }
      ],
      skills: ["Python", "Machine Learning", "Data Science"]
    }
  ],
  internships: [
    {
      id: 1,
      title: "Full Stack Developer Internship",
      company: "TechInnovate Solutions",
      description: "Build scalable web applications using modern technologies",
      skills: ["React", "Node.js", "MongoDB"],
      matchPercentage: 85
    },
    {
      id: 2,
      title: "Data Science Research Internship",
      company: "AI Research Labs",
      description: "Conduct advanced research in machine learning and AI",
      skills: ["Python", "Machine Learning", "Research"],
      matchPercentage: 70
    }
  ]
};

const AdvancedRecommendationEngine = () => {
  const [recommendations, setRecommendations] = useState(MOCK_RECOMMENDATION_DATA);
  const [selectedTab, setSelectedTab] = useState("courses");

  return (
    <Box sx={{ p: 3 }}>
      <Box 
        display="flex" 
        alignItems="center" 
        justifyContent="space-between" 
        mb={3}
      >
        <Typography variant="h4">
          Personalized Recommendations
        </Typography>
        <Chip 
          icon={<RecommendIcon />} 
          label="AI-Powered Suggestions" 
          color="primary" 
        />
      </Box>

      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <Button 
          variant={selectedTab === "courses" ? "contained" : "outlined"}
          startIcon={<SchoolIcon />}
          onClick={() => setSelectedTab("courses")}
        >
          Recommended Courses
        </Button>
        <Button 
          variant={selectedTab === "internships" ? "contained" : "outlined"}
          startIcon={<WorkIcon />}
          onClick={() => setSelectedTab("internships")}
        >
          Recommended Internships
        </Button>
      </Box>

      <Grid container spacing={3}>
        {selectedTab === "courses" && recommendations.courses.map((course) => (
          <Grid item xs={12} md={4} key={course.id}>
            <Card elevation={3} sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
              <CardMedia
                component="img"
                height="200"
                image={course.coverImage}
                alt={course.title}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom>
                  {course.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {course.description}
                </Typography>
                
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Typography variant="body2" sx={{ mr: 2 }}>
                    Difficulty: 
                  </Typography>
                  <Chip 
                    label={course.difficulty} 
                    size="small" 
                    color={
                      course.difficulty === "Beginner" ? "info" : 
                      course.difficulty === "Intermediate" ? "warning" : 
                      "error"
                    } 
                  />
                </Box>

                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
                  {course.skills.map((skill) => (
                    <Chip 
                      key={skill} 
                      label={skill} 
                      size="small" 
                      variant="outlined" 
                    />
                  ))}
                </Box>

                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography variant="body2" sx={{ mr: 2 }}>
                    Duration: {course.duration}
                  </Typography>
                  {course.instructors.map((instructor) => (
                    <Avatar 
                      key={instructor.name} 
                      alt={instructor.name} 
                      src={instructor.avatar} 
                      sx={{ width: 32, height: 32, mr: 1 }} 
                    />
                  ))}
                </Box>
              </CardContent>
              <Box sx={{ p: 2 }}>
                <Button 
                  variant="contained" 
                  color="primary" 
                  fullWidth
                >
                  Enroll Now
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}

        {selectedTab === "internships" && recommendations.internships.map((internship) => (
          <Grid item xs={12} md={4} key={internship.id}>
            <Card elevation={3} sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom>
                  {internship.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {internship.description}
                </Typography>
                
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Typography variant="body2" sx={{ mr: 2 }}>
                    Company: 
                  </Typography>
                  <Chip 
                    label={internship.company} 
                    size="small" 
                    color="primary" 
                  />
                </Box>

                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
                  {internship.skills.map((skill) => (
                    <Chip 
                      key={skill} 
                      label={skill} 
                      size="small" 
                      variant="outlined" 
                    />
                  ))}
                </Box>

                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Typography variant="body2" sx={{ mr: 2 }}>
                    Match Percentage: 
                  </Typography>
                  <Chip 
                    label={`${internship.matchPercentage}%`} 
                    size="small" 
                    color={
                      internship.matchPercentage < 50 ? "error" : 
                      internship.matchPercentage < 75 ? "warning" : 
                      "success"
                    } 
                  />
                </Box>
              </CardContent>
              <Box sx={{ p: 2 }}>
                <Button 
                  variant="contained" 
                  color="primary" 
                  fullWidth
                >
                  Apply Now
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default AdvancedRecommendationEngine;
