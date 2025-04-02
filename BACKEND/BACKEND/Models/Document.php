<?php
require_once '../database_connexion/dataConnexion.php';
class Document {
    private $conn;
    private $table = "documents";

    public function __construct($db) {
        $this->conn = $db;
    }

    public function getDocumentsByMarche($numero_marche) {
        $query = "SELECT fichier FROM " . $this->table . " WHERE marche_id = :numero_marche and type = 'pdf'";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':numero_marche', $numero_marche);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}

?>