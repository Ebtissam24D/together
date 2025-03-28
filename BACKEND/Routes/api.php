<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Max-Age: 86400"); // 1 day
// routes/api.php

/**
 * Ce fichier définit toutes les routes de l'API du système de gestion des marchés
 * Il utilise un routeur simple pour diriger les requêtes vers les contrôleurs appropriés
 */


// Place this at the very beginning of your file
require_once '../database_connexion/dataConnexion.php';
require_once __DIR__ . '/../Controllers/MarcheController.php';
require_once __DIR__ . '/../Controllers/EntrepriseController.php';
require_once __DIR__ . '/../Controllers/UserController.php';

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
        $basePath = '/systeme-gestion-des-marches-et-contrat-/BACKEND/Routes/api';
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
$router->get('/marches/export/pdf/{id}', function ($id) use ($marcheController) {
    $marcheController->exportPdf($id);
});
// Définir les routes pour les marchés
$router->get('/marches', function () use ($marcheController) {
    $marcheController->getAllMarches();
});

$router->get('/marches/stats', function () use ($marcheController) {
    $marcheController->getStatistics();
});

$router->get('/marches/search', function () use ($marcheController) {
    $marcheController->searchMarches();
});

$router->get('/marches/{id}', function ($id) use ($marcheController) {
    $marcheController->getMarcheById($id);
});

$router->post('/marches', function () use ($marcheController) {
    $marcheController->createMarche();
});
// Définir les routes pour les utilisateurs
$router->get('/users', function () use ($userController) {
    $userController->getAllUsers();
});

$router->get('/users/{id}', function ($id) use ($userController) {
    $userController->getUserById($id);
});

$router->get('/login/{user}', function ($user) use ($userController) {
    $user_name = htmlspecialchars(strip_tags($user['name_user']));
    $password = htmlspecialchars(strip_tags($user['password']));
    $userController->login($user_name, $password);

});
$router->post('/users', function () use ($userController) {
    $userController->createUser();
});

$router->put('/users/{id}', function ($id) use ($userController) {
    $userController->updateUser($id);
});

$router->delete('/users/{id}', function ($id) use ($userController) {
    $userController->deleteUser($id);
});


$router->put('/marches/{id}', function ($id) use ($marcheController) {
    $marcheController->updateMarche($id);
});

$router->delete('/marches/{id}', function ($id) use ($marcheController) {
    $marcheController->deleteMarche($id);
});

$router->get('/marches/export/{id}', function ($id) use ($marcheController) {
    $marcheController->exportMarcheAsExcel($id);
});
// Définir les routes pour les entreprises
$router->get('/entreprises', function () use ($entrepriseController) {
    $entrepriseController->index();
});

$router->get('/entreprises/{id}', function ($id) use ($entrepriseController) {
    $entrepriseController->show($id);
});
$router->put('/entreprises/{id_p}', function ($id) use ($entrepriseController) {
    $entrepriseController->update($id);
});

$router->get('/entreprises/search/{term}', function ($term) use ($entrepriseController) {
    $entrepriseController->search($term);
});



// Définir les routes pour les utilisateurs
$router->post('/login', function () use ($userController) {
    $data = json_decode(file_get_contents('php://input'), true);
    $userController->login($data['name_user'], $data['password']);
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
