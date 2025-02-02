import React, { useState } from "react";
import { 
  Outlet, 
  Link as RouterLink, 
  useLocation 
} from "react-router-dom";
import { 
  Box, 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton, 
  Container 
} from "@mui/material";
import { 
  Menu as MenuIcon, 
  Dashboard as DashboardIcon, 
  School as SchoolIcon, 
  Assessment as AssessmentIcon, 
  Work as WorkIcon, 
  Analytics as AnalyticsIcon, 
  Recommend as RecommendIcon,
  AdminPanelSettings as AdminIcon 
} from "@mui/icons-material";

const MainLayout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { 
      text: "Dashboard", 
      icon: <DashboardIcon />, 
      path: "/" 
    },
    { 
      text: "Learning Paths", 
      icon: <SchoolIcon />, 
      path: "/learning-paths" 
    },
    { 
      text: "Advanced Analytics", 
      icon: <AnalyticsIcon />, 
      path: "/analytics" 
    },
    { 
      text: "Recommendations", 
      icon: <RecommendIcon />, 
      path: "/recommendations" 
    },
    { 
      text: "Skill Assessment", 
      icon: <AssessmentIcon />, 
      path: "/skill-assessment-advanced" 
    },
    { 
      text: "Internship Matching", 
      icon: <WorkIcon />, 
      path: "/internships" 
    },
    { 
      text: "Admin Panel", 
      icon: <AdminIcon />, 
      path: "/admin-panel" 
    }
  ];

  const drawer = (
    <List>
      {menuItems.map((item) => (
        <ListItem 
          key={item.text} 
          component={RouterLink} 
          to={item.path}
          selected={location.pathname === item.path}
        >
          <ListItemIcon>{item.icon}</ListItemIcon>
          <ListItemText primary={item.text} />
        </ListItem>
      ))}
    </List>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Learning Platform
          </Typography>
        </Toolbar>
      </AppBar>
      
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: 240 },
        }}
      >
        {drawer}
      </Drawer>
      
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: 240 },
        }}
        open
      >
        {drawer}
      </Drawer>
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: "calc(100% - 240px)" },
          mt: ["48px", "56px", "64px"]
        }}
      >
        <Toolbar />
        <Container maxWidth="xl">
          {children}
        </Container>
      </Box>
    </Box>
  );
};

export default MainLayout;
