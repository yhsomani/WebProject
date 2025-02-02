import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  IconButton,
  Tab,
  Tabs,
  Paper,
  Avatar,
  Tooltip,
  CircularProgress
} from "@mui/material";
import {
  Timeline as TimelineIcon,
  TrendingUp as TrendingUpIcon,
  Assessment as AssessmentIcon,
  School as SchoolIcon,
  WorkOutline as CareerIcon,
  EmojiEvents as AchievementIcon,
  Schedule as TimeIcon,
  Speed as PerformanceIcon,
  Grade as GradeIcon
} from "@mui/icons-material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

const MOCK_ANALYTICS_DATA = {
  "learningProgress": [
    { "skill": "Web Development", "progress": 75, "level": "Advanced", "trend": [65, 68, 70, 72, 75] },
    { "skill": "Data Science", "progress": 45, "level": "Intermediate", "trend": [30, 35, 38, 42, 45] },
    { "skill": "Machine Learning", "progress": 30, "level": "Beginner", "trend": [20, 22, 25, 28, 30] },
    { "skill": "Cloud Computing", "progress": 60, "level": "Intermediate", "trend": [45, 50, 54, 58, 60] },
    { "skill": "DevOps", "progress": 55, "level": "Intermediate", "trend": [40, 45, 48, 52, 55] }
  ],
  "careerPathways": [
    {
      "title": "Full Stack Developer",
      "skills": ["React", "Node.js", "MongoDB", "AWS", "TypeScript"],
      "completionRate": 65,
      "recommendedCourses": 3,
      "salary": "$95,000",
      "demand": "High"
    },
    {
      "title": "Data Scientist",
      "skills": ["Python", "Machine Learning", "Statistics", "SQL", "Data Visualization"],
      "completionRate": 40,
      "recommendedCourses": 5,
      "salary": "$105,000",
      "demand": "Very High"
    },
    {
      "title": "Cloud Architect",
      "skills": ["AWS", "Azure", "Kubernetes", "Docker", "Terraform"],
      "completionRate": 35,
      "recommendedCourses": 4,
      "salary": "$120,000",
      "demand": "Very High"
    }
  ],
  "performanceMetrics": {
    "averageCompletionTime": "4 weeks",
    "coursesSatisfaction": 87,
    "skillImprovementRate": 72,
    "weeklyStudyHours": 12,
    "completedCourses": 8,
    "certificatesEarned": 5
  },
  "weeklyActivity": [
    { "day": "Mon", "hours": 2.5 },
    { "day": "Tue", "hours": 3.0 },
    { "day": "Wed", "hours": 2.0 },
    { "day": "Thu", "hours": 3.5 },
    { "day": "Fri", "hours": 2.8 },
    { "day": "Sat", "hours": 4.0 },
    { "day": "Sun", "hours": 1.5 }
  ],
  "skillDistribution": [
    { "name": "Technical", "value": 45 },
    { "name": "Soft Skills", "value": 25 },
    { "name": "Domain", "value": 20 },
    { "name": "Tools", "value": 10 }
  ]
};

const StatCard = ({ icon: Icon, title, value, subtitle, color }) => (
  <Card sx={{ height: "100%" }}>
    <CardContent>
      <Box display="flex" alignItems="center" mb={2}>
        <Avatar sx={{ bgcolor: color, mr: 2 }}>
          <Icon />
        </Avatar>
        <Typography variant="h6" component="div">
          {title}
        </Typography>
      </Box>
      <Typography variant="h4" component="div" gutterBottom>
        {value}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {subtitle}
      </Typography>
    </CardContent>
  </Card>
);

const SkillProgressCard = ({ skill, progress, level, trend }) => (
  <Card sx={{ mb: 2 }}>
    <CardContent>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
        <Typography variant="subtitle1">{skill}</Typography>
        <Chip
          label={level}
          size="small"
          color={
            level === "Advanced" ? "success" :
              level === "Intermediate" ? "primary" :
                "warning"
          }
        />
      </Box>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Box sx={{ flex: 1, mr: 2 }}>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: "rgba(0,0,0,0.1)",
              "& .MuiLinearProgress-bar": {
                borderRadius: 4
              }
            }}
          />
        </Box>
        <Typography variant="body2" color="text.secondary">
          {progress}%
        </Typography>
      </Box>
      <Box sx={{ mt: 2, height: 40 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={trend.map((value, index) => ({ name: index, value }))}>
            <Line type="monotone" dataKey="value" stroke="#8884d8" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </CardContent>
  </Card>
);

const CareerPathCard = ({ pathway }) => (
  <Card sx={{ mb: 2 }}>
    <CardContent>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">{pathway.title}</Typography>
        <Chip
          label={pathway.demand}
          color="success"
          size="small"
        />
      </Box>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Expected Salary: {pathway.salary}
      </Typography>
      <Box sx={{ my: 2 }}>
        <Typography variant="body2" gutterBottom>
          Required Skills:
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {pathway.skills.map((skill, index) => (
            <Chip
              key={index}
              label={skill}
              size="small"
              variant="outlined"
            />
          ))}
        </Box>
      </Box>
      <Box sx={{ mt: 2 }}>
        <Typography variant="body2" gutterBottom>
          Completion: {pathway.completionRate}%
        </Typography>
        <LinearProgress
          variant="determinate"
          value={pathway.completionRate}
          sx={{ height: 8, borderRadius: 4 }}
        />
      </Box>
    </CardContent>
  </Card>
);

const AdvancedAnalytics = () => {
  const [selectedPathway, setSelectedPathway] = useState("");
  const [analyticsData, setAnalyticsData] = useState(MOCK_ANALYTICS_DATA);
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Learning Analytics Dashboard
        </Typography>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Overview" icon={<AssessmentIcon />} iconPosition="start" />
          <Tab label="Skills Progress" icon={<TrendingUpIcon />} iconPosition="start" />
          <Tab label="Career Pathways" icon={<CareerIcon />} iconPosition="start" />
          <Tab label="Activity" icon={<TimelineIcon />} iconPosition="start" />
        </Tabs>
      </Box>

      {activeTab === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <StatCard
              icon={SchoolIcon}
              title="Courses"
              value={analyticsData.performanceMetrics.completedCourses}
              subtitle="Completed courses"
              color="#1976d2"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <StatCard
              icon={TimeIcon}
              title="Study Time"
              value={`${analyticsData.performanceMetrics.weeklyStudyHours}h`}
              subtitle="Weekly average"
              color="#2e7d32"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <StatCard
              icon={AchievementIcon}
              title="Certificates"
              value={analyticsData.performanceMetrics.certificatesEarned}
              subtitle="Earned certificates"
              color="#ed6c02"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <StatCard
              icon={PerformanceIcon}
              title="Performance"
              value={`${analyticsData.performanceMetrics.skillImprovementRate}%`}
              subtitle="Skill improvement rate"
              color="#9c27b0"
            />
          </Grid>

          <Grid item xs={12} md={8}>
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Weekly Activity
                </Typography>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analyticsData.weeklyActivity}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <ChartTooltip />
                      <Bar dataKey="hours" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Skill Distribution
                </Typography>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analyticsData.skillDistribution}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label
                      >
                        {analyticsData.skillDistribution.map((entry, index) => (
                          <Cell key={index} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <ChartTooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {activeTab === 1 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Skills Progress
            </Typography>
            {analyticsData.learningProgress.map((skill, index) => (
              <SkillProgressCard key={index} {...skill} />
            ))}
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Overall Progress
                </Typography>
                <Box sx={{ height: 400 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analyticsData.learningProgress}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="skill" />
                      <YAxis />
                      <ChartTooltip />
                      <Bar dataKey="progress" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {activeTab === 2 && (
        <Grid container spacing={3}>
          {analyticsData.careerPathways.map((pathway, index) => (
            <Grid item xs={12} md={4} key={index}>
              <CareerPathCard pathway={pathway} />
            </Grid>
          ))}
        </Grid>
      )}

      {activeTab === 3 && (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Learning Activity Timeline
                </Typography>
                <Box sx={{ height: 400 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={analyticsData.weeklyActivity}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <ChartTooltip />
                      <Line type="monotone" dataKey="hours" stroke="#8884d8" />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default AdvancedAnalytics;
