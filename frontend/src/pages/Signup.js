import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import '../styles/App.css'; // make sure this path is correct

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'customer',
    phone: '',
    serviceType: '',
    location: '',
    experience: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const { signupUser, signupProvider, error, clearError } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    setLoading(true);

    let result;
    if (formData.userType === 'customer') {
      result = await signupUser({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
    } else {
      result = await signupProvider({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        serviceType: formData.serviceType,
        location: formData.location,
        experience: formData.experience,
        description: formData.description
      });
    }

    if (result.success) {
      const redirectPath = formData.userType === 'provider' ? '/provider-dashboard' : '/home';
      navigate(redirectPath);
    }
    setLoading(false);
  };

  const serviceTypes = [
    'Mechanic Services',
    'Car Wash & Detailing',
    'Painting & Body Work',
    'Electrical Systems',
    'Tire Services',
    'AC Service',
    'Brake Services',
    'Oil Change',
    'General Maintenance'
  ];

  return (
    <div className="auth-container signup-page">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="auth-card signup-card"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Join WorkshopFinder today</p>
        </div>

        {/* Error Alert */}
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="alert alert-error"
          >
            {error}
          </motion.div>
        )}

        {/* Signup Form
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="form-group">
            <label className="form-label">I want to join as:</label>
            <div className="user-type-row">
              <label className="user-type-option">
                <input
                  type="radio"
                  name="userType"
                  value="customer"
                  checked={formData.userType === 'customer'}
                  onChange={handleChange}
                />
                👤 Customer
              </label>
              <label className="user-type-option">
                <input
                  type="radio"
                  name="userType"
                  value="provider"
                  checked={formData.userType === 'provider'}
                  onChange={handleChange}
                />
                🔧 Service Provider
              </label>
            </div>
          </div> */}

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


          {/* Common Fields */}
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
          </div>

          {/* Provider Specific Fields */}
          {formData.userType === 'provider' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6 border-t pt-6"
            >
              <h3 className="text-lg font-semibold text-gray-900">
                Service Details
              </h3>

              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Service Type</label>
                <select
                  name="serviceType"
                  value={formData.serviceType}
                  onChange={handleChange}
                  className="form-control form-select"
                  required
                >
                  <option value="">Select your service type</option>
                  {serviceTypes.map((service) => (
                    <option key={service} value={service}>
                      {service}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Service Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Experience</label>
                <input
                  type="text"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Service Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="form-control"
                  rows="3"
                />
              </div>
            </motion.div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full py-4 text-lg font-semibold"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Creating Account...
              </div>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        {/* Link */}
        <div className="auth-link">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-purple-600 hover:text-purple-700 font-semibold"
          >
            Sign in here
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
