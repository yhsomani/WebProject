// Error logging utility
export const logError = (errorData) => {
  // Log to console in development
  if (process.env.NODE_ENV === "development") {
    console.error("Application Error:", errorData);
  }

  // In production, you would send this to your error tracking service
  // Example with a hypothetical error tracking service:
  if (process.env.NODE_ENV === "production") {
    try {
      // Send to error tracking service (replace with your actual error tracking service)
      fetch("/api/log-error", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(errorData),
      });
    } catch (error) {
      // Fallback logging if the error service is unavailable
      console.error("Failed to log error:", error);
    }
  }

  // You could also store errors in localStorage for debugging
  try {
    const errors = JSON.parse(localStorage.getItem("app_errors") || "[]");
    errors.push({
      ...errorData,
      timestamp: new Date().toISOString(),
    });
    // Keep only the last 10 errors
    localStorage.setItem("app_errors", JSON.stringify(errors.slice(-10)));
  } catch (error) {
    console.error("Failed to store error in localStorage:", error);
  }
};
