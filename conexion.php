<?php
$host = '127.0.0.1'; // Usar la IP directamente
$user = 'root';
$pass = '';
$db = 'empresa';

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die(json_encode([
        'status' => 'error',
        'message' => 'Conexión fallida: ' . $conn->connect_error
    ]));
}

$conn->set_charset("utf8mb4");
?>