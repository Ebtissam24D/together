import React, { useRef, useState } from "react";
import Layout from "../components/Layout";
import "./marcheform.css";
import Main_container_head from "../components/Main_container_head";

// Composant MarcheForm
const MarcheForm = () => {
  // Form state
  const [formData, setFormData] = useState({
    directionProvinciale: "Direction Errachidia",
    anneeBudgetaire: "",
    numeroAOO: "",
    numeroMarche: "", 
    natureBudget: "",
    natureMarche: "",
    objet: "",
    montantOffreTTC: "",
    estimationOffreTTC: "",
    caution: "",
    delaiExecution: "",
  });
  const [errors, setErrors] = useState({});
  const [focusedField, setFocusedField] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);

  // Input references
  const inputRefs = {
    directionProvinciale: useRef(),
    anneeBudgetaire: useRef(),
    numeroAOO: useRef(),
    numeroMarche: useRef(),
    natureBudget: useRef(),
    natureMarche: useRef(),
    objet: useRef(),
    montantOffreTTC: useRef(),
    estimationOffreTTC: useRef(),
    caution: useRef(),
    delaiExecution: useRef(),
  };

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
      directionProvinciale: "Direction Errachidia",
      anneeBudgetaire: "",
      numeroAOO: "",
      numeroMarche: "",
      natureBudget: "",
      natureMarche: "",
      objet: "",
      montantOffreTTC: "",
      estimationOffreTTC: "",
      caution: "",
      delaiExecution: "",
    });
    setErrors({});
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation simple
    const newErrors = {};
    if (!formData.directionProvinciale) {
      newErrors.directionProvinciale = "La direction provinciale est requise";
    }
    if (!formData.anneeBudgetaire) {
      newErrors.anneeBudgetaire = "L'année budgétaire est requise";
    }
    if (!formData.objet) {
      newErrors.objet = "L'objet du marché est requis";
    }
    if (!formData.montantOffreTTC) {
      newErrors.montantOffreTTC = "Le montant de l'offre est requis";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Soumission du formulaire
    setSuccessMessage("Marché enregistré avec succès!");
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
  const [xmlFile, setXmlFile] = useState(null);
  const [xmlContent, setXmlContent] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const previewRef = useRef(null);

  // Ajoutez ces gestionnaires d'événements
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setXmlFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setXmlContent(event.target.result);
      };
      reader.readAsText(file);
    }
  };

  const handleXmlContentChange = (e) => {
    setXmlContent(e.target.value);
  };

  const handlePreview = () => {
    setShowPreview(true);
  };

  const handlePrint = () => {
    if (previewRef.current) {
      const printWindow = window.open("", "_blank");
      printWindow.document.write(
        `<html>
          <head>
            <title>Marché - Aperçu d'impression</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              h1 { color: #2c3e50; }
              .print-section { margin-bottom: 20px; }
              .field-name { font-weight: bold; color: #34495e; }
            </style>
          </head>
          <body>
            ${previewRef.current.innerHTML}
          </body>
        </html>`
      );
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
    }
  };

  return (
    <Layout>
        <Main_container_head text={'Ajouter marche'}/>
      <div className="form-container">
        <div className="back-link-container">
          <a href="#" className="back-link">
            <span className="back-arrow">←</span>
            <span id="A">Retour à la liste des marchés</span>
          </a>
        </div>

        {/* Message overlay */}
        {showMessage && (
          <div className="message-overlay">
            <div className="message-container">{successMessage}</div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Direction Provinciale */}
          <div className="form-group">
            <div className="form-row">
              <label className="form-label">
                DIRECTION PROVINCIALE <span className="required">*</span>
              </label>
              <div className="input-container">
                <div className="input-wrapper">
                  <input
                    ref={inputRefs.directionProvinciale}
                    type="text"
                    name="directionProvinciale"
                    value={formData.directionProvinciale}
                    onChange={handleInputChange}
                    onKeyDown={(e) => handleKeyDown(e, "anneeBudgetaire")}
                    className={`form-input ${
                      errors.directionProvinciale ? "input-error" : ""
                    } ${
                      focusedField === "directionProvinciale"
                        ? "input-focused"
                        : ""
                    }`}
                    onFocus={() => setFocusedField("directionProvinciale")}
                    onBlur={() => setFocusedField(null)}
                  />
                  <p className="input-help">Nom de la direction provinciale</p>
                  {errors.directionProvinciale && (
                    <p className="error-message">
                      {errors.directionProvinciale}
                    </p>
                  )}
                </div> 
                <div className="action-buttons">
                  <button
                    type="button"
                    onClick={() => handleEdit("directionProvinciale")}
                    className="action-button"
                    title="Modifier">
                    {pencilIcon}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleClear("directionProvinciale")}
                    className="action-button"
                    title="Supprimer">
                    {trashIcon}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Année Budgétaire */}
          <div className="form-group">
            <div className="form-row">
              <label className="form-label">
                ANNÉE BUDGÉTAIRE <span className="required">*</span>
              </label>
              <div className="input-container">
                <div className="input-wrapper">
                  <input
                    ref={inputRefs.anneeBudgetaire}
                    type="date"
                    name="anneeBudgetaire"
                    value={formData.anneeBudgetaire}
                    onChange={handleInputChange}
                    onKeyDown={(e) => handleKeyDown(e, "numeroAOO")}
                    className={`form-input ${
                      errors.anneeBudgetaire ? "input-error" : ""
                    } ${
                      focusedField === "anneeBudgetaire" ? "input-focused" : ""
                    }`}
                    onFocus={() => setFocusedField("anneeBudgetaire")}
                    onBlur={() => setFocusedField(null)}
                  />
                  <p className="input-help">
                    Sélectionnez la date de l'année budgétaire
                  </p>
                  {errors.anneeBudgetaire && (
                    <p className="error-message">{errors.anneeBudgetaire}</p>
                  )}
                </div>
                <div className="action-buttons">
                  <button
                    type="button"
                    onClick={() => handleEdit("anneeBudgetaire")}
                    className="action-button"
                    title="Modifier">
                    {pencilIcon}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleClear("anneeBudgetaire")}
                    className="action-button"
                    title="Supprimer">
                    {trashIcon}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Numéro AOO */}
          <div className="form-group">
            <div className="form-row">
              <label className="form-label">Numéro AOO</label>
              <div className="input-container">
                <div className="input-wrapper">
                  <input
                    ref={inputRefs.numeroAOO}
                    type="text"
                    name="numeroAOO"
                    value={formData.numeroAOO}
                    onChange={handleInputChange}
                    onKeyDown={(e) => handleKeyDown(e, "numeroMarche")}
                    className={`form-input ${
                      focusedField === "numeroAOO" ? "input-focused" : ""
                    }`}
                    onFocus={() => setFocusedField("numeroAOO")}
                    onBlur={() => setFocusedField(null)}
                  />
                  <p className="input-help">Numéro d'appel d'offre ouvert</p>
                </div>
                <div className="action-buttons">
                  <button
                    type="button"
                    onClick={() => handleEdit("numeroAOO")}
                    className="action-button"
                    title="Modifier">
                    {pencilIcon}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleClear("numeroAOO")}
                    className="action-button"
                    title="Supprimer">
                    {trashIcon}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Numéro Marché */}
          <div className="form-group">
            <div className="form-row">
              <label className="form-label">Numéro Marché</label>
              <div className="input-container">
                <div className="input-wrapper">
                  <input
                    ref={inputRefs.numeroMarche}
                    type="text"
                    name="numeroMarche"
                    value={formData.numeroMarche}
                    onChange={handleInputChange}
                    onKeyDown={(e) => handleKeyDown(e, "natureBudget")}
                    className={`form-input ${
                      focusedField === "numeroMarche" ? "input-focused" : ""
                    }`}
                    onFocus={() => setFocusedField("numeroMarche")}
                    onBlur={() => setFocusedField(null)}
                  />
                  <p className="input-help">Numéro de référence du marché</p>
                </div>
                <div className="action-buttons">
                  <button
                    type="button"
                    onClick={() => handleEdit("numeroMarche")}
                    className="action-button"
                    title="Modifier">
                    {pencilIcon}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleClear("numeroMarche")}
                    className="action-button"
                    title="Supprimer">
                    {trashIcon}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Nature de Budget */}
          <div className="form-group">
            <div className="form-row">
              <label className="form-label">Nature de Budget</label>
              <div className="input-container">
                <div className="input-wrapper">
                  <input
                    ref={inputRefs.natureBudget}
                    type="text"
                    name="natureBudget"
                    value={formData.natureBudget}
                    onChange={handleInputChange}
                    onKeyDown={(e) => handleKeyDown(e, "natureMarche")}
                    className={`form-input ${
                      focusedField === "natureBudget" ? "input-focused" : ""
                    }`}
                    onFocus={() => setFocusedField("natureBudget")}
                    onBlur={() => setFocusedField(null)}
                  />
                  <p className="input-help">Type de budget alloué</p>
                </div>
                <div className="action-buttons">
                  <button
                    type="button"
                    onClick={() => handleEdit("natureBudget")}
                    className="action-button"
                    title="Modifier">
                    {pencilIcon}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleClear("natureBudget")}
                    className="action-button"
                    title="Supprimer">
                    {trashIcon}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Nature du Marché */}
          <div className="form-group">
            <div className="form-row">
              <label className="form-label">Nature du Marché</label>
              <div className="input-container">
                <div className="input-wrapper">
                  <select
                    ref={inputRefs.natureMarche}
                    name="natureMarche"
                    value={formData.natureMarche}
                    onChange={handleInputChange}
                    onKeyDown={(e) => handleKeyDown(e, "objet")}
                    className={`form-input ${
                      focusedField === "natureMarche" ? "input-focused" : ""
                    }`}
                    onFocus={() => setFocusedField("natureMarche")}
                    onBlur={() => setFocusedField(null)}
                  >
                    <option value="">Sélectionnez la nature</option>
                    <option value="equipement">Équipement</option>
                    <option value="etude">Étude</option>
                    <option value="travaux">Travaux</option>
                  </select>
                  <p className="input-help">Sélectionnez la nature du marché</p>
                </div>
                <div className="action-buttons">
                  <button
                    type="button"
                    onClick={() => handleEdit("natureMarche")}
                    className="action-button"
                    title="Modifier">
                    {pencilIcon}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleClear("natureMarche")}
                    className="action-button"
                    title="Supprimer">
                    {trashIcon}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Objet */}
          <div className="form-group">
            <div className="form-row-form-row-textarea">
              <label className="form-label">
                Objet <span className="required">*</span>
              </label>
              <div className="input-container">
                <div className="input-wrapper">
                  <textarea
                    ref={inputRefs.objet}
                    name="objet"
                    value={formData.objet}
                    onChange={handleInputChange}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && e.ctrlKey) {
                        handleKeyDown(e, "montantOffreTTC");
                      }
                    }}
                    rows={4}
                    cols={70}
                    className={`form-textarea ${
                      errors.objet ? "input-error" : ""
                    } ${focusedField === "objet" ? "input-focused" : ""}`}
                    onFocus={() => setFocusedField("objet")}
                    onBlur={() => setFocusedField(null)}></textarea>
                  <p className="input-help">
                    Description de l'objet du marché (Ctrl+Entrée pour aller au
                    champ suivant)
                  </p>
                  {errors.objet && (
                    <p className="error-message">{errors.objet}</p>
                  )}
                </div>
                <div className="action-buttons">
                  <button
                    type="button"
                    onClick={() => handleEdit("objet")}
                    className="action-button"
                    title="Modifier">
                    {pencilIcon}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleClear("objet")}
                    className="action-button"
                    title="Supprimer">
                    {trashIcon}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Montant Offre en TTC */}
          <div className="form-group">
            <div className="form-row">
              <label className="form-label">
                Montant Offre en TTC <span className="required">*</span>
              </label>
              <div className="input-container">
                <div className="input-wrapper">
                  <input
                    ref={inputRefs.montantOffreTTC}
                    type="number"
                    name="montantOffreTTC"
                    value={formData.montantOffreTTC}
                    onChange={handleInputChange}
                    onKeyDown={(e) => handleKeyDown(e, "estimationOffreTTC")}
                    className={`form-input ${
                      errors.montantOffreTTC ? "input-error" : ""
                    } ${
                      focusedField === "montantOffreTTC" ? "input-focused" : ""
                    }`}
                    onFocus={() => setFocusedField("montantOffreTTC")}
                    onBlur={() => setFocusedField(null)}
                  />
                  <p className="input-help">Montant de l'offre en TTC (DH)</p>
                  {errors.montantOffreTTC && (
                    <p className="error-message">{errors.montantOffreTTC}</p>
                  )}
                </div>
                <div className="action-buttons">
                  <button
                    type="button"
                    onClick={() => handleEdit("montantOffreTTC")}
                    className="action-button"
                    title="Modifier">
                    {pencilIcon}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleClear("montantOffreTTC")}
                    className="action-button"
                    title="Supprimer">
                    {trashIcon}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Estimation offre en TTC */}
          <div className="form-group">
            <div className="form-row">
              <label className="form-label">Estimation offre en TTC</label>
              <div className="input-container">
                <div className="input-wrapper">
                  <input
                    ref={inputRefs.estimationOffreTTC}
                    type="number"
                    name="estimationOffreTTC"
                    value={formData.estimationOffreTTC}
                    onChange={handleInputChange}
                    onKeyDown={(e) => handleKeyDown(e, "caution")}
                    className={`form-input ${
                      focusedField === "estimationOffreTTC"
                        ? "input-focused"
                        : ""
                    }`}
                    onFocus={() => setFocusedField("estimationOffreTTC")}
                    onBlur={() => setFocusedField(null)}
                  />
                  <p className="input-help">
                    Estimation de l'offre en TTC (DH)
                  </p>
                </div>
                <div className="action-buttons">
                  <button
                    type="button"
                    onClick={() => handleEdit("estimationOffreTTC")}
                    className="action-button"
                    title="Modifier">
                    {pencilIcon}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleClear("estimationOffreTTC")}
                    className="action-button"
                    title="Supprimer">
                    {trashIcon}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Caution */}
          <div className="form-group">
            <div className="form-row">
              <label className="form-label">Caution</label>
              <div className="input-container">
                <div className="input-wrapper">
                  <input
                    ref={inputRefs.caution}
                    type="text"
                    name="caution"
                    value={formData.caution}
                    onChange={handleInputChange}
                    onKeyDown={(e) => handleKeyDown(e, "delaiExecution")}
                    className={`form-input ${
                      focusedField === "caution" ? "input-focused" : ""
                    }`}
                    onFocus={() => setFocusedField("caution")}
                    onBlur={() => setFocusedField(null)}
                  />
                  <p className="input-help">Montant de la caution</p>
                </div>
                <div className="action-buttons">
                  <button
                    type="button"
                    onClick={() => handleEdit("caution")}
                    className="action-button"
                    title="Modifier">
                    {pencilIcon}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleClear("caution")}
                    className="action-button"
                    title="Supprimer">
                    {trashIcon}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Délai exécution */}
          <div className="form-group">
            <div className="form-row">
              <label className="form-label">Délai exécution</label>
              <div className="input-container">
                <div className="input-wrapper">
                  <input
                    ref={inputRefs.delaiExecution}
                    type="number"
                    name="delaiExecution"
                    value={formData.delaiExecution}
                    onChange={handleInputChange}
                    className={`form-input ${
                      focusedField === "delaiExecution" ? "input-focused" : ""
                    }`}
                    onFocus={() => setFocusedField("delaiExecution")}
                    onBlur={() => setFocusedField(null)}
                  />
                  <p className="input-help">Délai d'exécution en jours</p>
                </div>
                <div className="action-buttons">
                  <button
                    type="button"
                    onClick={() => handleEdit("delaiExecution")}
                    className="action-button"
                    title="Modifier">
                    {pencilIcon}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleClear("delaiExecution")}
                    className="action-button"
                    title="Supprimer">
                    {trashIcon}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Espace supplémentaire comme demandé */}
          <div className="additional-space">
            {/* Espace vide pour l'affichage d'informations supplémentaires si nécessaire */}
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
          {/* Section pour importer et éditer le fichier XML */}
          <div className="form-group xml-section">
            <h2 className="section-title">Gestion du document XML</h2>

            <div className="xml-upload-container">
              <div className="upload-section">
                <label htmlFor="xml-file" className="file-label">
                  Importer un fichier XML
                </label>
                <input
                  type="file"
                  id="xml-file"
                  accept=".xml"
                  onChange={handleFileChange}
                  className="file-input"
                />
                <button
                  type="button"
                  className="button button-secondary"
                  onClick={() => document.getElementById("xml-file").click()}>
                  Parcourir
                </button>
              </div>

              {xmlFile && (
                <div className="file-info">
                  <p>Fichier sélectionné: {xmlFile.name}</p>
                </div>
              )}
            </div>

            <div className="xml-edit-container">
              <label htmlFor="xml-content" className="xml-label">
                Modifier le contenu XML
              </label>
              <textarea
                id="xml-content"
                value={xmlContent}
                onChange={handleXmlContentChange}
                className="xml-textarea"
                rows="8"
                placeholder="Le contenu XML s'affichera ici après l'importation d'un fichier"></textarea>
            </div>

            <div className="xml-actions">
              <button
                type="button"
                className="button button-secondary"
                onClick={handlePreview}
                disabled={!xmlContent}>
                Aperçu du document
              </button>
              <button
                type="button"
                className="button button-primary"
                onClick={handlePrint}
                disabled={!xmlContent}>
                Imprimer
              </button>
            </div>
          </div>

          {/* Section d'aperçu du document */}
          {showPreview && (
            <div className="preview-overlay">
              <div className="preview-container">
                <div className="preview-header">
                  <h2>Aperçu du document</h2>
                  <button
                    className="close-preview"
                    onClick={() => setShowPreview(false)}>
                    ×
                  </button>
                </div>
                <div className="preview-content" ref={previewRef}>
                  <h1>Marché: {formData.numeroMarche || "Non spécifié"}</h1>
                  <div className="print-section">
                    <p>
                      <span className="field-name">Direction Provinciale:</span>{" "}
                      {formData.directionProvinciale}
                    </p>
                    <p>
                      <span className="field-name">Année Budgétaire:</span>{" "}
                      {formData.anneeBudgetaire}
                    </p>
                    <p>
                      <span className="field-name">Numéro AOO:</span>{" "}
                      {formData.numeroAOO}
                    </p>
                    <p>
                      <span className="field-name">Numéro Marché:</span>{" "}
                      {formData.numeroMarche}
                    </p>
                    <p>
                      <span className="field-name">Nature de Budget:</span>{" "}
                      {formData.natureBudget}
                    </p>
                    <p>
                      <span className="field-name">Nature du Marché:</span>{" "}
                      {formData.natureMarche}
                    </p>
                    <p>
                      <span className="field-name">Objet:</span>{" "}
                      {formData.objet}
                    </p>
                    <p>
                      <span className="field-name">Montant Offre en TTC:</span>{" "}
                      {formData.montantOffreTTC} DH
                    </p>
                    <p>
                      <span className="field-name">
                        Estimation Offre en TTC:
                      </span>{" "}
                      {formData.estimationOffreTTC} DH
                    </p>
                    <p>
                      <span className="field-name">Caution:</span>{" "}
                      {formData.caution}
                    </p>
                    <p>
                      <span className="field-name">Délai d'exécution:</span>{" "}
                      {formData.delaiExecution} jours
                    </p>
                  </div>
                  <div className="print-section">
                    <h2>Contenu XML</h2>
                    <pre>{xmlContent}</pre>
                  </div>
                </div>
                <div className="preview-actions">
                  <button
                    className="button button-primary"
                    onClick={handlePrint}>
                    Imprimer
                  </button>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
    </Layout>
  );
};

export default MarcheForm;