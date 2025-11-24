import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import "../styles/App.css"; // Import the main CSS for theme consistency

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    userType: "customer",
  });
  const [loading, setLoading] = useState(false);
  const { login, error, clearError } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await login(formData);
    if (result.success) {
      const redirectPath =
        formData.userType === "provider"
          ? "/provider-dashboard"
          : "/home";
      navigate(redirectPath);
    }
    setLoading(false);
  };

  return (
    <div className="login-page">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="login-card"
      >
        <div className="login-header">
          <h1>Welcome Back</h1>
          <p>Sign in to your account</p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="login-error"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label className="form-label">I am a</label>
            <div className="user-type">
              {[
                { value: "customer", label: "Customer", icon: "👤" },
                { value: "provider", label: "Service Provider", icon: "🔧" },
              ].map((type) => (
                <label
                  key={type.value}
                  className={`type-option ${
                    formData.userType === type.value ? "active" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="userType"
                    value={type.value}
                    checked={formData.userType === type.value}
                    onChange={handleChange}
                  />
                  <span className="icon">{type.icon}</span>
                  <span>{type.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            className="btn-login"
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="login-footer">
          Don't have an account?{" "}
          <Link to="/signup" className="link-purple">
            Sign up here
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;


