<?php
 session_start();
 header("Access-Control-Allow-Origin: http://localhost:5173");
 header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
 header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
 header("Access-Control-Allow-Credentials: true"); // Allow cookies
 header("Access-Control-Max-Age: 86400"); // 1 day
 
// routes/api.php

/**
 * Ce fichier définit toutes les routes de l'API du système de gestion des marchés
 * Il utilise un routeur simple pour diriger les requêtes vers les contrôleurs appropriés
 */


// Place this at the very beginning of your file
require_once '../database_connexion/dataConnexion.php';
require_once __DIR__ . '/../middleware/AuthAuthorization.php';
require_once __DIR__ . '/../Controllers/MarcheController.php';
require_once __DIR__ . '/../Controllers/EntrepriseController.php';
require_once __DIR__ . '/../Controllers/UserController.php';
require_once '../env.php'; 
loadEnv('../.env');
// Handle preflight OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    header("HTTP/1.1 200 OK");
    exit;
}

// Classe Router pour gérer les routes de l'API
class Router
{
    private $routes = [];
    private $notFoundCallback;

    /**
     * Ajoute une route GET
     * @param string $path - Chemin de la route
     * @param callable $callback - Fonction à exécuter
     */
    public function get($path, $callback)
    {
        $this->addRoute('GET', $path, $callback);
    }

    /**
     * Ajoute une route POST
     * @param string $path - Chemin de la route
     * @param callable $callback - Fonction à exécuter
     */
    public function post($path, $callback)
    {
        $this->addRoute('POST', $path, $callback);
    }

    /**
     * Ajoute une route PUT
     * @param string $path - Chemin de la route
     * @param callable $callback - Fonction à exécuter
     */
    public function put($path, $callback)
    {
        $this->addRoute('PUT', $path, $callback);
    }

    /**
     * Ajoute une route DELETE
     * @param string $path - Chemin de la route
     * @param callable $callback - Fonction à exécuter
     */
    public function delete($path, $callback)
    {
        $this->addRoute('DELETE', $path, $callback);
    }

    /**
     * Définit la fonction à exécuter si aucune route n'est trouvée
     * @param callable $callback - Fonction à exécuter
     */
    public function notFound($callback)
    {
        $this->notFoundCallback = $callback;
    }

    /**
     * Ajoute une route au tableau des routes
     * @param string $method - Méthode HTTP
     * @param string $path - Chemin de la route
     * @param callable $callback - Fonction à exécuter
     */
    private function addRoute($method, $path, $callback)
    {
        // Convertir le chemin en expression régulière pour capturer les paramètres
        $pattern = preg_replace('/\/{([^\/]+)}/', '/(?P<$1>[^/]+)', $path);
        $pattern = '#^' . $pattern . '$#';

        $this->routes[$method][$pattern] = $callback;
    }

    /**
     * Exécute la route correspondant à la requête
     */
    public function run()
    {
        $method = $_SERVER['REQUEST_METHOD'];

        // Pour les requêtes PUT et DELETE qui utilisent _method
        if ($method === 'POST' && isset($_POST['_method'])) {
            if ($_POST['_method'] === 'PUT' || $_POST['_method'] === 'DELETE') {
                $method = strtoupper($_POST['_method']);
            }
        }

        $uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

        // Supprimer le préfixe du chemin de base si nécessaire
        $basePath = $_ENV['APP_BASE_PATH'];
        if (strpos($uri, $basePath) === 0) {
            $uri = substr($uri, strlen($basePath));
        }

        // Gérer le cas où l'URI est vide
        if (empty($uri)) {
            $uri = '/';
        }

        // Chercher une route correspondante
        if (isset($this->routes[$method])) {
            foreach ($this->routes[$method] as $pattern => $callback) {
                if (preg_match($pattern, $uri, $matches)) {
                    // Filtrer les correspondances numériques
                    $params = array_filter($matches, function ($key) {
                        return !is_numeric($key);
                    }, ARRAY_FILTER_USE_KEY);

                    // Exécuter le callback avec les paramètres
                    call_user_func_array($callback, $params);
                    return;
                }
            }
        }

        // Si aucune route n'est trouvée, exécuter la fonction notFound
        if ($this->notFoundCallback) {
            call_user_func($this->notFoundCallback);
        } else {
            // Réponse par défaut pour 404
            header('HTTP/1.1 404 Not Found');
            echo json_encode(['message' => 'Route non trouvée']);
        }
    }
}

// Instancier le routeur
$router = new Router();

// Initialiser la connexion à la base de données
$database = new Database();
$db = $database->getConnection();


// Instancier les contrôleurs
$marcheController = new MarcheController($db);
$entrepriseController = new TitulaireController($db);
$userController = new UserController($db);
// Dans votre fichier de routes
// Routes for Markets (Marches)// Define routes for Marches
$router->get('/marches', AuthAuthorization::checkPrivilege(['admin', 'view' , 'edit'], function () use ($marcheController) {
    $marcheController->getAllMarches();
}));
// Define other routes for Marches statistics, search, and export
$router->get('/marches/stats', AuthAuthorization::checkPrivilege(['admin', 'view','edit'], function () use ($marcheController) {
    $marcheController->getStatistics();
}));

$router->get('/marches/search', AuthAuthorization::checkPrivilege(['admin', 'edit'], function () use ($marcheController) {
    $marcheController->searchMarches();
}));
$router->get('/marches/{id}', AuthAuthorization::checkPrivilege(['admin', 'view' ,'edit'], function ($id) use ($marcheController) {
    $marcheController->getMarcheById($id);
}));

$router->post('/marches', AuthAuthorization::checkPrivilege(['admin','edit'], function () use ($marcheController) {
    $marcheController->createMarche();
}));


$router->put('/marches/{id}', AuthAuthorization::checkPrivilege(['admin','edit'], function ($id) use ($marcheController) {
    $marcheController->updateMarche($id);
}));

$router->delete('/marches/{id}', AuthAuthorization::checkPrivilege(['admin', 'edit'], function ($id) use ($marcheController) {
    $marcheController->deleteMarche($id);
}));

// Define routes for Users
$router->get('/users', AuthAuthorization::checkPrivilege(['admin'], function () use ($userController) {
    $userController->getAllUsers();
}));

$router->get('/users/{id}', AuthAuthorization::checkPrivilege(['admin'], function ($id) use ($userController) {
    $userController->getUserById($id);
}));

$router->post('/users', AuthAuthorization::checkPrivilege(['admin'], function () use ($userController) {
    $userController->createUser();
}));

$router->put('/users/{id}', AuthAuthorization::checkPrivilege(['admin'], function ($id) use ($userController) {
    $userController->updateUser($id);
}));

$router->delete('/users/{id}', AuthAuthorization::checkPrivilege(['admin'], function ($id) use ($userController) {
    $userController->deleteUser($id);
}));

$router->put('/users/{id}/permissions', AuthAuthorization::checkPrivilege(['admin'], function ($id) use ($userController) {
    $userController->updateUserPermissions($id);
}));


$router->get('/marches/export/pdf/{id}', AuthAuthorization::checkPrivilege(['admin','edit'], function ($id) use ($marcheController) {
    $marcheController->exportPdf($id);
}));

$router->get('/marches/export/{id}', AuthAuthorization::checkPrivilege(['admin','edit'], function ($id) use ($marcheController) {
    $marcheController->exportMarcheAsExcel($id);
}));

// Define routes for Entreprises
$router->get('/entreprises', AuthAuthorization::checkPrivilege(['admin', 'view','edit'], function () use ($entrepriseController) {
    $entrepriseController->index();
}));

$router->get('/entreprises/{id}', AuthAuthorization::checkPrivilege(['admin', 'view','edit'], function ($id) use ($entrepriseController) {
    $entrepriseController->show($id);
}));

$router->put('/entreprises/{id_p}', AuthAuthorization::checkPrivilege(['admin','edit'], function ($id) use ($entrepriseController) {
    $entrepriseController->update($id);
}));

$router->get('/entreprises/search/{term}', AuthAuthorization::checkPrivilege(['admin', 'edit'], function ($term) use ($entrepriseController) {
    $entrepriseController->search($term);
}));


// Définir les routes pour l'authentification
$router->post('/login', function () use ($userController) {
    $data = json_decode(file_get_contents('php://input'), true);
    $userController->login($data['user_name'], $data['password']);
});
$router->post('/logout', function () {
    session_unset();  // Unset all session variables
    session_destroy(); // Destroy the session
    echo json_encode(["message" => "Logged out successfully."]);
});
$router->get('/session', function () {
    if (isset($_SESSION['user'])) {
        echo json_encode(["user" => $_SESSION['user']]);
    } else {
        http_response_code(401);
        echo json_encode(["error" => "Not authenticated"]);
    };
});
// Route par défaut
$router->notFound(function () {
    header('HTTP/1.1 404 Not Found');
    echo json_encode([
        'status' => 404,
        'message' => 'Route non trouvée'
    ]);
});


// Exécuter le routeur
$router->run();
