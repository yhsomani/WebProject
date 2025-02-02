import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Stepper,
  Step,
  StepLabel,
  LinearProgress,
  Chip,
  Avatar,
  useTheme,
  CardActionArea
} from '@mui/material';
import {
  Code as CodeIcon,
  DataObject as DataIcon,
  Cloud as CloudIcon,
  Security as SecurityIcon,
  Devices as DevicesIcon,
  Architecture as ArchitectureIcon
} from '@mui/icons-material';

const paths = [
  {
    id: 1,
    title: 'Full Stack Development',
    description: 'Master both frontend and backend development',
    icon: CodeIcon,
    progress: 65,
    image: '/images/fullstack.jpg',
    steps: [
      'HTML, CSS & JavaScript',
      'React & Modern Frontend',
      'Node.js & Express',
      'Databases & APIs',
      'DevOps & Deployment'
    ],
    skills: ['React', 'Node.js', 'MongoDB', 'Express', 'AWS'],
    duration: '6 months'
  },
  {
    id: 2,
    title: 'Data Science',
    description: 'Learn data analysis, ML, and visualization',
    icon: DataIcon,
    progress: 45,
    image: '/images/datascience.jpg',
    steps: [
      'Python Programming',
      'Data Analysis with Pandas',
      'Machine Learning Basics',
      'Deep Learning',
      'Data Visualization'
    ],
    skills: ['Python', 'Pandas', 'Scikit-learn', 'TensorFlow', 'Matplotlib'],
    duration: '8 months'
  },
  {
    id: 3,
    title: 'Cloud Computing',
    description: 'Build and deploy cloud-native applications',
    icon: CloudIcon,
    progress: 30,
    image: '/images/cloud.jpg',
    steps: [
      'Cloud Fundamentals',
      'AWS Services',
      'Cloud Architecture',
      'DevOps Practices',
      'Serverless Computing'
    ],
    skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD'],
    duration: '6 months'
  },
  {
    id: 4,
    title: 'Cybersecurity',
    description: 'Learn to protect systems and networks',
    icon: SecurityIcon,
    progress: 20,
    image: '/images/security.jpg',
    steps: [
      'Security Fundamentals',
      'Network Security',
      'Ethical Hacking',
      'Security Tools',
      'Incident Response'
    ],
    skills: ['Network Security', 'Penetration Testing', 'Cryptography', 'Security Tools', 'Risk Assessment'],
    duration: '7 months'
  },
  {
    id: 5,
    title: 'Mobile Development',
    description: 'Create native and cross-platform mobile apps',
    icon: DevicesIcon,
    progress: 15,
    image: '/images/mobile.jpg',
    steps: [
      'Mobile UI/UX',
      'React Native',
      'Native APIs',
      'App Publishing',
      'Performance'
    ],
    skills: ['React Native', 'iOS', 'Android', 'Mobile UI', 'App Store'],
    duration: '5 months'
  },
  {
    id: 6,
    title: 'System Design',
    description: 'Design scalable and reliable systems',
    icon: ArchitectureIcon,
    progress: 10,
    image: '/images/system-design.jpg',
    steps: [
      'System Components',
      'Scalability',
      'High Availability',
      'Data Storage',
      'System Integration'
    ],
    skills: ['Architecture', 'Scalability', 'Distributed Systems', 'Load Balancing', 'Caching'],
    duration: '4 months'
  }
];

const LearningPathCard = ({ path }) => {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[8]
        }
      }}
    >
      <CardActionArea onClick={() => setExpanded(!expanded)}>
        <CardMedia
          component="img"
          height="140"
          image={path.image}
          alt={path.title}
        />
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            <path.icon sx={{ fontSize: 30, color: theme.palette.primary.main, mr: 1 }} />
            <Typography variant="h6" component="h2">
              {path.title}
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" paragraph>
            {path.description}
          </Typography>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Progress
            </Typography>
            <LinearProgress
              variant="determinate"
              value={path.progress}
              sx={{ height: 8, borderRadius: 4 }}
            />
            <Typography variant="body2" color="text.secondary" align="right" sx={{ mt: 0.5 }}>
              {path.progress}%
            </Typography>
          </Box>
          {expanded && (
            <>
              <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                Learning Path Steps:
              </Typography>
              <Stepper activeStep={Math.floor(path.progress / 20)} orientation="vertical" sx={{ mt: 2 }}>
                {path.steps.map((step, index) => (
                  <Step key={index}>
                    <StepLabel>{step}</StepLabel>
                  </Step>
                ))}
              </Stepper>
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Skills you'll learn:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {path.skills.map((skill, index) => (
                    <Chip
                      key={index}
                      label={skill}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </Box>
            </>
          )}
        </CardContent>
      </CardActionArea>
      <Box sx={{ p: 2, mt: 'auto' }}>
        <Button
          variant="contained"
          fullWidth
          color="primary"
        >
          {path.progress > 0 ? 'Continue Learning' : 'Start Learning'}
        </Button>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 1 }}>
          Duration: {path.duration}
        </Typography>
      </Box>
    </Card>
  );
};

const LearningPaths = () => {
  return (
    <Box sx={{ minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
          Learning Paths
        </Typography>
        <Grid container spacing={4}>
          {paths.map((path) => (
            <Grid item key={path.id} xs={12} sm={6} md={4}>
              <LearningPathCard path={path} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default LearningPaths;
