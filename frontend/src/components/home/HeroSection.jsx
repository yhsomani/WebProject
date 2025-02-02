import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button, Typography, Box } from '@mui/material';

function HeroSection({ isAuthenticated }) {
  const navigate = useNavigate();

  const handleSignUp = () => {
    navigate(isAuthenticated ? '/dashboard' : '/register');
  };

  const handleExploreCourses = () => {
    navigate('/courses');
  };

  const heroVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  return (
    <Box 
      sx={{
        position: 'relative',
        height: '85vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        background: 'linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)',
        color: 'white',
        overflow: 'hidden'
      }}
    >
      <motion.div
        initial="hidden"
        animate="visible"
        variants={heroVariants}
      >
        <Typography 
          variant="h2" 
          component="h1" 
          sx={{ 
            fontWeight: 'bold', 
            mb: 3,
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)' 
          }}
        >
          Learn. Build. Grow.
        </Typography>
        
        <Typography 
          variant="h5" 
          sx={{ 
            mb: 4, 
            maxWidth: 600, 
            mx: 'auto',
            opacity: 0.9 
          }}
        >
          Transform your potential into professional success with our integrated learning and internship platform
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button 
            variant="contained" 
            color="secondary"
            size="large"
            onClick={handleSignUp}
            sx={{ 
              px: 4, 
              py: 1.5,
              fontWeight: 'bold',
              borderRadius: 3
            }}
          >
            {isAuthenticated ? 'My Dashboard' : 'Sign Up'}
          </Button>

          <Button 
            variant="outlined" 
            color="inherit"
            size="large"
            onClick={handleExploreCourses}
            sx={{ 
              px: 4, 
              py: 1.5,
              fontWeight: 'bold',
              borderRadius: 3,
              color: 'white',
              borderColor: 'white'
            }}
          >
            Explore Courses
          </Button>
        </Box>
      </motion.div>
    </Box>
  );
}

export default HeroSection;
