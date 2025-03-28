<?php

class User {
    private $conn;
    private $table_name = "users";

    // Propriétés
    public $id;
    public $name_user;
    public $password;
    public $role;
    public $privilege;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Méthode de login (à améliorer avec password_verify)
    public function login($name_user, $password) {
        $query = "SELECT * FROM " . $this->table_name . " WHERE name_user = ? LIMIT 0,1";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $name_user);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($row) {
           // avec un mot de passe haché, utilisez password_verify($password, $row['password'])
             if (password_verify($password, $row["password"])){
                 $this->id = $row['id'];
                 $this->name_user = $row['name_user'];
                 $this->role = $row['role'];
                 $this->privilege = $row['privilege'];

                return [
                    'id' => $this->id,
                    'name_user' => $this->name_user,
                    'role' => $this->role,
                    'privilege' => $this->privilege
                ];
            }
           return $row ;
        }
        
        return false;
    }
    public function getUserDetails($user_id)
    {
        // logic to get user details
        $query = "SELECT * FROM " . $this->table_name . " WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $user_id);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
    // Méthode d'inscription
    public function register($name_user, $password, $role = 'viewer') {
        // Vérifier si l'utilisateur existe déjà
        $check_query = "SELECT id FROM " . $this->table_name . " WHERE name_user = ?";
        $check_stmt = $this->conn->prepare($check_query);
        $check_stmt->bindParam(1, $name_user);
        $check_stmt->execute();

        if ($check_stmt->rowCount() > 0) {
            return false; // Utilisateur déjà existant
        }

        // Insertion du nouvel utilisateur
        $query = "INSERT INTO " . $this->table_name . " 
                  (name_user, password, role, created_at) 
                  VALUES (:name_user, :password, :role, NOW())";
        
        $stmt = $this->conn->prepare($query);
        
        // Nettoyer et lier les paramètres
        $stmt->bindParam(':name_user', $name_user);
        $stmt->bindParam(':password', $password);
        $stmt->bindParam(':role', $role);

        if ($stmt->execute()) {
            return $this->conn->lastInsertId();
        }
        
        return false;
    }

    // Mettre à jour le profil utilisateur
    public function updateProfile($user_id, $update_data) {
        $set_clauses = [];
        $params = [];

        // Construire dynamiquement la requête de mise à jour
        foreach ($update_data as $key => $value) {
            $set_clauses[] = "$key = :$key";
            $params[":$key"] = $value;
        }

        if (empty($set_clauses)) {
            return false;
        }

        $query = "UPDATE " . $this->table_name . " 
                  SET " . implode(', ', $set_clauses) . "
                  WHERE id = :user_id";
        
        $params[':user_id'] = $user_id;

        $stmt = $this->conn->prepare($query);
        return $stmt->execute($params);
    }

    // Récupérer tous les utilisateurs (avec pagination)
    public function getAllUsers($limit = 10, $offset = 0) {
        $query = "SELECT id, name_user, role, created_at 
                  FROM " . $this->table_name . "
                  ORDER BY created_at DESC
                  LIMIT :limit OFFSET :offset";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindParam(':offset', $offset, PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Compter le nombre total d'utilisateurs
    public function countUsers() {
        $query = "SELECT COUNT(*) as total FROM " . $this->table_name;
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        return $result['total'];
    }

    // Supprimer un utilisateur
    public function deleteUser($user_id) {
        $query = "DELETE FROM " . $this->table_name . " WHERE id = :user_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':user_id', $user_id);
        return $stmt->execute();
    }

    // Récupérer les permissions spécifiques d'un utilisateur
    public function getUserPermissions($user_id) {
        $query = "SELECT role, privilege FROM " . $this->table_name . " WHERE id = :user_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':user_id', $user_id);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    // Mettre à jour les permissions d'un utilisateur
    public function updateUserPermissions($user_id, $role, $privilege) {
        $query = "UPDATE " . $this->table_name . " 
                  SET role = :role, privilege = :privilege 
                  WHERE id = :user_id";
        
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':role', $role);
        $stmt->bindParam(':privilege', $privilege);
        $stmt->bindParam(':user_id', $user_id);
        
        return $stmt->execute();
    }

   // Vérifier si un utilisateur a un privilège spécifique
    public function hasPrivilege($user_id, $required_privilege) {
        $query = "SELECT privilege FROM " . $this->table_name . " WHERE id = :user_id";
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':user_id', $user_id);
        $stmt->execute();
        
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        
        // Exemple de logique de vérification de privilège
        // À personnaliser selon votre système de privilèges
        return $result && 
               (($result['privilege'] & $required_privilege) === $required_privilege);
    }
}