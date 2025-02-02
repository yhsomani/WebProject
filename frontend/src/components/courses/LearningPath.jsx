import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Stepper, 
  Step, 
  StepLabel, 
  StepContent, 
  Paper, 
  Button,
  Grid,
  Card,
  CardContent,
  LinearProgress
} from '@mui/material';
import { Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineDot, TimelineContent } from '@mui/lab';
import { useDispatch } from 'react-redux';
import { enrollCourse } from '../../redux/actions/courseActions';

function LearningPath({ selectedCourses }) {
  const dispatch = useDispatch();
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const handleEnrollCourse = (courseId) => {
    dispatch(enrollCourse(courseId));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Your Personalized Learning Path
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Stepper activeStep={activeStep} orientation="vertical">
              {selectedCourses.map((course, index) => (
                <Step key={course.id}>
                  <StepLabel>
                    {course.title}
                    <Typography variant="caption" color="text.secondary">
                      {course.skillLevel} | {course.duration} hours
                    </Typography>
                  </StepLabel>
                  <StepContent>
                    <Typography>{course.description}</Typography>
                    
                    <Box sx={{ mb: 2 }}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleEnrollCourse(course.id)}
                        sx={{ mt: 1, mr: 1 }}
                      >
                        Enroll in Course
                      </Button>
                      <Button
                        onClick={handleNext}
                        sx={{ mt: 1, mr: 1 }}
                      >
                        {index === selectedCourses.length - 1 ? 'Finish' : 'Next Course'}
                      </Button>
                      {index > 0 && (
                        <Button
                          onClick={handleBack}
                          sx={{ mt: 1, mr: 1 }}
                        >
                          Back
                        </Button>
                      )}
                    </Box>
                  </StepContent>
                </Step>
              ))}
            </Stepper>

            {activeStep === selectedCourses.length && (
              <Paper square elevation={0} sx={{ p: 3 }}>
                <Typography>Learning Path Completed!</Typography>
                <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
                  Reset Path
                </Button>
              </Paper>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Learning Path Progress</Typography>
              <LinearProgress 
                variant="determinate" 
                value={(activeStep / selectedCourses.length) * 100} 
              />
              <Typography variant="body2" color="text.secondary">
                {activeStep} of {selectedCourses.length} courses completed
              </Typography>

              <Timeline>
                {selectedCourses.map((course, index) => (
                  <TimelineItem key={course.id}>
                    <TimelineSeparator>
                      <TimelineDot 
                        color={
                          index < activeStep ? 'success' : 
                          index === activeStep ? 'primary' : 
                          'grey'
                        } 
                      />
                      {index < selectedCourses.length - 1 && <TimelineConnector />}
                    </TimelineSeparator>
                    <TimelineContent>
                      <Typography variant="body2">
                        {course.title}
                      </Typography>
                    </TimelineContent>
                  </TimelineItem>
                ))}
              </Timeline>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export default LearningPath;
