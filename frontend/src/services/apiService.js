import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:4000/api/v1";

// Create axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json"
  },
  // Add timeout
  timeout: 10000,
  // Add withCredentials for cookies
  withCredentials: true
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    // Ensure response data is properly structured
    if (response.data && typeof response.data === 'object') {
      return response;
    }
    return Promise.reject(new Error('Invalid response format'));
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle token expiration
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (refreshToken) {
          const response = await api.post("/auth/refresh-token", { refreshToken });
          const { token } = response.data;
          
          if (!token) {
            throw new Error('No token in refresh response');
          }
          
          localStorage.setItem("authToken", token);
          originalRequest.headers["Authorization"] = `Bearer ${token}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        // Clear all auth data
        localStorage.removeItem("authToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    }

    // Handle network errors
    if (!error.response) {
      console.error("Network error:", error);
      return Promise.reject({
        message: "Network error. Please check your connection.",
        status: 0,
        originalError: error
      });
    }

    return Promise.reject(error);
  }
);

const handleError = (error) => {
  if (!error.response) {
    return {
      message: "Network error. Please check your connection.",
      status: 0
    };
  }

  const { status, data } = error.response;
  
  switch (status) {
    case 400:
      return {
        message: data.message || "Invalid request. Please check your input.",
        status,
        details: data.errors
      };
    case 401:
      return {
        message: "Authentication failed. Please log in again.",
        status
      };
    case 403:
      return {
        message: "You don't have permission to perform this action.",
        status
      };
    case 404:
      return {
        message: "Resource not found.",
        status
      };
    case 422:
      return {
        message: "Validation error. Please check your input.",
        status,
        details: data.errors
      };
    case 500:
      return {
        message: "Server error. Please try again later.",
        status
      };
    default:
      return {
        message: "An unexpected error occurred.",
        status
      };
  }
};

const apiService = {
  async get(endpoint, params = {}) {
    try {
      const response = await api.get(endpoint, { params });
      return response;
    } catch (error) {
      return Promise.reject(handleError(error));
    }
  },

  async post(endpoint, data = {}) {
    try {
      const response = await api.post(endpoint, data);
      return response;
    } catch (error) {
      return Promise.reject(handleError(error));
    }
  },

  async put(endpoint, data = {}) {
    try {
      const response = await api.put(endpoint, data);
      return response;
    } catch (error) {
      return Promise.reject(handleError(error));
    }
  },

  async delete(endpoint) {
    try {
      const response = await api.delete(endpoint);
      return response;
    } catch (error) {
      return Promise.reject(handleError(error));
    }
  }
};

export default apiService;
