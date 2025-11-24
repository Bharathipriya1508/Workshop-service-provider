import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const BookProvider = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [showSummary, setShowSummary] = useState(false);
  const [showTips, setShowTips] = useState(false);

  const [formData, setFormData] = useState({
    date: "",
    time: "",
    vehicleType: "",
    issueDescription: "",
    contactPhone: "",
    specialRequests: "",
  });

  useEffect(() => {
    fetchProvider();
  }, [id]);

  const fetchProvider = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/providers/${id}`);
      setProvider(response.data);
    } catch (error) {
      console.error("Error fetching provider:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const bookingData = {
        userId: user._id,
        providerId: id,
        date: `${formData.date}T${formData.time}`,
        vehicleType: formData.vehicleType,
        issueDescription: formData.issueDescription,
        contactPhone: formData.contactPhone,
        note: formData.specialRequests,
      };

      await axios.post("http://localhost:5000/api/bookings", bookingData);

      alert("Booking request sent successfully! The provider will contact you soon.");
      navigate("/home");
    } catch (error) {
      console.error("Error creating booking:", error);
      alert("Failed to create booking. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const getServiceIcon = (serviceType) => {
    const icons = {
      Mechanic: "🔧",
      "Car Wash": "✨",
      Painting: "🎨",
      "Body Work": "⚒️",
      Electrical: "⚡",
      "Tire Service": "🌀",
      "AC Service": "❄️",
      "General Maintenance": "🔧",
      "Brake Services": "🛑",
      "Oil Change": "🛢️",
    };
    return icons[serviceType] || "🔧";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-light-purple flex justify-center items-center">
        <div className="text-center">
          <div className="spinner"></div>
          <p className="text-purple-600 mt-4 text-lg">Loading booking form...</p>
        </div>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="min-h-screen bg-light-purple flex justify-center items-center">
        <div className="text-center bg-white p-10 rounded-3xl shadow-lg">
          <div className="text-6xl mb-4 text-gray-400">❌</div>
          <h3 className="text-2xl font-semibold text-gray-700 mb-2">Provider Not Found</h3>
          <button onClick={() => navigate("/home")} className="btn btn-primary">
            Back to Providers
          </button>
        </div>
      </div>
    );
  }

  const timeSlots = [];
  for (let hour = 8; hour <= 18; hour++) {
    timeSlots.push(`${hour.toString().padStart(2, "0")}:00`);
    timeSlots.push(`${hour.toString().padStart(2, "0")}:30`);
  }

  return (
    <div className="book-page min-h-screen flex items-center justify-center bg-light-purple px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-3xl"
      >
        {/* Back Button */}
        {/* <div className="mb-6">
          <button
            onClick={() => navigate(`/view-provider/${id}`)}
            className="text-purple-700 font-semibold hover:text-purple-900 transition flex items-center gap-2"
          >
            ← Back to Provider
          </button>
        </div> */}

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-purple-800">
            {getServiceIcon(provider.serviceType)} {provider.serviceType}
          </h1>
          <p className="text-purple-600 mt-2 text-lg">
            Booking for <span className="font-semibold">{provider.name}</span>
          </p>
        </div>

        {/* Booking Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="form-label">Preferred Date *</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="form-control"
                min={new Date().toISOString().split("T")[0]}
                required
              />
            </div>
            <div>
              <label className="form-label">Preferred Time *</label>
              <select
                name="time"
                value={formData.time}
                onChange={handleChange}
                className="form-control form-select"
                required
              >
                <option value="">Select Time</option>
                {timeSlots.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="form-label">Vehicle Type *</label>
            <input
              type="text"
              name="vehicleType"
              value={formData.vehicleType}
              onChange={handleChange}
              className="form-control"
              placeholder="e.g., Toyota Innova, Maruti Swift..."
              required
            />
          </div>

          <div>
            <label className="form-label">Service / Issue Description *</label>
            <textarea
              name="issueDescription"
              value={formData.issueDescription}
              onChange={handleChange}
              className="form-control"
              rows="4"
              placeholder="Describe the issue or service needed..."
              required
            ></textarea>
          </div>

          <div>
            <label className="form-label">Contact Phone *</label>
            <input
              type="tel"
              name="contactPhone"
              value={formData.contactPhone}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter your contact number"
              required
            />
          </div>

          <div>
            <label className="form-label">Special Requests / Notes</label>
            <textarea
              name="specialRequests"
              value={formData.specialRequests}
              onChange={handleChange}
              className="form-control"
              rows="3"
              placeholder="Optional additional notes..."
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary w-full py-4 text-lg font-semibold"
          >
            {submitting ? "Submitting..." : "Confirm Booking"}
          </button>
        </form>

        {/* Collapsible Sections */}
        <div className="mt-10 space-y-4">
          {/* Provider Summary */}
          <div className="collapse-card">
            <div
              className="collapse-header"
              onClick={() => setShowSummary(!showSummary)}
            >
              <h3>Provider Summary</h3>
              <span>{showSummary ? "▲" : "▼"}</span>
            </div>
            <AnimatePresence>
              {showSummary && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="collapse-content"
                >
                  <p><b>📍 Location:</b> {provider.location}</p>
                  <p><b>📞 Contact:</b> {provider.phone}</p>
                  <p><b>⭐ Experience:</b> {provider.experience || "Professional"}</p>
                  <p>
                    <b>Status:</b>{" "}
                    <span
                      className={`${
                        provider.availability ? "text-green-600" : "text-red-600"
                      } font-semibold`}
                    >
                      {provider.availability ? "Available" : "Busy"}
                    </span>
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Booking Tips */}
          <div className="collapse-card">
            <div
              className="collapse-header"
              onClick={() => setShowTips(!showTips)}
            >
              <h3>Booking Tips</h3>
              <span>{showTips ? "▲" : "▼"}</span>
            </div>
            <AnimatePresence>
              {showTips && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="collapse-content text-sm text-blue-900"
                >
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Be specific about your vehicle issues.</li>
                    <li>Provide accurate contact information.</li>
                    <li>The provider will confirm your booking.</li>
                    <li>Discuss pricing after confirmation.</li>
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default BookProvider;


