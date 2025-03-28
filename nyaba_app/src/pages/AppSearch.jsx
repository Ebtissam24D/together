import React, { useState } from "react";
import Layout from "../components/Layout";
import Main_container_head from "../components/Main_container_head";
import SearchForm from "../components/SearchForm";
import SearchResults from "../components/SearchResults";
import DocumentList from "../components/DocumentList";
import axios from "axios";

const AppSearch = () => {
  const [results, setResults] = useState([]);
  const [selectedMarket, setSelectedMarket] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const appBackend = import.meta.env.VITE_API_BACKEND_URL;
  const handleSearch = async (formData) => {
    setIsLoading(true);
    setSelectedMarket(null);

    try {
      const response = await axios.get(`${appBackend}/marches/search`, {
        params: formData,
      });
      // alert("Data fetched successfully!");
      console.log(response.data.records);
      setResults(response.data.records);
    } catch (error) {
      console.error("Error fetching data: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarketSelect = (marketId) => {
    setSelectedMarket(marketId);
    setTimeout(() => {
      const documentList = document.getElementById("documentList");
      if (documentList) {
        documentList.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  return (
    <Layout>
      <Main_container_head text={"Recherche des Marchés"} />
      <SearchForm onSearch={handleSearch} />

      {isLoading ? (
        <div className="loading">Chargement des résultats...</div>
      ) : (
        <SearchResults results={results} onMarketSelect={handleMarketSelect} />
      )}
      <DocumentList marketId={selectedMarket} />
    </Layout>
  );
};

export default AppSearch;
