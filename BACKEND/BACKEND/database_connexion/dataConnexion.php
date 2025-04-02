<?php
require_once '../env.php'; 
loadEnv('../.env');

class Database {
    private $host;
    private $db_name;
    private $username;
    private $password;
    private $conn;

    public function __construct() {
        // Fetch database configurations from environment variables
        $this->host = $_ENV['DB_HOST'];
        $this->db_name = $_ENV['DB_NAME'];
        $this->username = $_ENV['DB_USER'];
        $this->password = $_ENV['DB_PASS'];
    }

    /**
     * Establishes a connection to the database
     * @return PDO|null - PDO connection object or null if connection fails
     */
    public function getConnection() {
        $this->conn = null;

        try {
            $this->conn = new PDO(
                'mysql:host=' . $this->host . ';dbname=' . $this->db_name,
                $this->username,
                $this->password
            );
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $this->conn->exec("set names utf8");
        } catch (PDOException $e) {
            echo 'Connection error: ' . $e->getMessage();
        }

        return $this->conn;
    }

    /**
     * Tests the database connection
     * @return bool - Returns true if connection is established, false otherwise
     */
    public function testConnection() {
        try {
            $conn = $this->getConnection();
            return $conn !== null; // True if connection exists, false otherwise
        } catch (PDOException $e) {
            return false;
        }
    }
}
?>
