import React from "react";
import { Container, Typography, Grid, Paper, Button } from "@mui/material";

const AdminDashboard = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Admin Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="h6" gutterBottom>Course Management</Typography>
            <Button variant="contained" color="primary">
              Manage Courses
            </Button>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="h6" gutterBottom>User Management</Typography>
            <Button variant="contained" color="secondary">
              Manage Users
            </Button>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3, textAlign: "center" }}>
            <Typography variant="h6" gutterBottom>Internship Listings</Typography>
            <Button variant="contained" color="primary">
              Manage Internships
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminDashboard;
