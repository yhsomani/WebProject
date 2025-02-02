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
  DialogActions, 
  TextField, 
  Chip 
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";

const MOCK_PROJECTS = [
  {
    id: 1,
    title: "E-commerce Platform",
    description: "Full-stack e-commerce application with payment integration",
    technologies: ["React", "Node.js", "MongoDB", "Stripe"],
    githubLink: "https://github.com/username/ecommerce-project",
    liveLink: "https://ecommerce-demo.netlify.app"
  },
  {
    id: 2,
    title: "Machine Learning Recommendation System",
    description: "Collaborative filtering recommendation engine",
    technologies: ["Python", "TensorFlow", "Scikit-learn"],
    githubLink: "https://github.com/username/ml-recommender",
    liveLink: null
  }
];

const ProjectPortfolio = () => {
  const [projects, setProjects] = useState(MOCK_PROJECTS);
  const [openModal, setOpenModal] = useState(false);
  const [newProject, setNewProject] = useState({
    title: "",
    description: "",
    technologies: "",
    githubLink: "",
    liveLink: ""
  });

  const handleAddProject = () => {
    const projectToAdd = {
      ...newProject,
      id: projects.length + 1,
      technologies: newProject.technologies.split(",").map(tech => tech.trim())
    };
    setProjects([...projects, projectToAdd]);
    setOpenModal(false);
    setNewProject({
      title: "",
      description: "",
      technologies: "",
      githubLink: "",
      liveLink: ""
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box 
        display="flex" 
        justifyContent="space-between" 
        alignItems="center" 
        mb={3}
      >
        <Typography variant="h4">
          Project Portfolio
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setOpenModal(true)}
        >
          Add Project
        </Button>
      </Box>

      <Grid container spacing={3}>
        {projects.map((project) => (
          <Grid item xs={12} md={4} key={project.id}>
            <Card elevation={3} sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" gutterBottom>
                  {project.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {project.description}
                </Typography>

                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
                  {project.technologies.map((tech) => (
                    <Chip 
                      key={tech} 
                      label={tech} 
                      size="small" 
                      color="primary" 
                      variant="outlined" 
                    />
                  ))}
                </Box>
              </CardContent>

              <Box sx={{ p: 2, display: "flex", justifyContent: "space-between" }}>
                {project.githubLink && (
                  <Button 
                    variant="outlined" 
                    color="primary" 
                    size="small"
                    href={project.githubLink}
                    target="_blank"
                  >
                    GitHub
                  </Button>
                )}
                {project.liveLink && (
                  <Button 
                    variant="contained" 
                    color="secondary" 
                    size="small"
                    href={project.liveLink}
                    target="_blank"
                  >
                    Live Demo
                  </Button>
                )}
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle>Add New Project</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Project Title"
            fullWidth
            variant="outlined"
            value={newProject.title}
            onChange={(e) => setNewProject({...newProject, title: e.target.value})}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={newProject.description}
            onChange={(e) => setNewProject({...newProject, description: e.target.value})}
          />
          <TextField
            margin="dense"
            label="Technologies (comma-separated)"
            fullWidth
            variant="outlined"
            value={newProject.technologies}
            onChange={(e) => setNewProject({...newProject, technologies: e.target.value})}
          />
          <TextField
            margin="dense"
            label="GitHub Link"
            fullWidth
            variant="outlined"
            value={newProject.githubLink}
            onChange={(e) => setNewProject({...newProject, githubLink: e.target.value})}
          />
          <TextField
            margin="dense"
            label="Live Demo Link (Optional)"
            fullWidth
            variant="outlined"
            value={newProject.liveLink}
            onChange={(e) => setNewProject({...newProject, liveLink: e.target.value})}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddProject} color="primary" variant="contained">
            Add Project
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProjectPortfolio;
