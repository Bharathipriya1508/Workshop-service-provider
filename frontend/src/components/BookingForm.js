import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const BookingForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  const [formData, setFormData] = useState({
    date: '',
    vehicleType: '',
    issueDescription: '',
    note: ''
  });

  useEffect(() => {
    const fetchProvider = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/providers/${id}`);
        setProvider(res.data);
      } catch (err) {
        console.error('Error fetching provider:', err);
        setMessage('Error loading provider details');
      }
    };
    
    if (id) {
      fetchProvider();
    }
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      setMessage('Please log in to make a booking');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const bookingData = {
        userId: user.id || user._id,
        providerId: id,
        date: formData.date,
        vehicleType: formData.vehicleType,
        issueDescription: formData.issueDescription,
        note: formData.note
      };

      const response = await axios.post('http://localhost:5000/api/bookings', bookingData);
      
      setMessage('Booking created successfully!');
      setFormData({
        date: '',
        vehicleType: '',
        issueDescription: '',
        note: ''
      });

      // Redirect to home after success
      setTimeout(() => {
        navigate('/home');
      }, 2000);

    } catch (error) {
      console.error('Booking error:', error);
      setMessage(
        error.response?.data?.message || 
        'Failed to create booking. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (!provider) {
    return (
      <div className="min-h-screen bg-[#EDE7F6] pt-24 flex justify-center items-center">
        <div className="text-center">
          <div className="spinner"></div>
          <p className="text-[#6A1B9A] mt-4">Loading provider information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EDE7F6] pt-24 px-4 py-8">
      <div className="container max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          {/* Provider Header */}
          <div className="bg-gradient-to-r from-[#6A1B9A] to-[#8E24AA] text-white p-6">
            <h1 className="text-3xl font-bold mb-2">Book Service</h1>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-semibold">{provider.name}</h2>
                <p className="text-purple-200">{provider.serviceType} • {provider.location}</p>
              </div>
              <div className="mt-4 md:mt-0 text-right">
                <p className="text-purple-200">📞 {provider.phone}</p>
                <p className="text-purple-200">📧 {provider.email}</p>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div className="p-6">
            {message && (
              <div className={`mb-6 p-4 rounded-lg ${
                message.includes('successfully') 
                  ? 'bg-green-100 text-green-800 border border-green-200' 
                  : 'bg-red-100 text-red-800 border border-red-200'
              }`}>
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Date */}
                <div className="form-group">
                  <label className="form-label">Preferred Date *</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="form-control"
                    required
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                {/* Vehicle Type */}
                <div className="form-group">
                  <label className="form-label">Vehicle Type *</label>
                  <select
                    name="vehicleType"
                    value={formData.vehicleType}
                    onChange={handleChange}
                    className="form-control form-select"
                    required
                  >
                    <option value="">Select Vehicle Type</option>
                    <option value="Hatchback">Hatchback</option>
                    <option value="Sedan">Sedan</option>
                    <option value="SUV">SUV</option>
                    <option value="MPV">MPV</option>
                    <option value="Coupe">Coupe</option>
                    <option value="Convertible">Convertible</option>
                    <option value="Pickup Truck">Pickup Truck</option>
                    <option value="Commercial Vehicle">Commercial Vehicle</option>
                    <option value="Motorcycle">Motorcycle</option>
                  </select>
                </div>
              </div>

              {/* Issue Description */}
              <div className="form-group">
                <label className="form-label">Issue Description *</label>
                <textarea
                  name="issueDescription"
                  value={formData.issueDescription}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Please describe the issue with your vehicle in detail..."
                  rows="4"
                  required
                />
              </div>

              {/* Additional Notes */}
              <div className="form-group">
                <label className="form-label">Additional Notes (Optional)</label>
                <textarea
                  name="note"
                  value={formData.note}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Any additional information or special requests..."
                  rows="3"
                />
              </div>

              {/* Form Actions */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary flex-1"
                >
                  {loading ? (
                    <>
                      <div className="spinner-small mr-2"></div>
                      Creating Booking...
                    </>
                  ) : (
                    'Confirm Booking'
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={() => navigate('/home')}
                  className="btn btn-outline flex-1"
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>

              {/* User Info Note */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 text-sm">
                  <strong>Note:</strong> You are booking as {user?.name} ({user?.email}). 
                  The service provider will contact you for confirmation.
                </p>
              </div>
            </form>
          </div>
        </motion.div>

        {/* Provider Details Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-6 mt-6"
        >
          <h3 className="text-xl font-semibold text-[#6A1B9A] mb-4">About {provider.name}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Service Details</h4>
              <ul className="space-y-2 text-gray-600">
                <li><strong>Service Type:</strong> {provider.serviceType}</li>
                <li><strong>Location:</strong> {provider.location}</li>
                {provider.experience && (
                  <li><strong>Experience:</strong> {provider.experience}</li>
                )}
                <li>
                  <strong>Status:</strong> 
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                    provider.availability 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {provider.availability ? 'Available' : 'Currently Unavailable'}
                  </span>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Contact Information</h4>
              <ul className="space-y-2 text-gray-600">
                <li><strong>Phone:</strong> {provider.phone}</li>
                <li><strong>Email:</strong> {provider.email}</li>
              </ul>
            </div>
          </div>

          {provider.description && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h4 className="font-semibold text-gray-700 mb-2">Service Description</h4>
              <p className="text-gray-600">{provider.description}</p>
            </div>
          )}
        </motion.div>
      </div>

      <style jsx>{`
        .spinner-small {
          border: 2px solid #f3f3f3;
          border-top: 2px solid #6A1B9A;
          border-radius: 50%;
          width: 16px;
          height: 16px;
          animation: spin 1s linear infinite;
          display: inline-block;
        }
      `}</style>
    </div>
  );
};

export default BookingForm;