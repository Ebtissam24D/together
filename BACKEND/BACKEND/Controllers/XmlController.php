<?php
namespace App\Controllers;

use App\Models\Marche;

class XmlController {
    private $marcheModel;
    
    public function __construct() {
        $this->marcheModel = new Marche();
    }
    
    public function uploadXml($marcheId) {
        if (!isset($_FILES['xml_file'])) {
            header('HTTP/1.1 400 Bad Request');
            echo json_encode([
                'status' => 'error',
                'message' => 'Aucun fichier XML n\'a été envoyé'
            ]);
            return;
        }
        
        $file = $_FILES['xml_file'];
        
        // Vérifier les erreurs de téléchargement
        if ($file['error'] !== UPLOAD_ERR_OK) {
            header('HTTP/1.1 400 Bad Request');
            echo json_encode([
                'status' => 'error',
                'message' => 'Erreur de téléchargement: ' . $this->getUploadErrorMessage($file['error'])
            ]);
            return;
        }
        
        // Vérifier que c'est bien un fichier XML
        $fileInfo = pathinfo($file['name']);
        if (strtolower($fileInfo['extension']) !== 'xml') {
            header('HTTP/1.1 400 Bad Request');
            echo json_encode([
                'status' => 'error',
                'message' => 'Le fichier doit être au format XML'
            ]);
            return;
        }
        
        // Lire le contenu du fichier
        $xmlContent = file_get_contents($file['tmp_name']);
        
        // Vérifier que le contenu est bien du XML valide
        libxml_use_internal_errors(true);
        $xmlObj = simplexml_load_string($xmlContent);
        if ($xmlObj === false) {
            $errors = libxml_get_errors();
            libxml_clear_errors();
            
            header('HTTP/1.1 400 Bad Request');
            echo json_encode([
                'status' => 'error',
                'message' => 'XML invalide: ' . $errors[0]->message
            ]);
            return;
        }
        
        // Enregistrer le contenu XML dans la base de données
        try {
            $success = $this->marcheModel->saveXmlContent($marcheId, $xmlContent);
            
            if (!$success) {
                header('HTTP/1.1 404 Not Found');
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Marché non trouvé'
                ]);
                return;
            }
            
            header('Content-Type: application/json');
            echo json_encode([
                'status' => 'success',
                'message' => 'Fichier XML importé avec succès'
            ]);
        } catch (\Exception $e) {
            header('HTTP/1.1 500 Internal Server Error');
            echo json_encode([
                'status' => 'error',
                'message' => 'Erreur lors de l\'enregistrement du fichier XML: ' . $e->getMessage()
            ]);
        }
    }
    
    public function saveXmlContent($marcheId) {
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($data['xml_content'])) {
            header('HTTP/1.1 400 Bad Request');
            echo json_encode([
                'status' => 'error',
                'message' => 'Contenu XML manquant'
            ]);
            return;
        }
        
        $xmlContent = $data['xml_content'];
        
        // Vérifier que le contenu est bien du XML valide
        libxml_use_internal_errors(true);
        $xmlObj = simplexml_load_string($xmlContent);
        if ($xmlObj === false) {
            $errors = libxml_get_errors();
            libxml_clear_errors();
            
            header('HTTP/1.1 400 Bad Request');
            echo json_encode([
                'status' => 'error',
                'message' => 'XML invalide: ' . $errors[0]->message
            ]);
            return;
        }
        
        // Enregistrer le contenu XML dans la base de données
        try {
            $success = $this->marcheModel->saveXmlContent($marcheId, $xmlContent);
            
            if (!$success) {
                header('HTTP/1.1 404 Not Found');
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Marché non trouvé'
                ]);
                return;
            }
            
            header('Content-Type: application/json');
            echo json_encode([
                'status' => 'success',
                'message' => 'Contenu XML enregistré avec succès'
            ]);
        } catch (\Exception $e) {
            header('HTTP/1.1 500 Internal Server Error');
            echo json_encode([
                'status' => 'error',
                'message' => 'Erreur lors de l\'enregistrement du contenu XML: ' . $e->getMessage()
            ]);
        }
    }
    
    public function getXmlContent($marcheId) {
        $xmlContent = $this->marcheModel->getXmlContent($marcheId);
        
        if ($xmlContent === null) {
            header('HTTP/1.1 404 Not Found');
            echo json_encode([
                'status' => 'error',
                'message' => 'Marché non trouvé ou aucun contenu XML disponible'
            ]);
            return;
        }
        
        header('Content-Type: application/json');
        echo json_encode([
            'status' => 'success',
            'data' => $xmlContent
        ]);
    }
    
    private function getUploadErrorMessage($code) {
        switch ($code) {
            case UPLOAD_ERR_INI_SIZE:
                return 'Le fichier dépasse la taille maximale autorisée par PHP';
            case UPLOAD_ERR_FORM_SIZE:
                return 'Le fichier dépasse la taille maximale autorisée par le formulaire';
            case UPLOAD_ERR_PARTIAL:
                return 'Le fichier n\'a été que partiellement téléchargé';
            case UPLOAD_ERR_NO_FILE:
                return 'Aucun fichier n\'a été téléchargé';
            case UPLOAD_ERR_NO_TMP_DIR:
                return 'Dossier temporaire manquant';
            case UPLOAD_ERR_CANT_WRITE:
                return 'Échec de l\'écriture du fichier sur le disque';
            case UPLOAD_ERR_EXTENSION:
                return 'Une extension PHP a arrêté le téléchargement du fichier';
            default:
                return 'Erreur inconnue';
        }
    }
}
?>