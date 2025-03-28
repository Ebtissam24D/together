import React, { useRef, useState } from "react";
import "./titulaireform.css";
import Layout from "../components/Layout";
import Main_container_head from "../components/Main_container_head";

const TitulaireForm = () => {
  // Form state
  const [formData, setFormData] = useState({
    raisonSociale: "",
    registreCommerce: "",
    patente: "",
    cnss: "",
    adresse: "",
    gerant: "",
    telephone: "",
    fax: "",
    email: "",
  });
  const [errors, setErrors] = useState({});
  const [focusedField, setFocusedField] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);

  // Input references
  const inputRefs = {
    raisonSociale: useRef(),
    registreCommerce: useRef(),
    patente: useRef(),
    cnss: useRef(),
    adresse: useRef(),
    gerant: useRef(),
    telephone: useRef(),
  };

  const faxInputRef = useRef();
  const emailInputRef = useRef();

  // Event handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleKeyDown = (e, nextField) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (nextField) {
        if (typeof nextField === "string" && inputRefs[nextField]) {
          inputRefs[nextField].current.focus();
        } else if (nextField.current) {
          nextField.current.focus();
        }
      }
    }
  };

  const handleEdit = (field) => {
    if (typeof field === "string" && inputRefs[field]) {
      inputRefs[field].current.focus();
    } else if (field && field.current) {
      field.current.focus();
    }
  };

  const handleClear = (field) => {
    setFormData((prev) => ({ ...prev, [field]: "" }));
  };

  const handleReset = () => {
    setFormData({
      raisonSociale: "",
      registreCommerce: "",
      patente: "",
      cnss: "",
      adresse: "",
      gerant: "",
      telephone: "",
      fax: "",
      email: "",
    });
    setErrors({});
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation simple
    const newErrors = {};
    if (!formData.raisonSociale) {
      newErrors.raisonSociale = "La raison sociale est requise";
    }
    if (!formData.telephone) {
      newErrors.telephone = "Le numéro de téléphone est requis";
    }
    if (!formData.email) {
      newErrors.email = "L'email est requis";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Format d'email invalide";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Soumission du formulaire
    setSuccessMessage("Titulaire enregistré avec succès!");
    setShowMessage(true);
    setTimeout(() => {
      setSuccessMessage("");
      setShowMessage(false);
    }, 3000);
  };

  // Styles pour les icônes dessinées
  const pencilIcon = (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ filter: "drop-shadow(1px 1px 1px rgba(0,0,0,0.3))" }}>
      <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
    </svg>
  );

  const trashIcon = (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ filter: "drop-shadow(1px 1px 1px rgba(0,0,0,0.3))" }}>
      <polyline points="3 6 5 6 21 6"></polyline>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    </svg>
  );

  return (
    <Layout>
        <Main_container_head text={'Ajouter titulaire'}/>
        <div className="form-container">
      <div className="back-link-container">
        <a href="#" className="back-link">
          <span className="back-arrow">←</span>
          <span id="A">Retour à la liste des titulaires</span>
        </a>
      </div>

      {/* Message overlay */}
      {showMessage && (
        <div className="message-overlay">
          <div className="message-container">{successMessage}</div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Raison Sociale */}
        <div className="form-group">
          <div className="form-row">
            <label className="form-label">
              Raison Sociale <span className="required">*</span>
            </label>
            <div className="input-container">
              <div className="input-wrapper">
                <input
                  ref={inputRefs.raisonSociale}
                  type="text"
                  name="raisonSociale"
                  value={formData.raisonSociale}
                  onChange={handleInputChange}
                  onKeyDown={(e) => handleKeyDown(e, "registreCommerce")}
                  className={`form-input ${
                    errors.raisonSociale ? "input-error" : ""
                  } ${focusedField === "raisonSociale" ? "input-focused" : ""}`}
                  onFocus={() => setFocusedField("raisonSociale")}
                  onBlur={() => setFocusedField(null)}
                />
                <p className="input-help">
                  Entrez le nom officiel de l'entreprise
                </p>
                {errors.raisonSociale && (
                  <p className="error-message">{errors.raisonSociale}</p>
                )}
              </div>
              <div className="action-buttons">
                <button
                  type="button"
                  onClick={() => handleEdit("raisonSociale")}
                  className="action-button"
                  title="Modifier">
                  {pencilIcon}
                </button>
                <button
                  type="button"
                  onClick={() => handleClear("raisonSociale")}
                  className="action-button"
                  title="Supprimer">
                  {trashIcon}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Registre de Commerce */}
        <div className="form-group">
          <div className="form-row">
            <label className="form-label">Registre de Commerce</label>
            <div className="input-container">
              <div className="input-wrapper">
                <input
                  ref={inputRefs.registreCommerce}
                  type="text"
                  name="registreCommerce"
                  value={formData.registreCommerce}
                  onChange={handleInputChange}
                  onKeyDown={(e) => handleKeyDown(e, "patente")}
                  className={`form-input ${
                    focusedField === "registreCommerce" ? "input-focused" : ""
                  }`}
                  onFocus={() => setFocusedField("registreCommerce")}
                  onBlur={() => setFocusedField(null)}
                />
                <p className="input-help">
                  Numéro d'inscription au registre du commerce
                </p>
              </div>
              <div className="action-buttons">
                <button
                  type="button"
                  onClick={() => handleEdit("registreCommerce")}
                  className="action-button"
                  title="Modifier">
                  {pencilIcon}
                </button>
                <button
                  type="button"
                  onClick={() => handleClear("registreCommerce")}
                  className="action-button"
                  title="Supprimer">
                  {trashIcon}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Patente */}
        <div className="form-group">
          <div className="form-row">
            <label className="form-label">Patente</label>
            <div className="input-container">
              <div className="input-wrapper">
                <input
                  ref={inputRefs.patente}
                  type="text"
                  name="patente"
                  value={formData.patente}
                  onChange={handleInputChange}
                  onKeyDown={(e) => handleKeyDown(e, "cnss")}
                  className={`form-input ${
                    focusedField === "patente" ? "input-focused" : ""
                  }`}
                  onFocus={() => setFocusedField("patente")}
                  onBlur={() => setFocusedField(null)}
                />
                <p className="input-help">Numéro de patente de l'entreprise</p>
              </div>
              <div className="action-buttons">
                <button
                  type="button"
                  onClick={() => handleEdit("patente")}
                  className="action-button"
                  title="Modifier">
                  {pencilIcon}
                </button>
                <button
                  type="button"
                  onClick={() => handleClear("patente")}
                  className="action-button"
                  title="Supprimer">
                  {trashIcon}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* CNSS */}
        <div className="form-group">
          <div className="form-row">
            <label className="form-label">CNSS</label>
            <div className="input-container">
              <div className="input-wrapper">
                <input
                  ref={inputRefs.cnss}
                  type="text"
                  name="cnss"
                  value={formData.cnss}
                  onChange={handleInputChange}
                  onKeyDown={(e) => handleKeyDown(e, "adresse")}
                  className={`form-input ${
                    focusedField === "cnss" ? "input-focused" : ""
                  }`}
                  onFocus={() => setFocusedField("cnss")}
                  onBlur={() => setFocusedField(null)}
                />
                <p className="input-help">Numéro de sécurité sociale</p>
              </div>
              <div className="action-buttons">
                <button
                  type="button"
                  onClick={() => handleEdit("cnss")}
                  className="action-button"
                  title="Modifier">
                  {pencilIcon}
                </button>
                <button
                  type="button"
                  onClick={() => handleClear("cnss")}
                  className="action-button"
                  title="Supprimer">
                  {trashIcon}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Adresse */}
        <div className="form-group">
          <div className="form-row form-row-textarea">
            <label className="form-label">Adresse</label>
            <div className="input-container">
              <div className="input-wrapper">
                <textarea
                  ref={inputRefs.adresse}
                  name="adresse"
                  value={formData.adresse}
                  onChange={handleInputChange}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && e.ctrlKey) {
                      handleKeyDown(e, "gerant");
                    }
                  }}
                  rows="3"
                  className={`form-textarea ${
                    focusedField === "adresse" ? "input-focused" : ""
                  }`}
                  onFocus={() => setFocusedField("adresse")}
                  onBlur={() => setFocusedField(null)}></textarea>
                <p className="input-help">
                  Adresse complète de l'entreprise (Ctrl+Entrée pour aller au
                  champ suivant)
                </p>
              </div>
              <div className="action-buttons">
                <button
                  type="button"
                  onClick={() => handleEdit("adresse")}
                  className="action-button"
                  title="Modifier">
                  {pencilIcon}
                </button>
                <button
                  type="button"
                  onClick={() => handleClear("adresse")}
                  className="action-button"
                  title="Supprimer">
                  {trashIcon}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Gérant */}
        <div className="form-group">
          <div className="form-row">
            <label className="form-label">Gérant</label>
            <div className="input-container">
              <div className="input-wrapper">
                <input
                  ref={inputRefs.gerant}
                  type="text"
                  name="gerant"
                  value={formData.gerant}
                  onChange={handleInputChange}
                  onKeyDown={(e) => handleKeyDown(e, "telephone")}
                  className={`form-input ${
                    focusedField === "gerant" ? "input-focused" : ""
                  }`}
                  onFocus={() => setFocusedField("gerant")}
                  onBlur={() => setFocusedField(null)}
                />
                <p className="input-help">Nom du gérant de l'entreprise</p>
              </div>
              <div className="action-buttons">
                <button
                  type="button"
                  onClick={() => handleEdit("gerant")}
                  className="action-button"
                  title="Modifier">
                  {pencilIcon}
                </button>
                <button
                  type="button"
                  onClick={() => handleClear("gerant")}
                  className="action-button"
                  title="Supprimer">
                  {trashIcon}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Téléphone */}
        <div className="form-group">
          <div className="form-row">
            <label className="form-label">
              Téléphone <span className="required">*</span>
            </label>
            <div className="input-container">
              <div className="input-wrapper">
                <input
                  ref={inputRefs.telephone}
                  type="text"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleInputChange}
                  onKeyDown={(e) => handleKeyDown(e, faxInputRef)}
                  placeholder="XXXXXXXXXX"
                  className={`form-input ${
                    errors.telephone ? "input-error" : ""
                  } ${focusedField === "telephone" ? "input-focused" : ""}`}
                  onFocus={() => setFocusedField("telephone")}
                  onBlur={() => setFocusedField(null)}
                />
                <p className="input-help">Format: XXXXXXXXXX</p>
                {errors.telephone && (
                  <p className="error-message">{errors.telephone}</p>
                )}
              </div>
              <div className="action-buttons">
                <button
                  type="button"
                  onClick={() => handleEdit("telephone")}
                  className="action-button"
                  title="Modifier">
                  {pencilIcon}
                </button>
                <button
                  type="button"
                  onClick={() => handleClear("telephone")}
                  className="action-button"
                  title="Supprimer">
                  {trashIcon}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Fax */}
        <div className="form-group">
          <div className="form-row">
            <label className="form-label">Fax</label>
            <div className="input-container">
              <div className="input-wrapper">
                <input
                  ref={faxInputRef}
                  type="text"
                  name="fax"
                  value={formData.fax}
                  onChange={handleInputChange}
                  onKeyDown={(e) => handleKeyDown(e, emailInputRef)}
                  placeholder="XXXXXXXXXX"
                  className={`form-input ${errors.fax ? "input-error" : ""}`}
                />
                <p className="input-help">Format: XXXXXXXXXX</p>
                {errors.fax && <p className="error-message">{errors.fax}</p>}
              </div>
              <div className="action-buttons">
                <button
                  type="button"
                  onClick={() => handleEdit(faxInputRef)}
                  className="action-button"
                  title="Modifier">
                  {pencilIcon}
                </button>
                <button
                  type="button"
                  onClick={() => handleClear("fax")}
                  className="action-button"
                  title="Supprimer">
                  {trashIcon}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Email */}
        <div className="form-group">
          <div className="form-row">
            <label className="form-label">
              Email <span className="required">*</span>
            </label>
            <div className="input-container">
              <div className="input-wrapper">
                <input
                  ref={emailInputRef}
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  onKeyDown={(e) => handleKeyDown(e, null)}
                  placeholder="exemple@domaine.com"
                  className={`form-input ${errors.email ? "input-error" : ""}`}
                />
                <p className="input-help">exemple@domaine.com</p>
                {errors.email && (
                  <p className="error-message">{errors.email}</p>
                )}
              </div>
              <div className="action-buttons">
                <button
                  type="button"
                  onClick={() => handleEdit(emailInputRef)}
                  className="action-button"
                  title="Modifier">
                  {pencilIcon}
                </button>
                <button
                  type="button"
                  onClick={() => handleClear("email")}
                  className="action-button"
                  title="Supprimer">
                  {trashIcon}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="form-actions">
          <button
            type="button"
            onClick={handleReset}
            className="button button-secondary">
            Réinitialiser
          </button>
          <button type="submit" className="button button-primary">
            Valider
          </button>
        </div>
      </form>
    </div>
    </Layout>
  );
};

export default TitulaireForm;
