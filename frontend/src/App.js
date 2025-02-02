import React, { Suspense, lazy } from "react";
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Navigate,
  createRoutesFromElements,
  createBrowserRouter,
  RouterProvider
} from "react-router-dom";
import { 
  ThemeProvider, 
  createTheme, 
  CssBaseline, 
  Box, 
  Typography, 
  Button, 
  Link 
} from "@mui/material";
import { HelmetProvider } from "react-helmet-async";
import { useAuth } from "./hooks/useAuth";

// Context Providers
import { AuthProvider } from "./contexts/AuthContext";
import ErrorBoundary from "./components/common/ErrorBoundary";
import LoadingSpinner from "./components/common/LoadingSpinner";
import ErrorFallback from "./components/common/ErrorFallback";

// Lazy loaded components with retry logic
const lazyLoadWithRetry = (factory) => {
  return lazy(() => {
    const retryLoad = async () => {
      try {
        return await factory();
      } catch (error) {
        console.error("Error loading component:", error);
        throw error;
      }
    };
    return retryLoad();
  });
};

// Lazy loading components
const MainLayout = lazyLoadWithRetry(() => import("./components/layout/MainLayout"));
const HomePage = lazyLoadWithRetry(() => import("./components/pages/HomePage"));
const AdvancedAnalytics = lazyLoadWithRetry(() => import("./components/analytics/AdvancedAnalytics"));
const AdvancedRecommendationEngine = lazyLoadWithRetry(() => import("./components/recommendation/AdvancedRecommendationEngine"));
const AdvancedSkillAssessment = lazyLoadWithRetry(() => import("./components/assessment/AdvancedSkillAssessment"));
const AdminPanel = lazyLoadWithRetry(() => import("./components/admin/AdminPanel"));
const LoginPage = lazyLoadWithRetry(() => import("./components/auth/LoginPage"));
const RegisterPage = lazyLoadWithRetry(() => import("./components/auth/RegisterPage"));
const NotFoundPage = lazyLoadWithRetry(() => import("./components/pages/NotFoundPage"));

// Protected Route Component with role-based access
const ProtectedRoute = ({ children, requiredRoles = [] }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRoles.length > 0 && !requiredRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

// Theme Configuration
const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
  typography: {
    fontFamily: "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
  },
});

// Router Configuration with Future Flags
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      path="/"
      element={
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Suspense fallback={<LoadingSpinner />}>
            <MainLayout />
          </Suspense>
        </ErrorBoundary>
      }
    >
      <Route index element={<HomePage />} />
      <Route
        path="analytics"
        element={
          <ProtectedRoute requiredRoles={["admin", "instructor"]}>
            <AdvancedAnalytics />
          </ProtectedRoute>
        }
      />
      <Route
        path="recommendations"
        element={
          <ProtectedRoute>
            <AdvancedRecommendationEngine />
          </ProtectedRoute>
        }
      />
      <Route
        path="assessment"
        element={
          <ProtectedRoute>
            <AdvancedSkillAssessment />
          </ProtectedRoute>
        }
      />
      <Route
        path="admin"
        element={
          <ProtectedRoute requiredRoles={["admin"]}>
            <AdminPanel />
          </ProtectedRoute>
        }
      />
      <Route path="login" element={<LoginPage />} />
      <Route path="register" element={<RegisterPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Route>
  ),
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true
    }
  }
);

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <HelmetProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AuthProvider>
            <RouterProvider router={router} />
          </AuthProvider>
        </ThemeProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App;