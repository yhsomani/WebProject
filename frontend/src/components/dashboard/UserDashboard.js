import React, { useState, useEffect } from "react";
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  LinearProgress, 
  Card, 
  CardContent, 
  Button,
  Divider
} from "@mui/material";
import { 
  School as CourseIcon, 
  Work as InternshipIcon, 
  AssessmentOutlined as AnalyticsIcon 
} from "@mui/icons-material";

const UserDashboard = () => {
  const [userStats, setUserStats] = useState({
    completedCourses: 3,
    activeInternships: 1,
    skillProgress: [
      { skill: "Web Development", progress: 75 },
      { skill: "Data Science", progress: 45 },
      { skill: "Machine Learning", progress: 30 }
    ],
    recentActivities: [
      { 
        type: "course", 
        title: "Advanced React Development", 
        date: "2 days ago" 
      },
      { 
        type: "internship", 
        title: "Software Engineering Intern Application", 
        date: "1 week ago" 
      }
    ]
  });

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        User Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* Learning Progress */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Box display="flex" alignItems="center" mb={2}>
              <CourseIcon color="primary" sx={{ mr: 2 }} />
              <Typography variant="h6">Learning Progress</Typography>
            </Box>
            <Typography variant="body2">
              Completed Courses: {userStats.completedCourses}
            </Typography>
            {userStats.skillProgress.map((skill) => (
              <Box key={skill.skill} sx={{ mb: 2 }}>
                <Typography variant="body2">{skill.skill}</Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={skill.progress} 
                  color={skill.progress < 50 ? "warning" : "success"}
                />
              </Box>
            ))}
          </Paper>
        </Grid>

        {/* Internship Opportunities */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Box display="flex" alignItems="center" mb={2}>
              <InternshipIcon color="secondary" sx={{ mr: 2 }} />
              <Typography variant="h6">Internship Status</Typography>
            </Box>
            <Typography variant="body2">
              Active Internships: {userStats.activeInternships}
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              fullWidth 
              sx={{ mt: 2 }}
            >
              Find New Internships
            </Button>
          </Paper>
        </Grid>

        {/* Analytics & Insights */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Box display="flex" alignItems="center" mb={2}>
              <AnalyticsIcon color="primary" sx={{ mr: 2 }} />
              <Typography variant="h6">Recent Activities</Typography>
            </Box>
            {userStats.recentActivities.map((activity, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <Typography variant="body2">
                  {activity.title}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {activity.date}
                </Typography>
                {index < userStats.recentActivities.length - 1 && <Divider sx={{ my: 1 }} />}
              </Box>
            ))}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UserDashboard;
