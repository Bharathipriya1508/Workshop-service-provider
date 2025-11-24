import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

const ViewProviders = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openSections, setOpenSections] = useState({});

  useEffect(() => {
    fetchProvider();
  }, [id]);

  const fetchProvider = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/providers/${id}`);
      setProvider(response.data);
    } catch (err) {
      console.error("Error fetching provider:", err);
      setError("Failed to load provider details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const getServiceIcon = (serviceType) => {
    const icons = {
      'Mechanic Services': '🔧',
      'Car Wash & Detailing': '✨',
      'Painting & Body Work': '🎨',
      'Electrical Systems': '⚡',
      'Tire Services': '🌀',
      'AC Service': '❄️',
      'Brake Services': '🛑',
      'Oil Change': '🛢️',
      'General Maintenance': '🔧'
    };
    return icons[serviceType] || '🔧';
  };

  if (loading) {
    return (
      <div className="viewprovider-center">
        <div className="spinner"></div>
        <p className="text-purple-600 mt-4 text-lg">Loading provider details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="viewprovider-center">
        <h3 className="text-2xl font-semibold text-gray-700 mb-2">❌ {error}</h3>
        <button onClick={() => navigate('/home')} className="btn btn-primary">Back to Home</button>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="viewprovider-center">
        <h3 className="text-2xl font-semibold text-gray-700 mb-2">Provider Not Found</h3>
        <button onClick={() => navigate('/home')} className="btn btn-primary">Back</button>
      </div>
    );
  }

  return (
    <div className="viewprovider-container">
      {/* Header */}
      <div className="provider-header">
        <div className="provider-header-content">
          <div className="icon-box">{getServiceIcon(provider.serviceType)}</div>
          <div>
            <h1 className="provider-name">
              {provider.name}
              <span className={`availability-badge ${provider.availability ? "available" : "busy"}`}>
                {provider.availability ? "Available" : "Busy"}
              </span>
            </h1>
            <p className="provider-type">{provider.serviceType}</p>
          </div>
        </div>
      </div>

      {/* Main Card */}
      <div className="provider-card">
        {/* Collapsible Sections */}
        {[
          { key: "contact", title: "📞 Contact Information" },
          { key: "serviceDetails", title: "⚙️ Service Details" },
          { key: "servicesOffered", title: "🧰 Services Offered" },
          { key: "about", title: "ℹ️ About the Provider" },
          { key: "booking", title: "🗓️ Book Service" },
        ].map((section) => (
          <motion.div key={section.key} className="collapsible-section">
            <div className="section-header" onClick={() => toggleSection(section.key)}>
              <h3>{section.title}</h3>
              <span>{openSections[section.key] ? "−" : "+"}</span>
            </div>
            <AnimatePresence>
              {openSections[section.key] && (
                <motion.div
                  className="section-content"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {section.key === "contact" && (
                    <div className="section-body">
                      <p><b>📍 Location:</b> {provider.location}</p>
                      <p><b>📞 Phone:</b> {provider.phone}</p>
                      <p><b>✉️ Email:</b> {provider.email}</p>
                    </div>
                  )}

                  {section.key === "serviceDetails" && (
                    <div className="section-body">
                      <p><b>Experience:</b> {provider.experience || "Professional experience"}</p>
                      <p><b>Service Area:</b> {provider.location} & nearby areas</p>
                      <p><b>Response Time:</b> Usually within 1 hour</p>
                    </div>
                  )}

                  {section.key === "servicesOffered" && (
                    <div className="services-grid">
                      {[
                        provider.serviceType,
                        "Diagnostics",
                        "Maintenance",
                        "Repairs",
                        "Inspections",
                        "Emergency Services",
                      ].map((service, i) => (
                        <div key={i} className="service-item">
                          <span>{getServiceIcon(service)}</span> {service}
                        </div>
                      ))}
                    </div>
                  )}

                  {section.key === "about" && (
                    <div className="section-body">
                      <p>{provider.description || "Dedicated professional providing top-quality automotive services."}</p>
                    </div>
                  )}

                  {section.key === "booking" && (
                    <div className="section-body">
                      {provider.availability ? (
                        <Link
                          to={`/book-provider/${provider._id}`}
                          className="btn btn-primary w-full"
                        >
                          Book Service Now
                        </Link>
                      ) : (
                        <div className="unavailable-box">
                          <p>This provider is not currently accepting new bookings.</p>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ViewProviders;

