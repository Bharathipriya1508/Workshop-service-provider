import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <span className="text-2xl">🔧</span>
          <span>WorkshopFinder</span>
        </Link>

        {/* Navigation Links */}
        <ul className="navbar-menu">
          {user ? (
            // Authenticated User Menu
            <>
              {user.role === 'customer' && (
                <>
                  {/* <li>
                    <Link to="/home" className="navbar-link">
                      Find Providers
                    </Link>
                  </li> */}
                  {/* <li>
                    <Link to="/bookings" className="navbar-link">
                      My Bookings
                    </Link>
                  </li> */}
                </>
              )}
              
              {user.role === 'provider' && (
                <li>
                  {/* <Link to="/provider-dashboard" className="navbar-link">
                    Dashboard
                  </Link> */}
                </li>
              )}

              {/* User Profile Dropdown */}
              <li className="flex items-center gap-4">
                {/* <span className="text-gray-700 font-medium">
                  Welcome, {user.name}
                </span> */}
                <button
                  onClick={handleLogout}
                  className="btn btn-outline text-sm"
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            // Guest Menu
            <>
              <li>
                <Link to="/login" className="navbar-link">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/signup" className="navbar-btn">
                  Sign Up
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;