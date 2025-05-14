import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Signup from './pages/Signup';
import Login from './pages/Login';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // Start with null to allow loading state

  // Check token validity when app loads
  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (token) {
      setIsAuthenticated(true); // If token is found, assume user is authenticated
    } else {
      setIsAuthenticated(false); // No token means user is not authenticated
    }
  }, []);

  // Handle routes after checking authentication state
  if (isAuthenticated === null) {
    return <div>Loading...</div>; // Show loading state while checking token
  }

  return (
    <Router>
      <Routes>
        {/* Always start at login */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Login page */}
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/home" />
            ) : (
              <Login setIsAuthenticated={setIsAuthenticated} />
            )
          }
        />

        {/* Signup page */}
        <Route path="/signup" element={<Signup />} />

        {/* Home - Protected Route */}
        <Route
          path="/home"
          element={
            isAuthenticated ? (
              <HomePage />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
