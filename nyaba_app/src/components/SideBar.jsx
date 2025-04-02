import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const SideBar = () => {
  const [activeView, setActiveView] = useState("dashboard");
  const navigate = useNavigate();
  const handleNavClick = (view) => {
    setActiveView(view);
  };
  const apiUrl = import.meta.env.VITE_API_BACKEND_URL;
  const handleLogout = async () => {
    localStorage.removeItem('user')
    try {
      // Sending POST request to logout
      const response = await axios.post(`${apiUrl}/logout`);

      if (response.data.message === "Logged out successfully.") {
        // Redirect to login page after logout
        navigate("/");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  return (
    <nav className="sidebar">
      {JSON.parse(localStorage.getItem("user")).role == "admin" && (
      <Link to={"/manage_users"} className="link">
        <i className="fas fa-users"></i> 
        <p>Gestion des Utilisateurs</p>
      </Link>
      )}
      <Link
        to={"/dashboard"}
        onClick={() => handleNavClick("dashboard")}
        className={`${
          activeView === "dashboard" ? "link bg-blue-900" : "link"
        }`}
      >
        <i className="fas fa-home"></i>
        <p>Accueil</p>
      </Link>

      <Link to={"/add_market"} className="link">
        <i className="fas fa-pencil"></i>
        <p>Saisie des Marchés</p>
      </Link>
      <Link to={"/add_titulaire"} className="link">
        <i className="fas fa-pencil"></i>
        <p>Saisie des Titulaires</p>
      </Link>
      <Link to={"/search"} className="link">
        <i className="fas fa-search"></i>
        <p>Rechercher des Marchés</p>
      </Link >
        <button type="button" onClick={handleLogout} className="link">
          <i className="fas fa-sign-out-alt"></i>
          <p>Déconnexion</p>
        </button> 
  
    </nav>
  );
};

export default SideBar;
