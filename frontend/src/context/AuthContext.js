import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

const STORAGE_KEY = "workshopfinder_auth";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedUser = localStorage.getItem(STORAGE_KEY);
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (err) {
        console.error("Error initializing auth:", err);
        localStorage.removeItem(STORAGE_KEY);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Update localStorage when user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  // API instance
  const api = axios.create({
    baseURL: "http://localhost:5000/api",
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Enhanced login function
  const login = async ({ email, password, userType }) => {
    setLoading(true);
    setError("");
    
    try {
      const endpoint = userType === 'provider' ? '/providers/login' : '/users/login';
      const response = await api.post(endpoint, { email, password });
      
      // if (response.data.message && response.data.message.includes("pending admin approval")) {
      //   throw new Error("Your account is pending approval. Please wait for admin approval.");
      // }

      const userData = {
        ...(response.data.user || response.data.provider),
        token: response.data.token || 'demo-token',
        role: userType
      };
      
      setUser(userData);
      return { success: true, data: userData };
      
    } catch (err) {
      const message = err.response?.data?.message || err.message || "Login failed. Please try again.";
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // Enhanced signup functions
  const signupUser = async ({ name, email, password }) => {
    setLoading(true);
    setError("");
    
    try {
      const response = await api.post("/users/register", { name, email, password });
      
      // Auto-login after successful signup
      const loginResult = await login({ email, password, userType: 'customer' });
      return loginResult;
      
    } catch (err) {
      const message = err.response?.data?.message || err.message || "Registration failed. Please try again.";
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const signupProvider = async (providerData) => {
    setLoading(true);
    setError("");
    
    try {
      const response = await api.post("/providers/register", providerData);
      
      // Auto-login after successful signup
      const loginResult = await login({ 
        email: providerData.email, 
        password: providerData.password, 
        userType: 'provider' 
      });
      return loginResult;
      
    } catch (err) {
      const message = err.response?.data?.message || err.message || "Provider registration failed. Please try again.";
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setError("");
    // Navigation will be handled by components
  };

  // Clear error
  const clearError = () => setError("");

  const value = {
    user,
    loading,
    error,
    login,
    signupUser,
    signupProvider,
    logout,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
