import React, { useState } from "react";
import { 
  Box, 
  Typography, 
  Stepper, 
  Step, 
  StepLabel, 
  StepContent, 
  Button, 
  Paper, 
  Radio, 
  RadioGroup, 
  FormControlLabel, 
  FormControl, 
  FormLabel 
} from "@mui/material";

const SKILL_ASSESSMENT_DATA = {
  title: "Web Development Skill Assessment",
  description: "Evaluate your current skills and get personalized learning recommendations",
  questions: [
    {
      id: 1,
      question: "How comfortable are you with HTML and CSS?",
      options: [
        "Beginner (Just starting)",
        "Intermediate (Basic understanding)",
        "Advanced (Proficient)"
      ]
    },
    {
      id: 2,
      question: "What is your experience with JavaScript?",
      options: [
        "No experience",
        "Basic knowledge",
        "Comfortable with core concepts",
        "Advanced programming"
      ]
    },
    {
      id: 3,
      question: "Have you worked with any JavaScript frameworks?",
      options: [
        "Never used",
        "Familiar with React",
        "Experienced with React/Vue/Angular",
        "Multiple framework expertise"
      ]
    }
  ]
};

const SkillAssessment = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [assessmentComplete, setAssessmentComplete] = useState(false);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleSubmit = () => {
    // In a real-world scenario, this would send data to backend
    console.log("Assessment Answers:", answers);
    setAssessmentComplete(true);
  };

  const renderSkillLevel = () => {
    // Basic skill level calculation logic
    const totalScore = Object.values(answers).length;
    if (totalScore <= 1) return "Beginner";
    if (totalScore <= 2) return "Intermediate";
    return "Advanced";
  };

  const renderLearningPath = () => {
    const skillLevel = renderSkillLevel();
    const paths = {
      "Beginner": [
        "HTML & CSS Fundamentals Course",
        "JavaScript Basics Workshop",
        "Intro to Web Development"
      ],
      "Intermediate": [
        "Advanced JavaScript Techniques",
        "React.js Fundamentals",
        "Responsive Web Design"
      ],
      "Advanced": [
        "Full Stack Web Development",
        "Advanced React Patterns",
        "Performance Optimization"
      ]
    };

    return paths[skillLevel];
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {SKILL_ASSESSMENT_DATA.title}
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        {SKILL_ASSESSMENT_DATA.description}
      </Typography>

      {!assessmentComplete ? (
        <Stepper activeStep={activeStep} orientation="vertical">
          {SKILL_ASSESSMENT_DATA.questions.map((question) => (
            <Step key={question.id}>
              <StepLabel>{`Question ${question.id}`}</StepLabel>
              <StepContent>
                <FormControl component="fieldset" fullWidth>
                  <FormLabel component="legend">{question.question}</FormLabel>
                  <RadioGroup
                    value={answers[question.id] || ""}
                    onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                  >
                    {question.options.map((option) => (
                      <FormControlLabel 
                        key={option} 
                        value={option} 
                        control={<Radio />} 
                        label={option} 
                      />
                    ))}
                  </RadioGroup>
                </FormControl>
                <Box sx={{ mb: 2 }}>
                  <div>
                    <Button
                      variant="contained"
                      onClick={handleNext}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      {activeStep === SKILL_ASSESSMENT_DATA.questions.length - 1 
                        ? "Finish" 
                        : "Continue"}
                    </Button>
                    <Button
                      disabled={activeStep === 0}
                      onClick={handleBack}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      Back
                    </Button>
                  </div>
                </Box>
              </StepContent>
            </Step>
          ))}
        </Stepper>
      ) : (
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Assessment Results
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Your Skill Level: <strong>{renderSkillLevel()}</strong>
          </Typography>
          <Typography variant="subtitle1">Recommended Learning Path:</Typography>
          <ul>
            {renderLearningPath().map((path) => (
              <li key={path}>{path}</li>
            ))}
          </ul>
          <Button 
            variant="contained" 
            color="primary" 
            sx={{ mt: 2 }}
          >
            Start Learning
          </Button>
        </Paper>
      )}
    </Box>
  );
};

export default SkillAssessment;
