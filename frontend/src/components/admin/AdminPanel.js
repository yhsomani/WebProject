import React, { useState, useEffect } from "react";
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Chip, 
  Avatar 
} from "@mui/material";
import { 
  AdminPanelSettings as AdminIcon, 
  People as UsersIcon, 
  School as CoursesIcon, 
  Work as InternshipsIcon, 
  Analytics as AnalyticsIcon 
} from "@mui/icons-material";

const MOCK_ADMIN_DATA = {
  users: [
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      role: "Student",
      status: "Active"
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane.smith@example.com",
      role: "Instructor",
      status: "Active"
    }
  ],
  courses: [
    {
      id: 1,
      title: "Advanced React Development",
      instructor: "John Doe",
      enrollments: 250,
      status: "Published"
    },
    {
      id: 2,
      title: "Machine Learning Fundamentals",
      instructor: "Jane Smith",
      enrollments: 180,
      status: "Draft"
    }
  ],
  analytics: {
    totalUsers: 5000,
    totalCourses: 45,
    monthlyActiveUsers: 2500,
    averageCourseCompletion: 72
  }
};

const AdminPanel = () => {
  const [adminData, setAdminData] = useState(MOCK_ADMIN_DATA);
  const [selectedTab, setSelectedTab] = useState("users");
  const [openUserDialog, setOpenUserDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleUserEdit = (user) => {
    setSelectedUser(user);
    setOpenUserDialog(true);
  };

  const renderUserManagement = () => (
    <Card elevation={3}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">User Management</Typography>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<UsersIcon />}
            onClick={() => {
              setSelectedUser(null);
              setOpenUserDialog(true);
            }}
          >
            Add User
          </Button>
        </Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {adminData.users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Chip 
                      label={user.role} 
                      color={
                        user.role === "Admin" ? "error" : 
                        user.role === "Instructor" ? "secondary" : 
                        "primary"
                      } 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={user.status} 
                      color={user.status === "Active" ? "success" : "warning"} 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="outlined" 
                      size="small" 
                      onClick={() => handleUserEdit(user)}
                    >
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );

  const renderCourseManagement = () => (
    <Card elevation={3}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Course Management</Typography>
          <Button 
            variant="contained" 
            color="secondary" 
            startIcon={<CoursesIcon />}
          >
            Add Course
          </Button>
        </Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Instructor</TableCell>
                <TableCell>Enrollments</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {adminData.courses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell>{course.title}</TableCell>
                  <TableCell>{course.instructor}</TableCell>
                  <TableCell>{course.enrollments}</TableCell>
                  <TableCell>
                    <Chip 
                      label={course.status} 
                      color={course.status === "Published" ? "success" : "warning"} 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell>
                    <Button variant="outlined" size="small">
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );

  const renderAnalyticsDashboard = () => (
    <Card elevation={3}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Platform Analytics</Typography>
          <Chip 
            icon={<AnalyticsIcon />} 
            label="Real-Time Insights" 
            color="primary" 
          />
        </Box>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <Box textAlign="center">
              <Typography variant="h4">{adminData.analytics.totalUsers}</Typography>
              <Typography variant="body2">Total Users</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={3}>
            <Box textAlign="center">
              <Typography variant="h4">{adminData.analytics.totalCourses}</Typography>
              <Typography variant="body2">Total Courses</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={3}>
            <Box textAlign="center">
              <Typography variant="h4">{adminData.analytics.monthlyActiveUsers}</Typography>
              <Typography variant="body2">Monthly Active Users</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={3}>
            <Box textAlign="center">
              <Typography variant="h4">{adminData.analytics.averageCourseCompletion}%</Typography>
              <Typography variant="body2">Course Completion Rate</Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
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
          Admin Control Panel
        </Typography>
        <Chip 
          icon={<AdminIcon />} 
          label="Administrative Dashboard" 
          color="primary" 
        />
      </Box>

      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <Button 
          variant={selectedTab === "users" ? "contained" : "outlined"}
          startIcon={<UsersIcon />}
          onClick={() => setSelectedTab("users")}
        >
          User Management
        </Button>
        <Button 
          variant={selectedTab === "courses" ? "contained" : "outlined"}
          startIcon={<CoursesIcon />}
          onClick={() => setSelectedTab("courses")}
        >
          Course Management
        </Button>
        <Button 
          variant={selectedTab === "analytics" ? "contained" : "outlined"}
          startIcon={<AnalyticsIcon />}
          onClick={() => setSelectedTab("analytics")}
        >
          Analytics Dashboard
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          {selectedTab === "users" && renderUserManagement()}
          {selectedTab === "courses" && renderCourseManagement()}
          {selectedTab === "analytics" && renderAnalyticsDashboard()}
        </Grid>
      </Grid>

      <Dialog 
        open={openUserDialog} 
        onClose={() => setOpenUserDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {selectedUser ? "Edit User" : "Add New User"}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Full Name"
            type="text"
            fullWidth
            variant="outlined"
            defaultValue={selectedUser?.name || ""}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Email Address"
            type="email"
            fullWidth
            variant="outlined"
            defaultValue={selectedUser?.email || ""}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
            <InputLabel>User Role</InputLabel>
            <Select
              label="User Role"
              defaultValue={selectedUser?.role || "Student"}
            >
              <MenuItem value="Student">Student</MenuItem>
              <MenuItem value="Instructor">Instructor</MenuItem>
              <MenuItem value="Admin">Admin</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth variant="outlined">
            <InputLabel>Account Status</InputLabel>
            <Select
              label="Account Status"
              defaultValue={selectedUser?.status || "Active"}
            >
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Suspended">Suspended</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenUserDialog(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            color="primary"
          >
            {selectedUser ? "Update User" : "Create User"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminPanel;
