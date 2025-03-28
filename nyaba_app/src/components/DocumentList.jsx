import React, { useState, useEffect } from "react";
const DocumentList = ({ marketId }) => {
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    const fetchDocuments = async () => {
      if (!marketId) return;
// still need to work on this part
      try {
        const response = await fetch(`http://your-backend-url/get_documents.php?market_id=${marketId}`);
        const data = await response.json();
        setDocuments(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des documents :", error);
        setDocuments([]);
      }
    };

    fetchDocuments();
  }, [marketId]);

  if (!marketId) return null;

  return (
    <div id="documentList" style={{ display: 'block' }}>
      <h3>Documents pour le marché {marketId}</h3>
      {documents.length > 0 ? (
        <table className="document-table">
          <thead>
            <tr>
              <th>Nom du document</th>
              <th>Description</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc) => (
              <tr key={doc.id}>
                <td>{doc.name}</td>
                <td>{doc.description}</td>
                <td>{doc.upload_date}</td>
                <td className="actions">
                  <a href={`documents/${doc.file_path}`} target="_blank" rel="noopener noreferrer" className="view-btn">
                    👁️ Voir
                  </a>
                  <a href={`documents/${doc.file_path}`} download className="download-btn">
                    ⬇️ Télécharger
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Aucun document disponible pour ce marché pour le moment.</p>
      )}
    </div>
  );
};

export default DocumentList;
