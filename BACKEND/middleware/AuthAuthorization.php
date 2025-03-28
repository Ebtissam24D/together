<?php
class AuthAuthorization
{
    static function checkPrivilege($requiredPrivileges, $callback) {
        return function (...$args) use ($requiredPrivileges, $callback) {
            // Check if the session is set and user data exists
            
            if (!isset($_SESSION['user'])) {
                http_response_code(401); // Unauthorized
                echo json_encode(["error" => "Unauthorized access. Please log in."]);
                exit;
            }
    
            $user = $_SESSION['user']; // User info stored in session
    
            // Ensure $user['privilege'] is an array (if it's a string, split it)
            $userPrivileges = is_array($user['privilege']) ? $user['privilege'] : explode(',', $user['privilege']);
    
            // Check if any of the user's privileges match the required privileges
            if (!array_intersect($requiredPrivileges, $userPrivileges)) {
                http_response_code(403); // Forbidden - Insufficient privileges
                echo json_encode(["error" => "Insufficient privileges."]);
                exit;
            }
    
            // If the user has the correct privilege, execute the callback function
            return $callback(...$args);
        };
    }
}
