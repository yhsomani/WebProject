import React, { useState } from "react";
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  Chip 
} from "@mui/material";
import { 
  VrPanorama as VRIcon, 
  ViewInAr as ARIcon 
} from "@mui/icons-material";

const AR_VR_EXPERIENCES = [
  {
    id: 1,
    title: "Molecular Biology Interactive Experience",
    description: "Explore cellular structures in immersive 3D",
    type: "VR",
    difficulty: "Intermediate",
    duration: "45 minutes",
    imageUrl: "https://example.com/molecular-biology-vr.jpg",
    skills: ["Biology", "Scientific Visualization"]
  },
  {
    id: 2,
    title: "Historical Architecture AR Tour",
    description: "Walk through ancient civilizations using augmented reality",
    type: "AR",
    difficulty: "Beginner",
    duration: "30 minutes",
    imageUrl: "https://example.com/historical-architecture-ar.jpg",
    skills: ["History", "Cultural Studies"]
  }
];

const ARVRLearningExperience = () => {
  const [selectedExperience, setSelectedExperience] = useState(null);
  const [experiences, setExperiences] = useState(AR_VR_EXPERIENCES);

  const handleExperienceSelect = (experience) => {
    setSelectedExperience(experience);
  };

  const handleCloseDialog = () => {
    setSelectedExperience(null);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box 
        display="flex" 
        alignItems="center" 
        justifyContent="space-between" 
        mb={3}
      >
        <Typography variant="h4">
          Immersive Learning Experiences
        </Typography>
        <Box>
          <Chip 
            icon={<VRIcon />} 
            label="VR Experiences" 
            variant="outlined" 
            sx={{ mr: 1 }} 
          />
          <Chip 
            icon={<ARIcon />} 
            label="AR Experiences" 
            variant="outlined" 
          />
        </Box>
      </Box>

      <Grid container spacing={3}>
        {experiences.map((experience) => (
          <Grid item xs={12} md={4} key={experience.id}>
            <Card 
              elevation={3} 
              sx={{ 
                height: "100%", 
                display: "flex", 
                flexDirection: "column",
                transition: "transform 0.3s",
                "&:hover": { transform: "scale(1.05)" }
              }}
            >
              <CardMedia
                component="img"
                height="200"
                image={experience.imageUrl}
                alt={experience.title}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6">{experience.title}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {experience.description}
                </Typography>

                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                  <Chip 
                    label={experience.type} 
                    color={experience.type === "VR" ? "primary" : "secondary"} 
                    size="small" 
                  />
                  <Chip 
                    label={`${experience.difficulty} Level`} 
                    variant="outlined" 
                    size="small" 
                  />
                </Box>

                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
                  {experience.skills.map((skill) => (
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
                  Duration: {experience.duration}
                </Typography>
              </CardContent>

              <Box sx={{ p: 2 }}>
                <Button 
                  variant="contained" 
                  color="secondary" 
                  fullWidth
                  onClick={() => handleExperienceSelect(experience)}
                >
                  Start Experience
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog 
        open={!!selectedExperience} 
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        {selectedExperience && (
          <>
            <DialogTitle>
              {selectedExperience.title}
              <Typography variant="subtitle2" color="text.secondary">
                {selectedExperience.type} Learning Experience
              </Typography>
            </DialogTitle>
            <DialogContent>
              <Box 
                sx={{ 
                  height: 400, 
                  backgroundColor: "#f0f0f0", 
                  display: "flex", 
                  justifyContent: "center", 
                  alignItems: "center" 
                }}
              >
                <Typography variant="h6" color="text.secondary">
                  AR/VR Experience Placeholder
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ mt: 2 }}>
                {selectedExperience.description}
              </Typography>
              <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
                <Button variant="outlined" onClick={handleCloseDialog}>
                  Close
                </Button>
                <Button variant="contained" color="primary">
                  Launch Experience
                </Button>
              </Box>
            </DialogContent>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default ARVRLearningExperience;
