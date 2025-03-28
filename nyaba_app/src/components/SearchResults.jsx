import React from "react";
import '../App.css';
const SearchResults = ({ results, onMarketSelect }) => {
  const visaThreshold = 1000000;

  return (
    <div className="results-container">
      {results.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>N° AOO</th>
              <th>N° Marché</th>
              <th>Objet</th>
              <th>Attributaire</th>
              <th>Montant</th>
              <th>Visa</th>
            </tr>
          </thead>
          <tbody>
            {results.map((market) => {
                const montant = market.montant_offre_ttc 
                ? parseFloat(market.montant_offre_ttc.replace(" MAD", "").replace(",", "")) 
                : 0;
              const visa = montant > visaThreshold ? "oui" : "non";

              return (
                <tr key={market.id}>
                  <td>{market.numero_aoo}</td>
                  <td>
                    <a 
                    href="#"
                      className="marketLink"
                      onClick={(e) => {
                        e.preventDefault();
                        onMarketSelect(market.id);
                      }}
                    >
                      {market.numero_marche}
                    </a>
                  </td>
                  <td>{market.objet_marche}</td>
                  <td>{market.attributaire}</td>
                  <td>{montant}</td>
                  <td>{visa}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <p>Aucun résultat trouvé. Veuillez affiner vos critères de recherche.</p>
      )}
    </div>
  );
};

export default SearchResults;
