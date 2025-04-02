<?php

require_once '../Models/User.php';

class UserController
{
    private $user;

    public function __construct($db)
    {
        $this->user = new User($db);
    }

    public function login($user_name, $password)
    {
        $user_name = htmlspecialchars(strip_tags($user_name));
        $password = htmlspecialchars(strip_tags($password));
        $result = $this->user->login($user_name, $password);
    }

    public function register($user_name, $password, $email)
    {
        $user_name = htmlspecialchars(strip_tags($user_name));
        $password = htmlspecialchars(strip_tags($password));
        $email = htmlspecialchars(strip_tags($email));

        if ($this->user->register($user_name, $password, $email)) {
            echo json_encode(['message' => 'Utilisateur enregistré avec succès']);
        } else {
            echo json_encode(['message' => 'Échec de l\'enregistrement de l\'utilisateur']);
        }
    }

    public function getUserDetails($user_id)
    {
        $user_id = htmlspecialchars(strip_tags($user_id));
        $result = $this->user->getUserDetails($user_id);

        if ($result) {
            echo json_encode($result);
        } else {
            echo json_encode(['message' => 'Détails de l\'utilisateur non trouvés']);
        }
    }

    public function getAllUsers()
    {
        $result = $this->user->getAllUsers();

        if ($result) {
            echo json_encode($result);
        } else {
            echo json_encode(['message' => 'Aucun utilisateur trouvé']);
        }
    }

    public function updateUserPermissions($user_id)
    {

        if (empty($user_id) || !is_numeric($user_id)) {
            http_response_code(400);
            echo json_encode(["message" => "ID de user manquant ou invalide"]);
            return;
        }

        $user_id = htmlspecialchars(strip_tags($user_id));

        $permissions = json_decode(file_get_contents("php://input"), true)?? null;

        if (is_null($permissions)) {
            http_response_code(400);
            echo json_encode(["message" => "Permissions manquantes ou invalides"]);
            return;
        }
        $result = $this->user->updateUserPermissions($user_id, $permissions);

        if ($result) {
            echo json_encode(['message' => 'Permissions de l\'utilisateur mises à jour avec succès']);
        } else {
            echo json_encode(['message' => 'Échec de la mise à jour des permissions de l\'utilisateur']);
        }
    }
    public function getUserById($id) {}

    public function createUser() {}

    public function updateUser($id) {}

    public function deleteUser($id) {}
}
