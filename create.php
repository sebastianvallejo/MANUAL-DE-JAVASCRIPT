<?php
header("Access-Control-Allow-Origin: http://127.0.0.1");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=utf-8");
require __DIR__ . '/conexion.php';

$input = json_decode(file_get_contents('php://input'), true);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        if (empty($input['nombre']) || empty($input['email'])) {
            throw new Exception("Nombre y email son requeridos");
        }

        $stmt = $conn->prepare("INSERT INTO usuarios (nombre, email) VALUES (?, ?)");
        $stmt->bind_param("ss", $input['nombre'], $input['email']);
        
        if (!$stmt->execute()) {
            throw new Exception("Error al crear usuario: " . $stmt->error);
        }
        
        echo json_encode([
            'success' => true,
            'id' => $stmt->insert_id,
            'message' => 'Usuario creado exitosamente'
        ]);
        
    } catch (Exception $e) {
        http_response_code(400);
        echo json_encode(['error' => $e->getMessage()]);
    }
    
    $stmt->close();
    $conn->close();
    exit;
}

http_response_code(405);
echo json_encode(['error' => 'Método no permitido']);
?>