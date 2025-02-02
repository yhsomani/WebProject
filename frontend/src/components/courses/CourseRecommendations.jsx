import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Chip, 
  Button 
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { recommendCourses, enrollCourse } from '../../redux/actions/courseActions';
import { motion } from 'framer-motion';

function CourseRecommendations() {
  const dispatch = useDispatch();
  const { recommendedCourses, loading, error } = useSelector(state => state.courses);
  const [selectedCourses, setSelectedCourses] = useState([]);

  useEffect(() => {
    dispatch(recommendCourses());
  }, [dispatch]);

  const handleEnroll = (courseId) => {
    dispatch(enrollCourse(courseId));
  };

  const handleSelectCourse = (courseId) => {
    setSelectedCourses(prev => 
      prev.includes(courseId)
        ? prev.filter(id => id !== courseId)
        : [...prev, courseId]
    );
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100
      }
    }
  };

  if (loading) return <Typography>Loading recommendations...</Typography>;
  if (error) return <Typography color="error">Error loading recommendations</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Personalized Course Recommendations
      </Typography>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Grid container spacing={3}>
          {recommendedCourses.map(course => (
            <Grid item xs={12} sm={6} md={4} key={course.id}>
              <motion.div variants={itemVariants}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    border: selectedCourses.includes(course.id) 
                      ? '2px solid primary.main' 
                      : '1px solid divider'
                  }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={course.thumbnailUrl || '/default-course-image.png'}
                    alt={course.title}
                  />
                  
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6">{course.title}</Typography>
                    
                    <Box sx={{ display: 'flex', gap: 1, my: 1 }}>
                      <Chip 
                        label={course.skillLevel} 
                        color={
                          course.skillLevel === 'beginner' ? 'primary' : 
                          course.skillLevel === 'intermediate' ? 'secondary' : 
                          'error'
                        } 
                        size="small" 
                      />
                      <Chip 
                        label={course.recommendationReason} 
                        color="info" 
                        size="small" 
                      />
                    </Box>

                    <Typography variant="body2" color="text.secondary">
                      {course.description.slice(0, 100)}...
                    </Typography>
                  </CardContent>

                  <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between' }}>
                    <Button 
                      variant={selectedCourses.includes(course.id) ? 'contained' : 'outlined'}
                      color="primary"
                      onClick={() => handleSelectCourse(course.id)}
                    >
                      {selectedCourses.includes(course.id) ? 'Selected' : 'Select'}
                    </Button>
                    <Button 
                      variant="contained" 
                      color="secondary"
                      onClick={() => handleEnroll(course.id)}
                    >
                      Enroll
                    </Button>
                  </Box>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </motion.div>

      {selectedCourses.length > 0 && (
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Button 
            variant="contained" 
            color="primary" 
            size="large"
          >
            Create Learning Path with {selectedCourses.length} Courses
          </Button>
        </Box>
      )}
    </Box>
  );
}

export default CourseRecommendations;
