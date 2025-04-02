<?php
class Titulaire
{
    private $conn;
    private $table_name = "entreprises";

    // Propriétés
    public $id;
    public $raisonSociale;
    public $registreCommerce;
    public $patente;
    public $cnss;
    public $adresse;
    public $gerant;
    public $telephone;
    public $fax;
    public $email;
    public $created_at;
    public $updated_at;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    // Lire tous les titulaires
    public function getAll()
    {
        $query = "SELECT * FROM " . $this->table_name . " ORDER BY created_at DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();

        return $stmt;
    }

    // Lire un titulaire
    public function getOne()
    {
        $query = "SELECT * FROM " . $this->table_name . " WHERE id = ? LIMIT 0,1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->id);
        $stmt->execute();

        $row = $stmt->fetch(\PDO::FETCH_ASSOC);

        if ($row) {
            $this->raisonSociale = $row['raison_sociale'];
            $this->registreCommerce = $row['registre_commerce'];
            $this->patente = $row['patente'];
            $this->cnss = $row['cnss'];
            $this->adresse = $row['adresse'];
            $this->gerant = $row['gerant'];
            $this->telephone = $row['telephone'];
            $this->fax = $row['fax'];
            $this->email = $row['email'];
            $this->created_at = $row['created_at'];
            $this->updated_at = $row['updated_at'];

            return true;
        }

        return false;
    }

    // Créer un titulaire
    public function create()
    {
        $query = "INSERT INTO " . $this->table_name . "
                (raison_sociale, registre_commerce, patente, cnss, adresse, gerant, telephone, fax, email)
                VALUES
                (:raison_sociale, :registre_commerce, :patente, :cnss, :adresse, :gerant, :telephone, :fax, :email)";

        $stmt = $this->conn->prepare($query);

        // Nettoyer les données
        $this->raisonSociale = htmlspecialchars(strip_tags($this->raisonSociale));
        $this->registreCommerce = htmlspecialchars(strip_tags($this->registreCommerce));
        $this->patente = htmlspecialchars(strip_tags($this->patente));
        $this->cnss = htmlspecialchars(strip_tags($this->cnss));
        $this->adresse = htmlspecialchars(strip_tags($this->adresse));
        $this->gerant = htmlspecialchars(strip_tags($this->gerant));
        $this->telephone = htmlspecialchars(strip_tags($this->telephone));
        $this->fax = htmlspecialchars(strip_tags($this->fax));
        $this->email = htmlspecialchars(strip_tags($this->email));

        // Bind des paramètres
        $stmt->bindParam(':raison_sociale', $this->raisonSociale);
        $stmt->bindParam(':registre_commerce', $this->registreCommerce);
        $stmt->bindParam(':patente', $this->patente);
        $stmt->bindParam(':cnss', $this->cnss);
        $stmt->bindParam(':adresse', $this->adresse);
        $stmt->bindParam(':gerant', $this->gerant);
        $stmt->bindParam(':telephone', $this->telephone);
        $stmt->bindParam(':fax', $this->fax);
        $stmt->bindParam(':email', $this->email);

        if ($stmt->execute()) {
            return true;
        }

        return false;
    }

    // Mettre à jour un titulaire
    public function update($id, $data)
    {
        try {
            $this->conn->beginTransaction();
            $query = "UPDATE " . $this->table_name . "
                SET
                    raison_sociale = :raison_sociale,
                    registre_commerce = :registre_commerce,
                    patente = :patente,
                    cnss = :cnss,
                    adresse = :adresse,
                    gerant = :gerant,
                    telephone = :telephone,
                    fax = :fax,
                    email = :email,
                
                WHERE
                    id = :id";

            $stmt = $this->conn->prepare($query);
            $stmt->bindParam(':id', $id);
            $stmt->bindParam(':raison_sociale', $data["raisonSociale"]);
            $stmt->bindParam(':registre_commerce', $data["registreCommerce"]);
            $stmt->bindParam(':patente', $data["patente"]);
            $stmt->bindParam(':cnss', $data["cnss"]);
            $stmt->bindParam(':adresse', $data["adresse"]);
            $stmt->bindParam(':gerant', $data["gerant"]);
            $stmt->bindParam(':telephone', $data["telephone"]);
            $stmt->bindParam(':fax', $data["fax"]);
            $stmt->bindParam(':email', $data["email"]);

            $this->conn->commit();
            return true;
        } catch (PDOException $e) {
            $this->conn->rollBack();
            return false;
        }
    }

    // Supprimer un titulaire
    public function delete()
    {
        $query = "DELETE FROM " . $this->table_name . " WHERE id = ?";
        $stmt = $this->conn->prepare($query);

        $this->id = htmlspecialchars(strip_tags($this->id));
        $stmt->bindParam(1, $this->id);

        if ($stmt->execute()) {
            return true;
        }

        return false;
    }

    // Rechercher un titulaire
    public function search($keywords)
    {
        $query = "SELECT * FROM " . $this->table_name . " 
                WHERE raison_sociale LIKE ? OR gerant LIKE ? 
                ORDER BY created_at DESC";

        $stmt = $this->conn->prepare($query);

        $keywords = htmlspecialchars(strip_tags($keywords));
        $keywords = "%{$keywords}%";

        $stmt->bindParam(1, $keywords);
        $stmt->bindParam(2, $keywords);

        $stmt->execute();

        return $stmt;
    }
}
