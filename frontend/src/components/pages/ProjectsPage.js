import React from "react";
import { Container, Typography, Grid, Card, CardContent, CardActions, Button } from "@mui/material";

const ProjectsPage = () => {
  // Placeholder projects data
  const projects = [
    { id: 1, title: "E-commerce Platform", description: "Full-stack e-commerce application" },
    { id: 2, title: "Social Media Dashboard", description: "Real-time social media analytics tool" },
    { id: 3, title: "IoT Device Management", description: "Cloud-based IoT device monitoring system" }
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Project Showcase
      </Typography>
      
      <Grid container spacing={3}>
        {projects.map((project) => (
          <Grid item xs={12} md={4} key={project.id}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h5" component="div">
                  {project.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {project.description}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary">
                  View Details
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ProjectsPage;
