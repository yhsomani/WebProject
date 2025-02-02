import React from "react";
import { Container, Typography, Grid, Card, CardContent, CardActions, Button } from "@mui/material";

const CoursesPage = () => {
  // Placeholder courses data
  const courses = [
    { id: 1, title: "Web Development Fundamentals", description: "Learn the basics of web development" },
    { id: 2, title: "Advanced React", description: "Master React and modern web technologies" },
    { id: 3, title: "Node.js Backend Development", description: "Build scalable backend applications" }
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Available Courses
      </Typography>
      
      <Grid container spacing={3}>
        {courses.map((course) => (
          <Grid item xs={12} md={4} key={course.id}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h5" component="div">
                  {course.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {course.description}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary">
                  Learn More
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default CoursesPage;
