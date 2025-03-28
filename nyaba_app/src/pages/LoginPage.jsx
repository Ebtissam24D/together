import React, { useState } from "react";
import "./loginpage.css"; // Importez le fichier CSS
import Header from "../components/header";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LoginPage = () => {
  const [user_name, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const apiUrl =import.meta.env.VITE_API_BACKEND_URL; 
  const handleSubmit =async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    // Simulation d'une vérification d'authentification
  const response = await axios.post(`${apiUrl}/login`, {
      user_name,
      password,
    });
    if (response.data) {
      // Authentification réussie, rediriger vers la page de recherche
      navigate("/Dashboard");
    } else {
      // Authentification échouée, afficher un message d'erreur
      setErrorMessage("Nom d'utilisateur ou mot de passe incorrect.");
    }
    setIsLoading(false);
  }

  return (
    <>
      <Header />
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h2 className="login-title">Connexion</h2>
            <p className="login-subtitle">
              Entrez vos identifiants pour vous connecter
            </p>
          </div>

          {errorMessage && <div className="error-message">{errorMessage}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="text" className="form-label">
                Nom d'utilisateur
              </label>
              <input
                
                type="text"
                required
                value={user_name}
                onChange={(e) => setUsername(e.target.value)}
                className="form-input"
                placeholder="votre nom d'utilisateur"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Mot de passe
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                placeholder="••••••••"
              />
            </div>



            <button
              type="submit"
              disabled={isLoading}
              className="submit-button">
              {isLoading ? "Connexion en cours..." : "Se connecter"}
            </button>
          </form>
              

        </div>
      </div>
    </>
  );
};

export default LoginPage;
