import React from 'react';
import { 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  Button, 
  Chip, 
  Box 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { enrollCourse } from '../../redux/actions/courseActions';

function CourseCard({ course }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleEnroll = () => {
    dispatch(enrollCourse(course.id));
  };

  const handleCourseDetails = () => {
    navigate(`/courses/${course.id}`);
  };

  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        transition: 'transform 0.3s',
        '&:hover': {
          transform: 'scale(1.05)'
        }
      }}
    >
      <CardMedia
        component="img"
        height="200"
        image={course.thumbnailUrl || '/default-course-image.png'}
        alt={course.title}
      />
      
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" component="div">
          {course.title}
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {course.description.slice(0, 100)}...
        </Typography>

        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
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
            label={`${course.duration} hours`} 
            color="info" 
            size="small" 
          />
        </Box>

        <Typography variant="h6" color="primary">
          ${course.price}
        </Typography>
      </CardContent>

      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between' }}>
        <Button 
          variant="outlined" 
          color="primary" 
          onClick={handleCourseDetails}
        >
          View Details
        </Button>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleEnroll}
        >
          Enroll Now
        </Button>
      </Box>
    </Card>
  );
}

export default CourseCard;
