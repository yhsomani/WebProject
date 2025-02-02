import React from "react";
import { Container, Typography, Grid, Card, CardContent, CardActions, Button } from "@mui/material";

const InternshipsPage = () => {
  // Placeholder internships data
  const internships = [
    { id: 1, title: "Frontend Developer", company: "Tech Innovations Inc.", description: "React and modern web technologies" },
    { id: 2, title: "Backend Engineer", company: "Cloud Solutions Ltd.", description: "Node.js and microservices architecture" },
    { id: 3, title: "Data Science Intern", company: "Analytics Dynamics", description: "Machine learning and data analysis" }
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Available Internships
      </Typography>
      
      <Grid container spacing={3}>
        {internships.map((internship) => (
          <Grid item xs={12} md={4} key={internship.id}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h5" component="div">
                  {internship.title}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  {internship.company}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {internship.description}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary">
                  Apply Now
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default InternshipsPage;
