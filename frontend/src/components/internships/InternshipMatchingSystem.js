import React, { useState, useEffect } from "react";
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Chip, 
  Button, 
  Slider, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  Autocomplete,
  TextField
} from "@mui/material";

const MOCK_INTERNSHIPS = [
  {
    id: 1,
    title: "Software Engineering Intern",
    company: "Tech Innovations Inc.",
    skills: ["React", "Node.js", "MongoDB"],
    location: "San Francisco, CA",
    matchScore: 85,
    compensation: "$25/hour",
    duration: "3-6 months"
  },
  {
    id: 2,
    title: "Data Science Intern",
    company: "Analytics Dynamics",
    skills: ["Python", "Machine Learning", "Data Visualization"],
    location: "New York, NY",
    matchScore: 70,
    compensation: "$22/hour",
    duration: "2-4 months"
  }
];

const SKILL_OPTIONS = [
  "React", "Node.js", "Python", "Machine Learning", 
  "Data Science", "JavaScript", "TypeScript", "SQL"
];

const InternshipMatchingSystem = () => {
  const [filters, setFilters] = useState({
    skills: [],
    location: "",
    matchScore: 50,
    compensation: [10, 50]
  });

  const [matchedInternships, setMatchedInternships] = useState(MOCK_INTERNSHIPS);

  const handleFilterChange = (prop) => (event, newValue) => {
    setFilters({ ...filters, [prop]: newValue });
  };

  const applyFilters = () => {
    const filtered = MOCK_INTERNSHIPS.filter(internship => 
      (filters.skills.length === 0 || 
        filters.skills.some(skill => internship.skills.includes(skill))) &&
      (filters.location === "" || 
        internship.location.toLowerCase().includes(filters.location.toLowerCase())) &&
      internship.matchScore >= filters.matchScore &&
      parseInt(internship.compensation.replace("$", "").replace("/hour", "")) >= filters.compensation[0] &&
      parseInt(internship.compensation.replace("$", "").replace("/hour", "")) <= filters.compensation[1]
    );

    setMatchedInternships(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [filters]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Internship Matching System
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Autocomplete
            multiple
            options={SKILL_OPTIONS}
            value={filters.skills}
            onChange={(event, newValue) => {
              setFilters({ ...filters, skills: newValue });
            }}
            renderInput={(params) => (
              <TextField {...params} label="Skills" variant="outlined" />
            )}
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="Location"
            variant="outlined"
            value={filters.location}
            onChange={(e) => setFilters({ ...filters, location: e.target.value })}
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <Typography gutterBottom>Minimum Match Score</Typography>
          <Slider
            value={filters.matchScore}
            onChange={handleFilterChange("matchScore")}
            valueLabelDisplay="auto"
            min={0}
            max={100}
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <Typography gutterBottom>Hourly Compensation Range</Typography>
          <Slider
            value={filters.compensation}
            onChange={handleFilterChange("compensation")}
            valueLabelDisplay="auto"
            min={10}
            max={100}
            valueLabelFormat={(value) => `$${value}/hr`}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {matchedInternships.map((internship) => (
          <Grid item xs={12} md={4} key={internship.id}>
            <Card elevation={3} sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6">{internship.title}</Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  {internship.company}
                </Typography>

                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, my: 2 }}>
                  {internship.skills.map((skill) => (
                    <Chip 
                      key={skill} 
                      label={skill} 
                      size="small" 
                      color="primary" 
                      variant="outlined" 
                    />
                  ))}
                </Box>

                <Typography variant="body2">
                  Location: {internship.location}
                </Typography>
                <Typography variant="body2">
                  Compensation: {internship.compensation}
                </Typography>
                <Typography variant="body2">
                  Duration: {internship.duration}
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                  <Typography variant="body2" sx={{ mr: 2 }}>
                    Match Score:
                  </Typography>
                  <Chip 
                    label={`${internship.matchScore}%`} 
                    color={internship.matchScore > 80 ? "success" : "warning"} 
                    size="small" 
                  />
                </Box>
              </CardContent>

              <Box sx={{ p: 2 }}>
                <Button 
                  variant="contained" 
                  color="secondary" 
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

export default InternshipMatchingSystem;
