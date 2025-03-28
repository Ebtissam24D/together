import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import Main_container_head from "../components/Main_container_head";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./Market_edit.css";

const Market_edit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    numero_aoo: "",
    numero_marche: "",
    annee_budgetaire: "",
    objet: "",
    date_approbation: "",
    status: "",
    raison_sociale: "",
    registre_commerce: "",
    patente: "",
    cnss: "",
    adresse: "",
    gerant: "",
    telephone: "",
    fax: "",
    email: ""
  });
  const appBackend = import.meta.env.VITE_API_BACKEND_URL;
  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const response = await axios.get(
          `${appBackend}/marches/${id}`
        );
        
        // Transform API response to match form field names
        setFormData({
          numero_aoo: response.data.numero_aoo || "",
          numero_marche: response.data.numero_marche|| "",
          annee_budgetaire: response.data.annee_budgetaire|| "",
          objet: response.data.objet || "",
          date_approbation: response.data.date_approbation|| "",
          status: response.data.status || "",
          entreprise_id : response.data.entreprise_id || "",
          raison_sociale: response.data.raison_sociale || "",
          registre_commerce: response.data.registre_commerce || "",
          patente: response.data.patente || "",
          cnss: response.data.cnss || "",
          adresse: response.data.adresse || "",
          gerant: response.data.gerant || "",
          telephone: response.data.telephone || "",
          fax: response.data.fax || "",
          email: response.data.email || "",
        });
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
        alert("Impossible de charger les données du marché");
        setLoading(false);
      }
    };

    fetchMarketData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const id_p = formData.entreprise_id;
    const etrepriseData = {
      
      raison_sociale: formData.raison_sociale,
      registre_commerce: formData.registre_commerce,
      patente: formData.patente,
      cnss: formData.cnss,
      adresse: formData.adresse,
      gerant: formData.gerant,
      telephone: formData.telephone,
      fax: formData.fax,
      email: formData.email,
    };
    const marcheData = {
      numero_aoo: formData.numero_aoo,    
      numero_marche: formData.numero_marche,
      annee_budgetaire: formData.annee_budgetaire,
      objet: formData.objet,
      date_approbation: formData.date_approbation,
      status: formData.status,
    };
    try {
      const response = await axios.put(
        `${appBackend}/marches/${id}`,
        marcheData
      );
      const response2 = await axios.put(
        `${appBackend}/entreprises/${id_p}`,
        etrepriseData
      );
      if (response.status !== 200 || response2.status !== 200) {
        throw new Error("Erreur lors de la mise à jour du marché");
      }
      alert(response2.data.message || "Entreprise mis à jour avec succès");
      alert(response.data.message || "Marché mis à jour avec succès");
      navigate("/Dashboard"); // Rediriger vers la liste des marchés
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      alert("Erreur lors de la mise à jour du marché");
    }
  };

  const handleCancel = () => {
    navigate("/Dashboard");
  };

  if (loading) {
    return (
      <Layout>
        <div className="main-container">
          <Main_container_head text={"Modification du Marché"} />
          <div className="loading">Chargement des données...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="main-container">
        <Main_container_head text={"Modification du Marché"} />
        
        <form onSubmit={handleSubmit} className="edit-form">
          <div className="form-section">
            <h3>Informations du Marché</h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="numero_aoo">Numéro AOO</label>
                <input
                  type="text"
                  id="numero_aoo"
                  name="numero_aoo"
                  value={formData.numero_aoo}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="numero_marche">Numéro Marché</label>
                <input
                  type="text"
                  id="numero_marche"
                  name="numero_marche"
                  value={formData.numero_marche}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="annee_budgetaire">Année Budgétaire</label>
                <input
                  type="text"
                  id="annee_budgetaire"
                  name="annee_budgetaire"
                  value={formData.annee_budgetaire}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="date_approbation">Date d'approbation</label>
                <input
                  type="date"
                  id="date_approbation"
                  name="date_approbation"
                  value={formData.date_approbation}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group full-width">
                <label htmlFor="objet">Objet du marché</label>
                <textarea
                  id="objet"
                  name="objet"
                  value={formData.objet}
                  onChange={handleChange}
                  required
                  rows="3"
                ></textarea>
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="status">Statut</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                >
                  {/* <option value="">-- Sélectionner --</option> */}
                  <option value="0" selected={formData.status==0}>Soldé</option>
                  <option value="1" selected={formData.status==1}>En cours</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="form-section">
            <h3>Informations de l'Attributaire</h3>
            <div className="form-row">
              <div className="form-group full-width">
                <label htmlFor="raison_sociale">Raison Sociale</label>
                <input
                  type="text"
                  id="raison_sociale"
                  name="raison_sociale"
                  value={formData.raison_sociale}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="registre_commerce">Registre Commerce</label>
                <input
                  type="text"
                  id="registre_commerce"
                  name="registre_commerce"
                  value={formData.registre_commerce}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="patente">Patente</label>
                <input
                  type="text"
                  id="patente"
                  name="patente"
                  value={formData.patente}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="cnss">CNSS</label>
                <input
                  type="text"
                  id="cnss"
                  name="cnss"
                  value={formData.cnss}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="gerant">Gérant</label>
                <input
                  type="text"
                  id="gerant"
                  name="gerant"
                  value={formData.gerant}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group full-width">
                <label htmlFor="adresse">Adresse</label>
                <input
                  type="text"
                  id="adresse"
                  name="adresse"
                  value={formData.adresse}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="telephone">Téléphone</label>
                <input
                  type="text"
                  id="telephone"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="fax">Fax</label>
                <input
                  type="text"
                  id="fax"
                  name="fax"
                  value={formData.fax}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group full-width">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
          
          <div className="form-actions">
            <button type="button" className="btn btn-cancel" onClick={handleCancel}>
              Annuler
            </button>
            <button type="submit" className="btn btn-save">
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default Market_edit;