import React, { useState } from "react";
import '../App.css';
import { searchForm } from "./components.module.css";

const SearchForm = ({ onSearch }) => {
  const [formData, setFormData] = useState({
    annee_budgetaire: "2025",
    numero_marche: "",
    numero_aoo: "",
    nom_entreprise: "",
    nature_marche: "",
    visa: "" // Added the 'visa' field to the initial state
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(formData);
  };

  return (
    <form className={searchForm} onSubmit={handleSubmit}>
      <label htmlFor="annee_budgetaire">Année Budgétaire</label>
      <select
        id="annee_budgetaire"
        name="annee_budgetaire"
        value={formData.annee_budgetaire}
        onChange={handleChange}
      >
        {Array.from({ length: new Date().getFullYear() - 1999 }, (_, i) => {
          const year = 2000 + i;
          return (
            <option key={year} value={year}>
              {year}
            </option>
          );
        })}
      </select>

      <label htmlFor="numero_marche">Numéro de Marché</label>
        <input
          type="number"
          id="numero_marche"
          name="numero_marche"
          value={formData.numero_marche}
          onChange={(e) => {
            const value = e.target.value;
            if (value >= 0) {
              handleChange(e);
            }
          }}
        />

      <label htmlFor="numero_aoo">Numéro AOO</label>
      <input
        type="number"
        id="numero_aoo"
        name="numero_aoo"
        value={formData.numero_aoo}
        onChange={(e) => {
          const value = e.target.value;
          if (value >= 0) {
            handleChange(e);
          }
        }}
      />


      <label htmlFor="nom_entreprise">Nom de l'entreprise</label>
      <input
        type="text"
        id="nom_entreprise"
        name="nom_entreprise"
        value={formData.nom_entreprise}
        onChange={handleChange}
      />

      <label htmlFor="nature_marche">Nature du Marché</label>
      <select
        id="nature_marche"
        name="nature_marche"
        value={formData.nature_marche}
        onChange={handleChange}
      >
        <option value="">Sélectionnez la nature</option>
        <option value="equipement">Équipement</option>
        <option value="etude">Étude</option>
        <option value="travaux">Travaux</option>
      </select>

      <label htmlFor="visa">Visa</label>
      <select
        name="visa"
        id="visa"
        value={formData.visa} // Corrected to use 'visa' from formData
        onChange={handleChange}
      >
        <option value="">Sélectionnez le visa</option>
        <option value="visa1">Oui</option>
        <option value="visa2">Non</option>
      </select>

      <button className="btn_search" type="submit">Rechercher</button>
    </form>
  );
};

export default SearchForm;
