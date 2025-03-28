import React, { useState, useEffect } from "react";
import "./App.css";
import AppSearch from "./pages/AppSearch";
import MarcheForm from "./pages/MarcheForm";
import TitulaireForm from "./pages/TitulaireForm";
import { Route, BrowserRouter as Router, Routes, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Market_edit from "./pages/Market_edit";
import Market_details from "./pages/Market_details";
import UserManagement from "./pages/UserManagement";
import axios from "axios";

const App = () => {
  const apiUrl = import.meta.env.VITE_API_BACKEND_URL;
  const [authenticated, setAuthenticated] = useState(null); // null = loading state

  useEffect(() => {
    // Fetch session data on app load
    axios.get(`${apiUrl}/session`, { withCredentials: true })
      .then(response => {
        if (response.data.user) {
          setAuthenticated(true);
        } else {
          setAuthenticated(false);
        }
      })
      .catch(() => setAuthenticated(false)); // Handle session expiration
  }, []);

  if (authenticated === null) {
    return <div>Loading...</div>; // Show loading while checking session
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/Dashboard" element={authenticated ? <Market_details /> : <Navigate to="/" replace />} />
        <Route path="/search" element={authenticated ? <AppSearch /> : <Navigate to="/" replace />} />
        <Route path="/add_market" element={authenticated ? <MarcheForm /> : <Navigate to="/" replace />} />
        <Route path="/edit_market/:id" element={authenticated ? <Market_edit /> : <Navigate to="/" replace />} />
        <Route path="/manage_users" element={authenticated ? <UserManagement /> : <Navigate to="/" replace />} />
        <Route path="/add_titulaire" element={authenticated ? <TitulaireForm /> : <Navigate to="/" replace />} />
        <Route path="*" element={<div>Not Found - Error 404</div>} />
      </Routes>
    </Router>
  );
};

export default App;
