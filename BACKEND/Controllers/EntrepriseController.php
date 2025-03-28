<?php
// EntrepriseController.php
require_once __DIR__ . '/../Models/Entreprise.php';

class TitulaireController {
    private $titulaire;

    public function __construct($db) {
        $this->titulaire = new Titulaire($db);
    }

    // Récupérer tous les titulaires
    public function index() {
        $stmt = $this->titulaire->getAll();
        $num = $stmt->rowCount();
        
        if ($num > 0) {
            $titulaires_arr = array();
            $titulaires_arr["records"] = array();
            
            while ($row = $stmt->fetch(\PDO::FETCH_ASSOC)) {
                extract($row);
                
                $titulaire_item = array(
                    "id" => $id,
                    "raisonSociale" => $raison_sociale,
                    "registreCommerce" => $registre_commerce,
                    "patente" => $patente,
                    "cnss" => $cnss,
                    "adresse" => $adresse,
                    "gerant" => $gerant,
                    "telephone" => $telephone,
                    "fax" => $fax,
                    "email" => $email,
                    "created_at" => $created_at,
                    "updated_at" => $updated_at
                );
                
                array_push($titulaires_arr["records"], $titulaire_item);
            }
            
            return $this->jsonResponse(200, $titulaires_arr);
        } else {
            return $this->jsonResponse(200, array("message" => "Aucun titulaire trouvé."));
        }
    }

    // Récupérer un titulaire par ID
    public function show($id) {
        $this->titulaire->id = $id;
        
        if ($this->titulaire->getOne()) {
            $titulaire_arr = array(
                "id" =>  $this->titulaire->id,
                "raisonSociale" => $this->titulaire->raisonSociale,
                "registreCommerce" => $this->titulaire->registreCommerce,
                "patente" => $this->titulaire->patente,
                "cnss" => $this->titulaire->cnss,
                "adresse" => $this->titulaire->adresse,
                "gerant" => $this->titulaire->gerant,
                "telephone" => $this->titulaire->telephone,
                "fax" => $this->titulaire->fax,
                "email" => $this->titulaire->email,
                "created_at" => $this->titulaire->created_at,
                "updated_at" => $this->titulaire->updated_at
            );
            
            return $this->jsonResponse(200, $titulaire_arr);
        } else {
            return $this->jsonResponse(404, array("message" => "Le titulaire n'existe pas."));
        }
    }

    // Créer un nouveau titulaire
    public function store() {
        $data = json_decode(file_get_contents("php://input"));
        
        if (
            empty($data->raisonSociale) ||
            empty($data->telephone) ||
            empty($data->email)
        ) {
            return $this->jsonResponse(400, array("message" => "Données incomplètes. Raison sociale, téléphone et email sont obligatoires."));
        }
        
        // Validation de l'email
        if (!filter_var($data->email, FILTER_VALIDATE_EMAIL)) {
            return $this->jsonResponse(400, array("message" => "Format d'email invalide."));
        }
        
        $this->titulaire->raisonSociale = $data->raisonSociale;
        $this->titulaire->registreCommerce = $data->registreCommerce ?? "";
        $this->titulaire->patente = $data->patente ?? "";
        $this->titulaire->cnss = $data->cnss ?? "";
        $this->titulaire->adresse = $data->adresse ?? "";
        $this->titulaire->gerant = $data->gerant ?? "";
        $this->titulaire->telephone = $data->telephone;
        $this->titulaire->fax = $data->fax ?? "";
        $this->titulaire->email = $data->email;
        
        if ($this->titulaire->create()) {
            return $this->jsonResponse(201, array("message" => "Titulaire créé avec succès."));
        } else {
            return $this->jsonResponse(503, array("message" => "Impossible de créer le titulaire."));
        }
    }

    // Mettre à jour un titulaire
    public function update($id) {
        $data = json_decode(file_get_contents("php://input"));
        
        if (
            empty($data->raisonSociale) ||
            empty($data->telephone) ||
            empty($data->email)
        ) {
            return $this->jsonResponse(400, array("message" => "Données incomplètes. Raison sociale, téléphone et email sont obligatoires."));
        }
        
        // Validation de l'email
        if (!filter_var($data->email, FILTER_VALIDATE_EMAIL)) {
            return $this->jsonResponse(400, array("message" => "Format d'email invalide."));
        }
       try {
        $success = $this->titulaire->update($id, $data);
        if ($success) {
            // Mettre à jour les statistiques du tableau de bord après modification
            
            
            http_response_code(200);
            echo json_encode(["message" => "L'entreprise a été mis à jour avec succès."]);
        } else {
            http_response_code(404);
            echo json_encode(["message" => "Enreprise non trouvé :("]);
        }
       }  catch (\Exception $e) {
        http_response_code(503);
        echo json_encode(["message" => "Impossible de mettre à jour de l'entreprise :(: " . $e->getMessage()]);
    }
       
    }

    // Supprimer un titulaire
    public function destroy($id) {
        $this->titulaire->id = $id;
        
        if ($this->titulaire->delete()) {
            return $this->jsonResponse(200, array("message" => "Titulaire supprimé."));
        } else {
            return $this->jsonResponse(503, array("message" => "Impossible de supprimer le titulaire."));
        }
    }

    // Rechercher des titulaires
    public function search() {
        $keywords = isset($_GET["q"]) ? $_GET["q"] : "";
        
        if (empty($keywords)) {
            return $this->jsonResponse(400, array("message" => "Veuillez fournir un terme de recherche."));
        }
        
        $stmt = $this->titulaire->search($keywords);
        $num = $stmt->rowCount();
        
        if ($num > 0) {
            $titulaires_arr = array();
            $titulaires_arr["records"] = array();
            
            while ($row = $stmt->fetch(\PDO::FETCH_ASSOC)) {
                extract($row);
                
                $titulaire_item = array(
                    "id" => $id,
                    "raisonSociale" => $raison_sociale,
                    "registreCommerce" => $registre_commerce,
                    "patente" => $patente,
                    "cnss" => $cnss,
                    "adresse" => $adresse,
                    "gerant" => $gerant,
                    "telephone" => $telephone,
                    "fax" => $fax,
                    "email" => $email,
                    "created_at" => $created_at,
                    "updated_at" => $updated_at
                );
                
                array_push($titulaires_arr["records"], $titulaire_item);
            }
            
            return $this->jsonResponse(200, $titulaires_arr);
        } else {
            return $this->jsonResponse(200, array("message" => "Aucun titulaire trouvé."));
        }
    }
    
    // Helper pour envoyer des réponses JSON
    private function jsonResponse($status_code, $data) {
        http_response_code($status_code);
        header("Content-Type: application/json; charset=UTF-8");
        return json_encode($data);
    }
    // Exporter les titulaires vers Excel
public function exportToExcel() {
    $stmt = $this->titulaire->getAll();
    $titulaires = $stmt->fetchAll(\PDO::FETCH_ASSOC);
    
    require_once 'vendor/autoload.php'; // Assurez-vous d'avoir installé PhpSpreadsheet via Composer
    
    $spreadsheet = new \PhpOffice\PhpSpreadsheet\Spreadsheet();
    $sheet = $spreadsheet->getActiveSheet();
    
    // En-têtes
    $sheet->setCellValue('A1', 'ID');
    $sheet->setCellValue('B1', 'Raison Sociale');
    $sheet->setCellValue('C1', 'Registre Commerce');
    $sheet->setCellValue('D1', 'Patente');
    $sheet->setCellValue('E1', 'CNSS');
    $sheet->setCellValue('F1', 'Adresse');
    $sheet->setCellValue('G1', 'Gérant');
    $sheet->setCellValue('H1', 'Téléphone');
    $sheet->setCellValue('I1', 'Fax');
    $sheet->setCellValue('J1', 'Email');
    
    // Données
    $row = 2;
    foreach ($titulaires as $titulaire) {
        $sheet->setCellValue('A' . $row, $titulaire['id']);
        $sheet->setCellValue('B' . $row, $titulaire['raison_sociale']);
        $sheet->setCellValue('C' . $row, $titulaire['registre_commerce']);
        $sheet->setCellValue('D' . $row, $titulaire['patente']);
        $sheet->setCellValue('E' . $row, $titulaire['cnss']);
        $sheet->setCellValue('F' . $row, $titulaire['adresse']);
        $sheet->setCellValue('G' . $row, $titulaire['gerant']);
        $sheet->setCellValue('H' . $row, $titulaire['telephone']);
        $sheet->setCellValue('I' . $row, $titulaire['fax']);
        $sheet->setCellValue('J' . $row, $titulaire['email']);
        $row++;
    }
    
    // Générer le fichier Excel
    $fileName = 'titulaires_' . date('Y-m-d_H-i-s') . '.xlsx';
    $filePath = 'exports/' . $fileName;
    
    // Créer le répertoire s'il n'existe pas
    if (!is_dir('exports')) {
        mkdir('exports', 0777, true);
    }
    
    $writer = new \PhpOffice\PhpSpreadsheet\Writer\Xlsx($spreadsheet);
    $writer->save($filePath);
    
    return $this->jsonResponse(200, [
        "message" => "Export Excel réussi",
        "file" => $filePath
    ]);
}
}
// Compare this snippet from BACKEND/Controllers/XmlController.ph
?>