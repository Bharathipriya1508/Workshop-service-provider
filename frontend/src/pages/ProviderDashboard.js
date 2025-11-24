import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import "../styles/App.css";

const ProviderDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openSection, setOpenSection] = useState("overview");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (user) fetchBookings();
  }, [user]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:5000/api/bookings/provider/${user._id}`
      );
      setBookings(response.data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      setUpdating(true);
      await axios.put(`http://localhost:5000/api/bookings/${bookingId}/status`, {
        status: newStatus,
      });
      setBookings((prev) =>
        prev.map((b) =>
          b._id === bookingId ? { ...b, status: newStatus } : b
        )
      );
    } catch (error) {
      console.error("Error updating booking status:", error);
      alert("Failed to update booking status");
    } finally {
      setUpdating(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      accepted: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
      completed: "bg-blue-100 text-blue-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
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

  const stats = {
    total: bookings.length,
    pending: bookings.filter((b) => b.status === "pending").length,
    accepted: bookings.filter((b) => b.status === "accepted").length,
    completed: bookings.filter((b) => b.status === "completed").length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-light-purple flex items-center justify-center">
        <div className="text-center">
          <div className="spinner"></div>
          <p className="text-purple-600 mt-4 text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const toggleSection = (id) => {
    setOpenSection((prev) => (prev === id ? null : id));
  };

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-content">
        <div className="provider-dashboard min-h-screen bg-light-purple pb-12 flex flex-col items-center">
          {/* Header */}
          <header className="dashboard-header gradient-bar glass-wrap w-full">
            <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white">Provider Dashboard</h1>
              </div>

              <div className="flex items-center gap-4">
                <span
                  className={`availability-pill ${
                    user?.availability ? "available" : "busy"
                  }`}
                >
                  {user?.availability ? "Available" : "Busy"}
                </span>
                {/* <button
        onClick={handleLogout}
        className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-medium transition-colors border border-white/30"
      >
        Logout
      </button> */}

                {/* <button
        onClick={handleLogout}
        className="bg-white text-purple-700 hover:bg-gray-100 px-5 py-2 rounded-lg font-semibold transition-colors shadow-lg hover:shadow-xl"
      >
        🚪 Logout
      </button> */}
              </div>
            </div>
          </header>

          <main className="w-full flex justify-center mt-6">
            <div className="w-full max-w-5xl px-4">
              {/* Stats row */}
              <section className="stats-row grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                {[
                  { label: "Total Bookings", value: stats.total, icon: "📊" },
                  { label: "Pending", value: stats.pending, icon: "⏳" },
                  { label: "Accepted", value: stats.accepted, icon: "✅" },
                  { label: "Completed", value: stats.completed, icon: "🎉" },
                ].map((s, i) => (
                  <motion.div
                    key={s.label}
                    className="glass-card p-6 rounded-2xl"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07 }}
                    whileHover={{ y: -6, scale: 1.02 }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-3xl">{s.icon}</div>
                        <div className="text-3xl font-bold mt-2 text-purple-700">
                          {s.value}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">{s.label}</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </section>

              {/* Collapsible cards */}
              <section className="space-y-6">
           {/* Manage Bookings Section */}
<div className="collapse-card">
  <div
    className="collapse-header"
    onClick={() => toggleSection("allBookings")}
  >
    <div className="collapse-header-left">
      <span className="emoji">📋</span>
      <h3>Manage Bookings</h3>
    </div>
    <div className="collapse-header-right">
      <span>{bookings.length} total bookings</span>
      <span className="collapse-arrow">
        {openSection === "allBookings" ? "−" : "+"}
      </span>
    </div>
  </div>

  {openSection === "allBookings" && (
    <div className="collapse-body">
      {bookings.length === 0 ? (
        <div className="no-bookings">
          <div className="no-icon">📋</div>
          <h4>No bookings yet</h4>
          <p>Customer bookings will appear here when they book your services.</p>
        </div>
      ) : (
        <div className="booking-list">
          {bookings.map((booking) => (
            <div className="booking-card" key={booking._id}>
              <div className="booking-header">
                <div className="booking-user">
                  <span className="emoji">{getServiceIcon(user.serviceType)}</span>
                  <div>
                    <h4>{booking.user?.name || "Customer"}</h4>
                    {booking.contactPhone ? (
    <p className="user-contact">
      📞 {booking.contactPhone}
    </p>
  ) : (
    <p className="user-contact text-muted">📞 Contact not provided</p>
  )}
  <p>
    {booking.vehicleType} •{" "}
    {new Date(booking.date).toLocaleDateString()} at{" "}
    {new Date(booking.date).toLocaleTimeString()}
  </p>
                  </div>
                </div>
                <span className={`status ${getStatusColor(booking.status)}`}>
                  {booking.status}
                </span>
              </div>

              <div className="booking-details">
                <strong>Service Description</strong>
                <p>{booking.issueDescription}</p>
                {booking.note && (
                  <>
                    <strong>Customer Notes</strong>
                    <p className="note">{booking.note}</p>
                  </>
                )}
              </div>

              <div className="booking-actions">
                {booking.status === "pending" && (
                  <>
                    <button
                      className="accept-btn"
                      onClick={() => handleStatusUpdate(booking._id, "accepted")}
                      disabled={updating}
                    >
                      ✅ Accept
                    </button>
                    <button
                      className="reject-btn"
                      onClick={() => handleStatusUpdate(booking._id, "rejected")}
                      disabled={updating}
                    >
                      ❌ Decline
                    </button>
                  </>
                )}
                {booking.status === "accepted" && (
                  <button
                    className="complete-btn"
                    onClick={() => handleStatusUpdate(booking._id, "completed")}
                    disabled={updating}
                  >
                    🎉 Mark as Completed
                  </button>
                )}
                {booking.status === "completed" && (
                  <span className="completed">✅ Service Completed</span>
                )}
                {booking.status === "rejected" && (
                  <span className="rejected">❌ Booking Declined</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )}
</div>




                {/* Profile */}
                <div className="collapse-card">
                  <div
                    className="collapse-header"
                    onClick={() => toggleSection("profile")}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">👤</span>
                      <h3 className="text-lg font-semibold">Profile</h3>
                    </div>
                    <div className="collapse-meta">
                      <span className="text-sm text-gray-500 mr-4">
                        Account details
                      </span>
                      <span className="collapse-arrow">
                        {openSection === "profile" ? "−" : "+"}
                      </span>
                    </div>
                  </div>
                  <AnimatePresence>
                    {openSection === "profile" && (
                      <motion.div
                        className="collapse-body"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.28 }}
                      >
                        <div className="bg-white rounded-xl p-6">
                          <h4 className="text-lg font-semibold text-gray-900 mb-6">
                            Provider Profile
                          </h4>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                              <div>
                                <h5 className="text-sm text-gray-600">
                                  Service Type
                                </h5>
                                <div className="font-medium text-lg">
                                  {user.serviceType}
                                </div>
                              </div>

                              <div>
                                <h5 className="text-sm text-gray-600">Location</h5>
                                <div className="font-medium text-lg">
                                  {user.location}
                                </div>
                              </div>

                              <div>
                                <h5 className="text-sm text-gray-600">
                                  Experience
                                </h5>
                                <div className="font-medium text-lg">
                                  {user.experience || "Not specified"}
                                </div>
                              </div>
                            </div>

                            <div>
                              <h5 className="text-sm text-gray-600 mb-2">
                                Service Description
                              </h5>
                              <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-gray-700 leading-relaxed">
                                  {user.description ||
                                    "No description provided. Update your profile to add a service description."}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </section>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProviderDashboard;


