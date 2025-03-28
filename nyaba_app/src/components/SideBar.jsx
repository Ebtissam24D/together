import React, { useState } from "react";
import { Link } from "react-router-dom";

const SideBar = () => {
  const [activeView, setActiveView] = useState("dashboard");
  const handleNavClick = (view) => {
    setActiveView(view);
  };
  return (
    <nav className="sidebar">
      <Link
        to={"/dashboard"}
        onClick={() => handleNavClick("dashboard")}
        className={`${
          activeView === "dashboard" ? "link bg-blue-900" : "link"
        }`}>
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
      </Link>
      <Link to={"/"} className="link">
        <i className="fas fa-sign-out-alt"></i>
        <p>Déconnexion</p>
      </Link>
    </nav>
  );
};

export default SideBar;
