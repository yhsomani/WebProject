import React, { useState } from "react";
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Button, 
  Stepper, 
  Step, 
  StepLabel, 
  StepContent,
  TextField,
  Chip
} from "@mui/material";
import { 
  VerifiedUser as CertificateIcon, 
  CheckCircle as CompleteIcon 
} from "@mui/icons-material";

const BlockchainCertification = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [certificationSteps, setCertificationSteps] = useState([
    {
      label: "Course Completion",
      description: "Complete the Blockchain Fundamentals course",
      completed: false
    },
    {
      label: "Project Submission",
      description: "Submit a blockchain project demonstrating practical skills",
      completed: false
    },
    {
      label: "Peer Review",
      description: "Get your project reviewed by industry experts",
      completed: false
    },
    {
      label: "Final Certification",
      description: "Receive your blockchain certification on the blockchain",
      completed: false
    }
  ]);

  const handleStepCompletion = (stepIndex) => {
    const updatedSteps = [...certificationSteps];
    updatedSteps[stepIndex].completed = true;
    setCertificationSteps(updatedSteps);
    
    if (stepIndex < certificationSteps.length - 1) {
      setActiveStep(stepIndex + 1);
    }
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
          Blockchain Certification Program
        </Typography>
        <Chip 
          icon={<CertificateIcon />} 
          label="Blockchain Verified" 
          color="primary" 
        />
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card elevation={3}>
            <CardContent>
              <Stepper activeStep={activeStep} orientation="vertical">
                {certificationSteps.map((step, index) => (
                  <Step key={step.label} completed={step.completed}>
                    <StepLabel 
                      optional={
                        step.completed ? (
                          <Typography variant="caption" color="success">
                            Step completed
                          </Typography>
                        ) : null
                      }
                    >
                      {step.label}
                    </StepLabel>
                    <StepContent>
                      <Typography>{step.description}</Typography>
                      {!step.completed && (
                        <Box sx={{ mb: 2, mt: 1 }}>
                          {index === 0 && (
                            <Button
                              variant="contained"
                              onClick={() => handleStepCompletion(index)}
                              sx={{ mt: 1, mr: 1 }}
                            >
                              Start Course
                            </Button>
                          )}
                          {index === 1 && (
                            <TextField
                              fullWidth
                              label="Project GitHub/Repository Link"
                              variant="outlined"
                              sx={{ mt: 2 }}
                              onBlur={() => handleStepCompletion(index)}
                            />
                          )}
                          {index === 2 && (
                            <Button
                              variant="contained"
                              onClick={() => handleStepCompletion(index)}
                              sx={{ mt: 1, mr: 1 }}
                            >
                              Submit for Review
                            </Button>
                          )}
                        </Box>
                      )}
                    </StepContent>
                  </Step>
                ))}
              </Stepper>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Certification Details
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <CompleteIcon color="success" sx={{ mr: 2 }} />
                <Typography>
                  Blockchain Fundamentals
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <CompleteIcon color="success" sx={{ mr: 2 }} />
                <Typography>
                  Smart Contract Development
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <CompleteIcon color="success" sx={{ mr: 2 }} />
                <Typography>
                  Decentralized Applications
                </Typography>
              </Box>

              <Button 
                variant="contained" 
                color="primary" 
                fullWidth 
                sx={{ mt: 3 }}
                disabled={!certificationSteps.every(step => step.completed)}
              >
                Generate Blockchain Certificate
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BlockchainCertification;
