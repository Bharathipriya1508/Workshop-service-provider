import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import ViewProviders from "./pages/ViewProviders";
import BookProvider from "./pages/BookProvider";
import ProviderDashboard from "./pages/ProviderDashboard";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
};

// Role-based Protected Route
const RoleProtectedRoute = ({ children, requiredRole }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (requiredRole && user.role !== requiredRole) {
    // Redirect to appropriate dashboard based on role
    if (user.role === 'provider') {
      return <Navigate to="/provider-dashboard" replace />;
    }
    return <Navigate to="/home" replace />;
  }
  
  return children;
};

// Main App Component
function AppContent() {
  const { user } = useAuth();
  const location = window.location.pathname;
  
  // Hide navbar on landing, login, signup pages
  const hideNavbar = ["/", "/login", "/signup"].includes(location);

  return (
    <>
      {!hideNavbar && <Navbar />}
      <main className="main-container">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Customer Routes */}
          <Route 
            path="/home" 
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/view-provider/:id"  // ✅ CHANGED: singular "provider" to match Home.js links
            element={
              <ProtectedRoute>
                <ViewProviders />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/book-provider/:id" 
            element={
              <ProtectedRoute>
                <BookProvider />
              </ProtectedRoute>
            } 
          />

          {/* Protected Provider Routes */}
          <Route 
            path="/provider-dashboard" 
            element={
              <RoleProtectedRoute requiredRole="provider">
                <ProviderDashboard />
              </RoleProtectedRoute>
            } 
          />

          {/* Redirect authenticated users away from landing page */}
          <Route 
            path="/" 
            element={
              user ? (
                <Navigate to={user.role === 'provider' ? '/provider-dashboard' : '/home'} replace />
              ) : (
                <LandingPage />
              )
            } 
          />

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  );
}

// App Wrapper
export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}
