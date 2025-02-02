import React from "react";
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Paper,
  useTheme,
  CardActionArea
} from "@mui/material";
import {
  School as SchoolIcon,
  TrendingUp as TrendingUpIcon,
  Psychology as PsychologyIcon,
  Work as WorkIcon,
  Timeline as TimelineIcon,
  Dashboard as DashboardIcon
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const FeatureCard = ({ title, description, icon: Icon, path, image }) => {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.2s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: theme.shadows[8]
        }
      }}
    >
      <CardActionArea onClick={() => navigate(path)} sx={{ flexGrow: 1 }}>
        <CardMedia
          component="img"
          height="140"
          image={image}
          alt={title}
          sx={{ objectFit: "cover" }}
        />
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            <Icon sx={{ fontSize: 30, color: theme.palette.primary.main, mr: 1 }} />
            <Typography variant="h6" component="h2">
              {title}
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

const HomePage = () => {
  const theme = useTheme();

  const features = [
    {
      title: "Learning Paths",
      description: "Personalized learning journeys tailored to your career goals",
      icon: SchoolIcon,
      path: "/learning-paths",
      image: "/images/learning-paths.jpg"
    },
    {
      title: "Analytics Dashboard",
      description: "Track your progress and learning metrics in real-time",
      icon: DashboardIcon,
      path: "/analytics",
      image: "/images/analytics.jpg"
    },
    {
      title: "Skill Assessment",
      description: "Evaluate your skills and identify areas for improvement",
      icon: PsychologyIcon,
      path: "/assessment",
      image: "/images/assessment.jpg"
    },
    {
      title: "Recommendations",
      description: "Get personalized course and content recommendations",
      icon: TrendingUpIcon,
      path: "/recommendations",
      image: "/images/recommendations.jpg"
    },
    {
      title: "Progress Timeline",
      description: "Visualize your learning journey and achievements",
      icon: TimelineIcon,
      path: "/timeline",
      image: "/images/timeline.jpg"
    },
    {
      title: "Internship Matching",
      description: "Find internship opportunities matching your skills",
      icon: WorkIcon,
      path: "/internships",
      image: "/images/internships.jpg"
    }
  ];

  return (
    <Box sx={{ minHeight: "100vh", pb: 6 }}>
      {/* Hero Section */}
      <Paper
        elevation={0}
        sx={{
          position: "relative",
          backgroundColor: "grey.800",
          color: "#fff",
          mb: 4,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundImage: "url(/images/hero-bg.jpg)",
          py: 8
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            bottom: 0,
            right: 0,
            left: 0,
            backgroundColor: "rgba(0,0,0,.5)",
          }}
        />
        <Container maxWidth="lg">
          <Grid container>
            <Grid item md={8} xs={12}>
              <Box
                sx={{
                  position: "relative",
                  p: { xs: 3, md: 6 },
                }}
              >
                <Typography variant="h2" color="inherit" gutterBottom>
                  Welcome to Your Learning Journey
                </Typography>
                <Typography variant="h5" color="inherit" paragraph>
                  Discover personalized learning paths, track your progress, and achieve your career goals
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  sx={{ mt: 2 }}
                  onClick={() => navigate("/learning-paths")}
                >
                  Start Learning
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Paper>

      {/* Features Grid */}
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item key={index} xs={12} sm={6} md={4}>
              <FeatureCard {...feature} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default HomePage;
