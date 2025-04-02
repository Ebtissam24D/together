<?php
// models/Marche.php
require_once '../database_connexion/dataConnexion.php';

class Marche
{
    // Connexion à la base de données et nom de la table
    private $conn;
    private $table_name = "marches";

    // Propriétés de l'objet
    public $id;
    public $numero_aoo;
    public $numero_marche;
    public $annee_budgetaire;
    public $objet;
    public $entreprise_id;
    public $date_approbation;
    public $status;
    public $attributaire;

    /**
     * Constructeur avec connexion à la base de données
     * @param PDO $db - Connexion à la base de données
     */
    public function __construct($db)
    {
        $this->conn = $db;
    }

    // Method to delete a marche
    public function deleteMarche($id)
    {
        $query = "DELETE FROM " . $this->table_name . " WHERE id = :id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        return $stmt->execute();
    }
    /**
     * Récupère tous les marchés de la base de données
     * @param array $filters - Filtres optionnels (statut, année, etc.)
     * @return PDOStatement - Résultat de la requête
     */
    public function getAllMarches($filters = [])
    {
        // Requête de base
        $query = "SELECT 
                    m.id, m.numero_aoo, m.numero_marche, m.annee_budgetaire, 
                    m.objet, m.date_approbation, m.visa,m.status, 
                    e.raison_sociale as attributaire 
                FROM 
                    " . $this->table_name . " m
                LEFT JOIN
                    entreprises e ON m.entreprise_id = e.id
                WHERE 1=1";

        // Tri par défaut
        $query .= " ORDER BY m.date_approbation DESC";

        // Préparation de la requête
        $stmt = $this->conn->prepare($query);


        // Exécution de la requête
        $stmt->execute();
        return $stmt;
    }


    /**
     * Récupère les statistiques des marchés
     * @return array - Statistiques
     */
    public function getStatistics()
    {
        $stats = [];

        // Comptage des marchés en cours
        $query = "SELECT COUNT(*) as count FROM " . $this->table_name . " WHERE status = :status";
        $stmt = $this->conn->prepare($query);

        $status = 1; // Marchés en cours
        $stmt->bindParam(':status', $status);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        $stats['enCours'] = $row['count'];

        // Comptage des marchés soldés
        $status = 0; // Marchés soldés
        $stmt->bindParam(':status', $status);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        $stats['soldes'] = $row['count'];

        return $stats;
    }

    /**
     * Récupère un marché par son ID
     * @param int $id - ID du marché
     * @return bool - True si succès, false sinon
     */
    public function getMarcheById($id)
    {
        $query = "SELECT 
                    m.id, m.numero_aoo, m.numero_marche, m.annee_budgetaire, 
                    m.objet, m.date_approbation, m.status, 
                    e.id as entreprise_id, e.raison_sociale, e.registre_commerce, 
                    e.patente, e.cnss, e.adresse, e.gerant, 
                    e.telephone, e.fax, e.email 
                FROM 
                    " . $this->table_name . " m
                LEFT JOIN
                    entreprises e ON m.entreprise_id = e.id
                WHERE 
                    m.id = :id";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':id', $id);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($row) {
            // Return the row directly as an associative array
            return $row;
        }

        // If no record is found, return false
        return false;
    }

    /**
     * Crée un nouveau marché
     * @param array $data - Données du marché
     * @return bool - True si succès, false sinon
     */
    public function createMarche($data)
    { 
        try {
            $this->conn->beginTransaction();

            // Vérifier si l'entreprise existe déjà
            $query = "SELECT id FROM entreprises WHERE raison_sociale = :raison_sociale";
            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':raison_sociale', $data['raison_sociale']);
            $stmt->execute();

            if ($stmt->rowCount() > 0) {
                // Entreprise existante, récupérer l'ID
                $row = $stmt->fetch(PDO::FETCH_ASSOC);
                $entreprise_id = $row['id'];

                // Mettre à jour l'entreprise
                $query = "UPDATE entreprises SET
                            registre_commerce = :registre_commerce,
                            patente = :patente,
                            cnss = :cnss,
                            adresse = :adresse,
                            gerant = :gerant,
                            telephone = :telephone,
                            fax = :fax,
                            email = :email
                          WHERE id = :id";

                $stmt = $this->conn->prepare($query);
                $stmt->bindParam(':registre_commerce', $data['registre_commerce']);
                $stmt->bindParam(':patente', $data['patente']);
                $stmt->bindParam(':cnss', $data['cnss']);
                $stmt->bindParam(':adresse', $data['adresse']);
                $stmt->bindParam(':gerant', $data['gerant']);
                $stmt->bindParam(':telephone', $data['telephone']);
                $stmt->bindParam(':fax', $data['fax']);
                $stmt->bindParam(':email', $data['email']);
                $stmt->bindParam(':id', $entreprise_id);
                $stmt->execute();
            } else {
                // Créer une nouvelle entreprise
                $query = "INSERT INTO entreprises (
                            raison_sociale, registre_commerce, patente, cnss,
                            adresse, gerant, telephone, fax, email
                          ) VALUES (
                            :raison_sociale, :registre_commerce, :patente, :cnss,
                            :adresse, :gerant, :telephone, :fax, :email
                          )";

                $stmt = $this->conn->prepare($query);
                $stmt->bindParam(':raison_sociale', $data['raison_sociale']);
                $stmt->bindParam(':registre_commerce', $data['registre_commerce']);
                $stmt->bindParam(':patente', $data['patente']);
                $stmt->bindParam(':cnss', $data['cnss']);
                $stmt->bindParam(':adresse', $data['adresse']);
                $stmt->bindParam(':gerant', $data['gerant']);
                $stmt->bindParam(':telephone', $data['telephone']);
                $stmt->bindParam(':fax', $data['fax']);
                $stmt->bindParam(':email', $data['email']);
                $stmt->execute();

                $entreprise_id = $this->conn->lastInsertId();
            }

            // Créer le marché
            $query = "INSERT INTO marches (
                        numero_aoo, numero_marche, annee_budgetaire, objet,
                        entreprise_id, date_approbation, status
                      ) VALUES (
                        :numero_aoo, :numero_marche, :annee_budgetaire, :objet,
                        :entreprise_id, :date_approbation, :status
                      )";

            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':numero_aoo', $data['numero_aoo']);
            $stmt->bindParam(':numero_marche', $data['numero_marche']);
            $stmt->bindParam(':annee_budgetaire', $data['annee_budgetaire']);
            $stmt->bindParam(':objet', $data['objet']);
            $stmt->bindParam(':entreprise_id', $entreprise_id);
            $stmt->bindParam(':date_approbation', $data['date_approbation']);
            $stmt->bindParam(':status', $data['status']);
            $stmt->execute();

            $this->conn->commit();
            return true;
        } catch (PDOException $e) {
            $this->conn->rollBack();
            return false;
        }
    }

    /**
     * Met à jour un marché existant
     * @param int $id - ID du marché
     * @param array $data - Nouvelles données du marché
     * @return bool - True si succès, false sinon
     */
    public function updateMarche($id, $data)
    {
        try {
            $this->conn->beginTransaction();

            // Mettre à jour les informations du marché
            $query = "UPDATE " . $this->table_name . " SET
                        numero_aoo = :numero_aoo,
                        numero_marche = :numero_marche,
                        annee_budgetaire = :annee_budgetaire,
                        objet = :objet,
                        date_approbation = :date_approbation,
                        status = :status
                      WHERE id = :id";

            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':numero_aoo', $data['numero_aoo']);
            $stmt->bindParam(':numero_marche', $data['numero_marche']);
            $stmt->bindParam(':annee_budgetaire', $data['annee_budgetaire']);
            $stmt->bindParam(':objet', $data['objet']);
            $stmt->bindParam(':date_approbation', $data['date_approbation']);
            $stmt->bindParam(':status', $data['status']);
            $stmt->bindParam(':id', $id);
            $stmt->execute();

            $this->conn->commit();
            return true;
        } catch (PDOException $e) {
            $this->conn->rollBack();
            return false;
        }
    }
    public function saveXmlContent($marcheId, $xmlContent) {
        $stmt = $this->conn->prepare("UPDATE marches SET xml_content = :xml_content WHERE id = :id");
        $stmt->bindParam(':id', $marcheId, \PDO::PARAM_INT);
        $stmt->bindParam(':xml_content', $xmlContent);
        return $stmt->execute();
        ;
    }
    
    public function getXmlContent($marcheId) {
        $stmt = $this->conn->prepare("SELECT xml_content FROM marches WHERE id = :id");
        $stmt->bindParam(':id', $marcheId, \PDO::PARAM_INT);
        $stmt->execute();
        $result = $stmt->fetch();
        return $result ? $result['xml_content'] : null;
    }

    public function searchMarches($filters) {
        // Start building the query
        $query = "SELECT m.id, m.numero_marche, m.numero_aoo, m.objet_marche, 
                         e.raison_sociale AS nom_entreprise, 
                         m.montant_offre_ttc, m.visa
                  FROM marches m
                  LEFT JOIN entreprises e ON m.entreprise_id = e.id
                  WHERE 1=1";
    
        // Dynamically adding filters
        $bindings = []; // This will hold the values for binding
    
        if (!empty($filters['annee_budgetaire'])) {
            $query .= " AND m.annee_budgetaire = :annee_budgetaire";
            $bindings[':annee_budgetaire'] = $filters['annee_budgetaire'];
        }
        if (!empty($filters['numero_marche'])) {
            $query .= " AND m.numero_marche = :numero_marche";
            $bindings[':numero_marche'] = $filters['numero_marche'];
        }
        if (!empty($filters['numero_aoo'])) {
            $query .= " AND m.numero_aoo = :numero_aoo";
            $bindings[':numero_aoo'] = $filters['numero_aoo'];
        }
        if (!empty($filters['nom_entreprise'])) {
            $query .= " AND e.raison_sociale LIKE :nom_entreprise";
            $bindings[':nom_entreprise'] = "%" . $filters['nom_entreprise'] . "%";
        }
        if (!empty($filters['nature_marche'])) { 
            $query .= " AND m.nature_budget = :nature_marche";
            $bindings[':nature_marche'] = $filters['nature_marche'];
        }
        if (array_key_exists('visa', $filters) && $filters['visa'] !== "") { // Check if 'visa' is set and not empty
            $query .= " AND m.visa = :visa";
            $bindings[':visa'] = $filters['visa'];
        }
    
        // Prepare and execute the query
        $stmt = $this->conn->prepare($query);
        
        // Bind the values dynamically
        foreach ($bindings as $param => $value) {
            $stmt->bindValue($param, $value);
        }
    
        // Execute the query
        $stmt->execute();
    
        // Fetch all results
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    
    
} 
?>   

