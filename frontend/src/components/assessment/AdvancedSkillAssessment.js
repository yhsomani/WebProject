import React, { useState, useEffect } from "react";
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Button, 
  LinearProgress, 
  Chip, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions 
} from "@mui/material";
import { 
  Assessment as AssessmentIcon, 
  Quiz as QuizIcon, 
  EmojiEvents as EmojiEventsIcon 
} from "@mui/icons-material";

const MOCK_SKILL_ASSESSMENT_DATA = {
  technicalSkills: [
    { 
      skill: "React Development", 
      level: "Advanced", 
      score: 85, 
      strengths: ["Component Design", "State Management"],
      improvements: ["Performance Optimization"]
    },
    { 
      skill: "Machine Learning", 
      level: "Intermediate", 
      score: 65, 
      strengths: ["Algorithm Understanding"],
      improvements: ["Practical Implementation", "Advanced Techniques"]
    }
  ],
  softSkills: [
    { 
      skill: "Communication", 
      level: "Strong", 
      score: 75 
    },
    { 
      skill: "Teamwork", 
      level: "Excellent", 
      score: 90 
    }
  ],
  certifications: [
    {
      name: "React Professional",
      issuer: "Tech Certification Board",
      dateEarned: "2024-01-15",
      validUntil: "2026-01-15"
    }
  ]
};

const AdvancedSkillAssessment = () => {
  const [assessmentData, setAssessmentData] = useState(MOCK_SKILL_ASSESSMENT_DATA);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  const handleOpenSkillDetails = (skill) => {
    setSelectedSkill(skill);
    setOpenDetailsDialog(true);
  };

  const renderSkillProgress = (skill) => (
    <Box key={skill.skill} sx={{ mb: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="body2">{skill.skill}</Typography>
        <Chip 
          label={skill.level} 
          size="small" 
          color={
            skill.level.toLowerCase().includes("beginner") ? "warning" : 
            skill.level.toLowerCase().includes("intermediate") ? "info" : 
            "success"
          } 
        />
      </Box>
      <LinearProgress 
        variant="determinate" 
        value={skill.score} 
        color={
          skill.score < 50 ? "warning" : 
          skill.score < 75 ? "info" : 
          "success"
        }
        sx={{ mt: 1 }}
      />
    </Box>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box 
        display="flex" 
        alignItems="center" 
        justifyContent="space-between" 
        mb={3}
      >
        <Typography variant="h4">
          Advanced Skill Assessment
        </Typography>
        <Chip 
          icon={<AssessmentIcon />} 
          label="Comprehensive Evaluation" 
          color="primary" 
        />
      </Box>

      <Grid container spacing={3}>
        {/* Technical Skills */}
        <Grid item xs={12} md={4}>
          <Card elevation={3} sx={{ height: "100%" }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <QuizIcon color="primary" sx={{ mr: 2 }} />
                <Typography variant="h6">Technical Skills</Typography>
              </Box>
              {assessmentData.technicalSkills.map((skill) => (
                <Box key={skill.skill}>
                  {renderSkillProgress(skill)}
                  <Button 
                    size="small" 
                    variant="outlined" 
                    onClick={() => handleOpenSkillDetails(skill)}
                    sx={{ mt: 1, mb: 2 }}
                  >
                    View Details
                  </Button>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Soft Skills */}
        <Grid item xs={12} md={4}>
          <Card elevation={3} sx={{ height: "100%" }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <EmojiEventsIcon color="secondary" sx={{ mr: 2 }} />
                <Typography variant="h6">Soft Skills</Typography>
              </Box>
              {assessmentData.softSkills.map((skill) => renderSkillProgress(skill))}
            </CardContent>
          </Card>
        </Grid>

        {/* Certifications */}
        <Grid item xs={12} md={4}>
          <Card elevation={3} sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Certifications
              </Typography>
              {assessmentData.certifications.map((cert) => (
                <Box key={cert.name} sx={{ mb: 2 }}>
                  <Typography variant="body1">{cert.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Issued by: {cert.issuer}
                  </Typography>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
                    <Chip 
                      label={`Earned: ${cert.dateEarned}`} 
                      size="small" 
                      color="primary" 
                      variant="outlined" 
                    />
                    <Chip 
                      label={`Valid Until: ${cert.validUntil}`} 
                      size="small" 
                      color="success" 
                      variant="outlined" 
                    />
                  </Box>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Skill Details Dialog */}
      <Dialog 
        open={openDetailsDialog} 
        onClose={() => setOpenDetailsDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {selectedSkill?.skill} Skill Assessment
        </DialogTitle>
        <DialogContent>
          {selectedSkill && (
            <Box>
              <Typography variant="body1" gutterBottom>
                Skill Level: {selectedSkill.level}
              </Typography>
              <Typography variant="body1" gutterBottom>
                Score: {selectedSkill.score}/100
              </Typography>
              
              {selectedSkill.strengths && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle1">Strengths:</Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {selectedSkill.strengths.map((strength) => (
                      <Chip 
                        key={strength} 
                        label={strength} 
                        color="success" 
                        size="small" 
                        variant="outlined" 
                      />
                    ))}
                  </Box>
                </Box>
              )}

              {selectedSkill.improvements && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle1">Areas for Improvement:</Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {selectedSkill.improvements.map((improvement) => (
                      <Chip 
                        key={improvement} 
                        label={improvement} 
                        color="warning" 
                        size="small" 
                        variant="outlined" 
                      />
                    ))}
                  </Box>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDetailsDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdvancedSkillAssessment;
