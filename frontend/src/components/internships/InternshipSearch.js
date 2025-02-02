import React, { useState, useEffect } from "react";
import { 
  Box, 
  TextField, 
  Button, 
  Grid, 
  Typography, 
  Card, 
  CardContent, 
  Chip, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel 
} from "@mui/material";

const MOCK_INTERNSHIPS = [
  {
    id: 1,
    title: "Software Engineering Intern",
    company: "Tech Innovations Inc.",
    location: "Remote",
    skills: ["React", "Node.js", "MongoDB"],
    type: "Full-time",
    duration: "3-6 months"
  },
  {
    id: 2,
    title: "Data Science Intern",
    company: "Analytics Dynamics",
    location: "San Francisco, CA",
    skills: ["Python", "Machine Learning", "Data Visualization"],
    type: "Part-time",
    duration: "2-3 months"
  }
];

const InternshipSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [skillFilter, setSkillFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [filteredInternships, setFilteredInternships] = useState(MOCK_INTERNSHIPS);

  const handleSearch = () => {
    const filtered = MOCK_INTERNSHIPS.filter(internship => 
      internship.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (skillFilter === "" || internship.skills.includes(skillFilter)) &&
      (locationFilter === "" || internship.location.toLowerCase().includes(locationFilter.toLowerCase()))
    );
    setFilteredInternships(filtered);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Internship Opportunities
      </Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            label="Search Internships"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <FormControl fullWidth>
            <InputLabel>Skill</InputLabel>
            <Select
              value={skillFilter}
              label="Skill"
              onChange={(e) => setSkillFilter(e.target.value)}
            >
              <MenuItem value="">All Skills</MenuItem>
              <MenuItem value="React">React</MenuItem>
              <MenuItem value="Node.js">Node.js</MenuItem>
              <MenuItem value="Python">Python</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            label="Location"
            variant="outlined"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} md={2}>
          <Button 
            fullWidth 
            variant="contained" 
            color="primary" 
            sx={{ height: "100%" }}
            onClick={handleSearch}
          >
            Search
          </Button>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {filteredInternships.map((internship) => (
          <Grid item xs={12} md={4} key={internship.id}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h6">{internship.title}</Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  {internship.company}
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 2 }}>
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
                <Box sx={{ mt: 2, display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2">
                    Location: {internship.location}
                  </Typography>
                  <Typography variant="body2">
                    Duration: {internship.duration}
                  </Typography>
                </Box>
                <Button 
                  variant="contained" 
                  color="secondary" 
                  fullWidth 
                  sx={{ mt: 2 }}
                >
                  Apply Now
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default InternshipSearch;
