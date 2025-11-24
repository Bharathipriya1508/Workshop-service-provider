import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import "../styles/App.css";

const Home = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [providers, setProviders] = useState([]);
  const [filteredProviders, setFilteredProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedService, setSelectedService] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [showFilters, setShowFilters] = useState(true);

  useEffect(() => {
    fetchProviders();
  }, []);

  useEffect(() => {
    filterProviders();
  }, [searchTerm, selectedService, selectedLocation, providers]);

  const fetchProviders = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/providers");
      setProviders(response.data);
      setFilteredProviders(response.data);
    } catch (error) {
      console.error("Error fetching providers:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterProviders = () => {
    let filtered = providers;

    if (searchTerm) {
      filtered = filtered.filter(
        (provider) =>
          provider.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          provider.serviceType
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          provider.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (provider.description &&
            provider.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedService !== "all") {
      filtered = filtered.filter(
        (provider) =>
          provider.serviceType?.toLowerCase() ===
          selectedService.toLowerCase()
      );
    }

    if (selectedLocation !== "all") {
      filtered = filtered.filter(
        (provider) =>
          provider.location?.toLowerCase() === selectedLocation.toLowerCase()
      );
    }

    setFilteredProviders(filtered);
  };

  const serviceTypes = [
    "all",
    ...new Set(providers.map((p) => p.serviceType).filter(Boolean)),
  ];
  const locations = [
    "all",
    ...new Set(providers.map((p) => p.location).filter(Boolean)),
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedService("all");
    setSelectedLocation("all");
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
      <div className="min-h-screen flex justify-center items-center bg-light-purple">
        <div className="text-center">
          <div className="spinner"></div>
          <p className="text-purple-600 mt-4 text-lg">
            Loading service providers...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="home-container min-h-screen bg-light-purple">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="hero-section text-center py-16 px-6 rounded-b-3xl"
      >
        <h1 className="text-4xl font-bold mb-2">
          Find Trusted Service Providers
        </h1>
        <p className="max-w-xl mx-auto">
          Browse and book trusted auto service professionals near you, fast and
          easy.
        </p>
      </motion.div>

      {/* Search + Filter Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto px-4 py-6 -mt-16 bg-white rounded-3xl shadow-xl relative z-10"
      >
        <div className="flex flex-wrap justify-center items-center gap-3">
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Search by name, service, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-control"
            />
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn btn-outline"
            >
              Filters {showFilters ? "▲" : "▼"}
            </button>
          </div>

          {(searchTerm ||
            selectedService !== "all" ||
            selectedLocation !== "all") && (
            <button
              onClick={clearFilters}
              className="btn btn-outline text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
            >
              Clear All
            </button>
          )}
        </div>

        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6 pt-6 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div>
              <label className="form-label">Service Type</label>
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="form-control form-select"
              >
                {serviceTypes.map((service) => (
                  <option key={service} value={service}>
                    {service === "all" ? "All Services" : service}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="form-label">Location</label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="form-control form-select"
              >
                {locations.map((location) => (
                  <option key={location} value={location}>
                    {location === "all" ? "All Locations" : location}
                  </option>
                ))}
              </select>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Providers List */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold text-purple-800">
              Available Providers
            </h2>
            <p className="text-purple-600">
              Found{" "}
              <span className="font-semibold text-purple-700">
                {filteredProviders.length}
              </span>{" "}
              {filteredProviders.length === 1
                ? "service provider"
                : "service providers"}
              {(searchTerm ||
                selectedService !== "all" ||
                selectedLocation !== "all") &&
                " matching your criteria"}
            </p>
          </div>
        </div>

        {filteredProviders.length === 0 ? (
          <motion.div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4 text-gray-300">🔍</div>
            <h3 className="text-2xl font-semibold text-purple-700 mb-2">
              No providers found
            </h3>
            <p className="text-purple-500 mb-6">
              {searchTerm ||
              selectedService !== "all" ||
              selectedLocation !== "all"
                ? "Try adjusting your search criteria or clear filters"
                : "No service providers are currently available"}
            </p>
            {(searchTerm ||
              selectedService !== "all" ||
              selectedLocation !== "all") && (
              <button onClick={clearFilters} className="btn btn-primary">
                Clear Filters
              </button>
            )}
          </motion.div>
        ) : (
          <motion.div layout className="provider-grid">
            <AnimatePresence>
              {filteredProviders.map((provider, index) => (
                <motion.div
                  key={provider._id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  whileHover={{ y: -5 }}
                  className="provider-card"
                >
                  <div className="card-header">
                    <div className="flex justify-between items-start mb-2">
                      <h3>{provider.name}</h3>
                      <span
                        className={
                          provider.availability ? "bg-green-500" : "bg-red-500"
                        }
                      >
                        {provider.availability ? "Available" : "Busy"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">
                        {getServiceIcon(provider.serviceType)}
                      </span>
                      <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                        {provider.serviceType}
                      </span>
                    </div>
                  </div>
                  <div className="card-body">
                    <div>📍 {provider.location}</div>
                    <div>📞 {provider.phone}</div>
                    <div>⭐ {provider.experience || "Experienced Professional"}</div>
                    {provider.description && (
                      <p className="line-clamp-2">{provider.description}</p>
                    )}
                    <div className="flex gap-2 mt-3">
                      <Link
                        to={`/view-provider/${provider._id}`}
                        className="btn btn-outline flex-1"
                      >
                        View Profile
                      </Link>
                      {provider.availability && (
                        <Link
                          to={`/book-provider/${provider._id}`}
                          className="btn btn-primary flex-1"
                        >
                          Book Now
                        </Link>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Home;
