import React, { use, useEffect, useState } from "react";
import Layout from "../components/Layout";
import Main_container_head from "../components/Main_container_head";
import Card from "../components/Card";
import "./market_details.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Market_details = () => {
  const [activeView, setActiveView] = useState("dashboard"); // "dashboard", "marketList", "marketDetail"
  const [activeFilter, setActiveFilter] = useState(null); // null, "enCours", or "valides"
  const [selectedMarket, setSelectedMarket] = useState(null); // Store selected market for detail view
  const [marches, setmarches] = useState([]);
  const [statistique, setStatistique] = useState({ enCours: 0, soldes: 0 });
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    id: 0,
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
    email: "",
  });
  const appBackend = import.meta.env.VITE_API_BACKEND_URL;
  const getMarches = async () => {
    try {
      const response = await axios.get(
        `${appBackend}/marches`, { withCredentials: true }
      );
      console.log(response.data);
      setmarches(response.data.records || []);
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la récupération des marchés");
    }
  };
  const getStatistique = async () => {
    try {
      const response = await axios.get(
        `${appBackend}/marches/stats`, { withCredentials: true }
      );
      console.log(response.data);
      setStatistique(response.data || { enCours: 0, soldes: 0 });
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la récupération des statistiques");
    }
  };
  const fetchMarketData = async (id) => {
    try {
      const response = await axios.get(
        `${appBackend}/marches/${id}`, { withCredentials: true }
      );

      // Transform API response to match form field names
      setFormData({
        id: response.data.id || "",
        numero_aoo: response.data.numero_aoo || "",
        numero_marche: response.data.numero_marche || "",
        annee_budgetaire: response.data.annee_budgetaire || "",
        objet: response.data.objet || "",
        date_approbation: response.data.date_approbation || "",
        status: response.data.status || "",
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
      setActiveView("marketDetail");

      // setLoading(false);
    } catch (error) {
      console.error("Erreur lors de la récupération des données:", error);
      alert("Impossible de charger les données du marché");
      // setLoading(false);
    }
  };
  useEffect(() => {
    getStatistique();
    getMarches();
  }, []);

  // Filter the market data based on the active filter

  const filteredData =
    activeFilter != null
      ? marches.filter((market) => market.status == activeFilter)
      : marches;

  // Handler for card clicks
  const handleCardClick = (filter) => {
    setActiveFilter(filter);

    // Ne change plus de vue, simplement applique un filtre
  };

  // Handler for navigation clicks
  // const handleNavClick = (view) => {
  //   setActiveView(view);
  //   // Reset filter when returning to dashboard
  //   if (view === "dashboard") {
  //     setActiveFilter(null);
  //   }
  // };

  // Handler for viewing market details
  const handleViewMarketDetails = (id) => {
    // setSelectedMarket(market);
    fetchMarketData(id);
    // setActiveView("marketDetail");
  };

  // Handler for back button in market details
  const handleBackToList = () => {
    setActiveView("dashboard");
    setSelectedMarket(null);
  };
  const handleAction = async (action, marketId) => {
    // In a real app, these would make API calls

    let confirmed = false;
    switch (action) {
      case "pdf":
        confirmed = window.confirm(
          `Voulez-vous exporter le marché #${marketId} en PDF ?`
        );
        if (confirmed) {
          try {
            const response = await axios.get(
              `${appBackend}/marches/export/pdf/${marketId}`,{ withCredentials: true },
              {
                responseType: "blob", // Indique que la réponse est un fichier binaire
              }
            );

            // Créer un lien temporaire pour télécharger le PDF
            const file = new Blob([response.data], { type: "application/pdf" });
            const downloadUrl = window.URL.createObjectURL(file);
            const a = document.createElement("a");
            a.href = downloadUrl;
            a.download = `Marche_${marketId}.pdf`; // Nom du fichier
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(downloadUrl);

            alert("PDF exporté avec succès");
          } catch (error) {
            console.error(error);
            alert("Erreur lors de l'exportation du PDF");
          }
        }
        break;

      case "delete":
        confirmed = window.confirm(
          `Voulez-vous vraiment supprimer le marché #${marketId} ?`
        );
        if (confirmed) {
          try {
            const response = await axios.delete(`${appBackend}/marches/${marketId}`, { withCredentials: true });
            alert(response.data.message || "Marché supprimé avec succès");
          } catch (error) {
            console.error(error);
            alert("Erreur lors de la suppression");
          }
        }
        break;
      case "edit":
        navigate(`/edit_market/${marketId}`);
        break;
      case "excel":
        confirmed = window.confirm(
          `Voulez-vous vraiment exporter le marché #${marketId} ?`
        );
        if (confirmed) {
          try {
            const response = await axios.get(`${appBackend}/marches/export/${marketId}`, {
              withCredentials: true,
              responseType: "blob", // Ensures the response is handled as a file (binary)
            });

            const file = new Blob([response.data], {
              type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });

            const downloadUrl = window.URL.createObjectURL(file);
            const a = document.createElement("a");
            a.href = downloadUrl;
            a.download = `Marche_${marketId}.xlsx`; // Set the desired file name
            document.body.appendChild(a); // Append to the body
            a.click(); // Trigger the download
            document.body.removeChild(a); // Clean up
            window.URL.revokeObjectURL(downloadUrl); // Release the object URL
          } catch (error) {
            console.error(error);
            alert("Erreur lors de l'exportation");
          }
        }
        break;
      default:
        break;
    }
  };

  // Render the Dashboard view
  const renderDashboard = () => {
    // Titre approprié selon le filtre actif
    let tableTitle = "Liste complète des Marchés";
    if (activeFilter === 1) {
      tableTitle = "Marchés en cours";
    } else if (activeFilter === 0) {
      tableTitle = "Marchés soldés";
    }

    return (
      <>
        <Main_container_head text={"Tableau de Bord Administratif"} />
        <div className="dashbord_section">
          <Card
            title="Marchés en cours"
            statistic={statistique.enCours}
            handleClick={() => handleCardClick(1)}
          />
          <Card
            title="Marchés soldés"
            statistic={statistique.soldes}
            handleClick={() => handleCardClick(0)}
          />
          <Card
            title="Tous les marchés"
            statistic={statistique.enCours + statistique.soldes}
            handleClick={() => handleCardClick(null)}
          />
        </div>
        <div className="w-full">
          <h3>{tableTitle}</h3>
          
          <table className="w-full">
            <thead>
              <tr>
                <th>Numéro AOO</th>
                <th>Numéro Marché</th>
                <th>Annee Budgetaire</th>
                <th>Objet</th>
                <th>Attributaire</th>
                <th>Approbation</th>
                <th>Visa</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((market) => (
                <tr key={market.id}>
                  <td>{market.numeroAOO}</td>
                  <td>{market.numeroMarche}</td>
                  <td>{market.anneeBudgetaire}</td>
                  <td>{market.objet}</td>
                  <td>{market.raisonSociale}</td>
                  <td>{market.approbation}</td>
                  <td>{market.visa}</td>
                  <td>
                    <button onClick={() => handleViewMarketDetails(market.id)}>
                      Consulter
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredData.length === 0 && (
            <div>Aucun marché ne correspond aux critères sélectionnés.</div>
          )}
        </div>
      </>
    );
  };

  // Render the Market Detail view
  const renderMarketDetail = () => {
    // if (!selectedMarket) return null;

    // const market = selectedMarket;

    return (
      <div className="main-container">
        <div>
          <Main_container_head text={"Détails du Marché"} />
          <button onClick={handleBackToList}>Retour au tableau de bord</button>
        </div>

        <div className="w-full btn_container">
          <button onClick={() => handleAction("delete", formData.id)}>
            <i className="fas fa-trash"></i> Supprimer
          </button>
          <button onClick={() => handleAction("edit", formData.id)}>
            <i className="fas fa-edit"></i> Modifier
          </button>
          <button onClick={() => handleAction("pdf", formData.id)}>
            <i className="fas fa-file-pdf"></i> Fichier PDF
          </button>
          <button onClick={() => handleAction("excel", formData.id)}>
            <i className="fas fa-file-excel"></i> Exporter Excel
          </button>
          {/* Print button removed */}
        </div>

        {/* Market Details Table */}
        <div className="w-full">
          <table className="w-full">
            <tbody>
              <tr>
                <td>Objet</td>
                <td>{formData.objet}</td>
              </tr>
              <tr>
                <td>Numéro Marché</td>
                <td>{formData.numero_marche}</td>
              </tr>
              <tr>
                <td>Numéro AOO</td>
                <td>{formData.numero_aoo}</td>
              </tr>
              <tr>
                <td>Année Budgétaire</td>
                <td>{formData.annee_budgetaire}</td>
              </tr>
              <tr>
                <td>Raison Sociale</td>
                <td>{formData.raison_sociale}</td>
              </tr>
              <tr>
                <td> Registre Commerce N</td>
                <td>{formData.registre_commerce}</td>
              </tr>
              <tr>
                <td>Patente</td>
                <td>{formData.patente}</td>
              </tr>
              <tr>
                <td>CNSS</td>
                <td>{formData.cnss}</td>
              </tr>
              <tr>
                <td>Adresse</td>
                <td>{formData.adresse}</td>
              </tr>
              <tr>
                <td>Gerant</td>
                <td>{formData.gerant}</td>
              </tr>
              <tr>
                <td>Telephone</td>
                <td>{formData.telephone}</td>
              </tr>
              <tr>
                <td>Fax</td>
                <td>{formData.fax}</td>
              </tr>
              <tr>
                <td>Email</td>
                <td>{formData.email}</td>
              </tr>
              <tr>
                <td>status</td>
                <td>{formData.status ? "encours" : "soldes"}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  };
  return (
    <Layout>
      {activeView === "dashboard" && renderDashboard()}
      {activeView === "marketDetail" && renderMarketDetail()}
    </Layout>
  );
};

export default Market_details;
