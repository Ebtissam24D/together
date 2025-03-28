<?php
// controllers/MarcheController.ph


require_once '../Models/Marche.php';
require '../vendor/autoload.php';
require_once '../Models/Document.php';
require_once '../Models/User.php';
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Alignment;

class MarcheController
{
    private $marche;
    private $document;
    /**
     * Constructeur du contrôleur
     * @param \PDO $db - Connexion à la base de données
     */
    public function __construct($db)
    {
        $this->marche = new Marche($db);
        $this->document = new Document($db);
    }

    /**
     * Récupère tous les marchés ou filtrés par statut
     */

    public function exportPdf($id){
        if (empty($id) || !is_numeric($id)) {
            http_response_code(400);
            echo json_encode(["message" => "ID de marché manquant ou invalide"]);
            return;
        }
        $docpath = $this->document->getDocumentsByMarche($id);
        $docpath = $docpath[0]['fichier'];

        if (file_exists($docpath)) {
            header('Content-Type: application/pdf');
            header('Content-Disposition: inline; filename="' . basename($docpath) . '"');
            header('Content-Transfer-Encoding: binary');
            header('Accept-Ranges: bytes');
            readfile($docpath);

        } else {
            http_response_code(404);
            echo json_encode(["message" => "Document non trouvé"]);
        }

    }

    public function getAllMarches()
    {
      

        // Récupérer les marchés
        $stmt = $this->marche->getAllMarches();
        $num = $stmt->rowCount();

        if ($num > 0) {
            // Tableau pour contenir les marchés
            $marches_arr = [];
            $marches_arr["records"] = [];

            while ($row = $stmt->fetch(\PDO::FETCH_ASSOC)) {
                extract($row);

                $marche_item = [
                    "id" => $id,
                    "numeroAOO" => $numero_aoo,
                    "numeroMarche" => $numero_marche,
                    "anneeBudgetaire" => $annee_budgetaire,
                    "objet" => $objet,
                    "attributaire" => $attributaire,
                    "dateApprobation" => $date_approbation,
                    "visa" => $visa,
                    "status" => $status
                ];

                array_push($marches_arr["records"], $marche_item);
            }

            // Code 200 - OK
            http_response_code(200);
            echo json_encode($marches_arr);
        } else {
            // Aucun marché trouvé
            http_response_code(200);
            echo json_encode(["records" => []]);
        }
    }

    /**
     * Récupère les statistiques des marchés pour le tableau de bord
     */
    public function getStatistics()
    {
        $stats = $this->marche->getStatistics();

        // Code 200 - OK
        http_response_code(200);
        echo json_encode($stats);
    }

    /**
     * Récupère les détails d'un marché spécifique
     * @param int $id - ID du marché
     */
    public function getMarcheById($id)
    {
        // Vérifier que l'ID est valide
        if (empty($id) || !is_numeric($id)) {
            http_response_code(400);
            echo json_encode(["message" => "ID de marché manquant ou invalide"]);
            return;
        }

        // Récupérer le marché
        $marche = $this->marche->getMarcheById($id);

        if ($marche) {
            // Code 200 - OK
            http_response_code(200);
            echo json_encode($marche);
        } else {
            // Marché non trouvé
            http_response_code(404);
            echo json_encode(["message" => "Marché non trouvé"]);
        }
    }

    /**
     * Crée un nouveau marché
     */
    public function createMarche()
    {
        // Récupérer les données POST
        $data = json_decode(file_get_contents("php://input"), true);

        // Vérifier que les données obligatoires sont présentes
        if (!$this->validateMarcheData($data)) {
            http_response_code(400);
            echo json_encode(["message" => "Données incomplètes. Tous les champs obligatoires doivent être remplis."]);
            return;
        }

        // Définir des valeurs par défaut pour les champs optionnels
        $data['date_approbation'] = $data['date_approbation'] ?? date('Y-m-d');
        $data['status'] = $data['status'] ?? '0';

        // Tenter de créer le marché
        try {
            $id = $this->marche->createMarche($data);
            
            // Mettre à jour les statistiques du tableau de bord après création
         
            
            http_response_code(201);
            echo json_encode([
                "message" => "Le marché a été créé avec succès.",
                "id" => $id
            ]);
        } catch (\Exception $e) {
            http_response_code(503);
            echo json_encode(["message" => "Impossible de créer le marché: " . $e->getMessage()]);
        }
    }

    /**
     * Met à jour un marché existant
     * @param int $id - ID du marché
     */
    public function updateMarche($id)
    {
        // Vérifier que l'ID est valide
        if (empty($id) || !is_numeric($id)) {
            http_response_code(400);
            echo json_encode(["message" => "ID de marché manquant ou invalide"]);
            return;
        }

        // Récupérer les données PUT
        $data = json_decode(file_get_contents("php://input"), true);

        // // Vérifier que les données obligatoires sont présentes
        // if (!$this->validateMarcheData($data)) {
        //     http_response_code(400);
        //     echo json_encode(["message" => "Données incomplètes. Tous les champs obligatoires doivent être remplis."]);
        //     return;
        // }

        // Tenter de mettre à jour le marché
        try {
            $success = $this->marche->updateMarche($id, $data);
            if ($success) {
                // Mettre à jour les statistiques du tableau de bord après modification
                
                
                http_response_code(200);
                echo json_encode(["message" => "Le marché a été mis à jour avec succès."]);
            } else {
                http_response_code(404);
                echo json_encode(["message" => "Marché non trouvé"]);
            }
        } catch (\Exception $e) {
            http_response_code(503);
            echo json_encode(["message" => "Impossible de mettre à jour le marché: " . $e->getMessage()]);
        }
    }

    /**
     * Supprime un marché
     * @param int $id - ID du marché
     */
    public function deleteMarche($id)
    {
        // Vérifier que l'ID est valide
        if (empty($id) || !is_numeric($id)) {
            http_response_code(400);
            echo json_encode(["message" => "ID de marché manquant ou invalide"]);
            return;
        }

        // Tenter de supprimer le marché
        try {
            $success = $this->marche->deleteMarche($id);
            if ($success) {
                // Mettre à jour les statistiques du tableau de bord après suppression
             
                
                http_response_code(200);
                echo json_encode(["message" => "Le marché a été supprimé avec succès."]);
            } else {
                http_response_code(404);
                echo json_encode(["message" => "Marché non trouvé"]);
            }
        } catch (\Exception $e) {
            http_response_code(503);
            echo json_encode(["message" => "Impossible de supprimer le marché: " . $e->getMessage()]);
        }
    }

    /**
     * Exporte les données d'un marché au format Excel
     * @param int $id - ID du marché
     */
    public function exportMarcheAsExcel($id)
    {
        ob_end_clean(); // Clear output buffer

        if (empty($id) || !is_numeric($id)) {
            http_response_code(400);
            echo json_encode(["message" => "ID de marché manquant ou invalide"]);
            return;
        }

        $marche = $this->marche->getMarcheById($id);

        if (!$marche) {
            http_response_code(404);
            echo json_encode(["message" => "Marché non trouvé"]);
            return;
        }

        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();

        // **Title of the Sheet**
        $sheet->setTitle('Marché Détails');

        // **Title Section**
        $sheet->setCellValue('A1', 'Détails du Marché');
        $sheet->mergeCells('A1:O1');
        $sheet->getStyle('A1:O1')->applyFromArray([
            'font' => ['bold' => true, 'size' => 14],
            'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER]
        ]);

        // **Headers for the Data Table**
        $headers = [
            'Numéro AOO',
            'Numéro Marché',
            'Année Budgétaire',
            'Objet_Marche',
            'Date Approbation',
            'Statut',
            'Raison Sociale',
            'Registre Commerce',
            'Patente',
            'CNSS',
            'Adresse',
            'Gérant',
            'Téléphone',
            'Fax',
            'Email'
        ];

        $columnIndex = 'A';
        foreach ($headers as $header) {
            $sheet->setCellValue("{$columnIndex}2", $header);
            $columnIndex++;
        }

        // **Style for Headers**
        $sheet->getStyle("A2:O2")->applyFromArray([
            'fill' => [
                'fillType' => Fill::FILL_SOLID,
                'startColor' => ['rgb' => 'D3D3D3']
            ],
            'alignment' => [
                'horizontal' => Alignment::HORIZONTAL_CENTER,
                'vertical' => Alignment::VERTICAL_CENTER
            ],
            'font' => ['bold' => true]
        ]);

        // **Set Data in the Table**
        $data = [
            $marche['numero_aoo'] ?? '',
            $marche['numero_marche'] ?? '',
            $marche['annee_budgetaire'] ?? '',
            $marche['objet'] ?? '',
            $marche['date_approbation'] ?? '',
            $marche['raison_sociale'] ?? '',
            $marche['status'] ?? '',
            $marche['registre_commerce'] ?? '',
            $marche['patente'] ?? '',
            $marche['cnss'] ?? '',
            $marche['adresse'] ?? '',
            $marche['gerant'] ?? '',
            $marche['telephone'] ?? '',
            $marche['fax'] ?? '',
            $marche['email'] ?? ''
        ];

        $columnIndex = 'A';
        foreach ($data as $value) {
            $sheet->setCellValue("{$columnIndex}3", $value);
            $columnIndex++;
        }

        // **Auto-size Columns**
        foreach (range('A', 'O') as $column) {
            $sheet->getColumnDimension($column)->setAutoSize(true);
        }

        // **Prepare File for Download**
        header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        header('Content-Disposition: attachment; filename="Marche_' . $id . '.xlsx"');
        header('Cache-Control: max-age=0');
        flush();

        $writer = new Xlsx($spreadsheet);
        $writer->save('php://output');
        exit;
    }
    
    /**
     * Recherche de marchés
     */
    public function searchMarches()
{
    // Récupérer les paramètres de recherche
    $filters = $_GET;

    // Vérifier si au moins un paramètre est fourni
    if (empty($filters)) {
        http_response_code(400);
        echo json_encode(["message" => "Aucun critère de recherche fourni"]);
        return;
    }

    // Appeler la fonction de recherche dans le modèle
    $results = $this->marche->searchMarches($filters);

    http_response_code(200);
    echo json_encode(["records" => $results]);
}
    
    /**
     * Enregistre le contenu XML pour un marché
     * @param int $id - ID du marché
     */
    public function saveXmlContent($id)
    {
        if (empty($id) || !is_numeric($id)) {
            http_response_code(400);
            echo json_encode(["message" => "ID de marché manquant ou invalide"]);
            return;
        }
        
        $xmlContent = file_get_contents("php://input");
        
        if (empty($xmlContent)) {
            http_response_code(400);
            echo json_encode(["message" => "Contenu XML manquant"]);
            return;
        }
        
        try {
            $success = $this->marche->saveXmlContent($id, $xmlContent);
            
            if ($success) {
                http_response_code(200);
                echo json_encode(["message" => "Contenu XML enregistré avec succès"]);
            } else {
                http_response_code(404);
                echo json_encode(["message" => "Marché non trouvé"]);
            }
        } catch (\Exception $e) {
            http_response_code(503);
            echo json_encode(["message" => "Erreur lors de l'enregistrement du contenu XML: " . $e->getMessage()]);
        }
    }
    
    /**
     * Récupère le contenu XML d'un marché
     * @param int $id - ID du marché
     */
    public function getXmlContent($id)
    {
        if (empty($id) || !is_numeric($id)) {
            http_response_code(400);
            echo json_encode(["message" => "ID de marché manquant ou invalide"]);
            return;
        }
        
        $xmlContent = $this->marche->getXmlContent($id);
        
        if ($xmlContent) {
            header('Content-Type: application/xml');
            echo $xmlContent;
        } else {
            http_response_code(404);
            echo json_encode(["message" => "Contenu XML non trouvé pour ce marché"]);
        }
    }
 
    
   

    
    // /**
    //  * Récupère les répartitions de marchés par année et par statut
    //  */
    // public function getMarcheDistributions()
    // {
    //     $distributions = $this->marche->getMarcheDistributions();
        
    //     http_response_code(200);
    //     echo json_encode($distributions);
    // }
    
    /**
     * Valide les données d'un marché
     * @param array $data - Données à valider
     * @return bool - True si les données sont valides
     */
    private function validateMarcheData($data)
    {
        if (!is_array($data)) {
            return false;
        }
        
        $requiredFields = [
            'numero_aoo', 
            'numero_marche', 
            'annee_budgetaire', 
            'objet'
        ];
        
        foreach ($requiredFields as $field) {
            if (!isset($data[$field]) || trim($data[$field]) === '') {
                return false;
            }
        }
        
        // Si c'est une création, vérifier aussi la raison sociale
        if (!isset($data['id']) && (!isset($data['raison_sociale']) || trim($data['raison_sociale']) === '')) {
            return false;
        }
        
        return true;
    }

    // funtion search marche---
    // ->appel fun model marche
    // ->appel fun model document
}
