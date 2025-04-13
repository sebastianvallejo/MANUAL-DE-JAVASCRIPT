<?php
header("Access-Control-Allow-Origin: http://127.0.0.1");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=utf-8");

require __DIR__ . '/conexion.php';

$input = json_decode(file_get_contents('php://input'), true);

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    try {
        if (empty($input['id']) || empty($input['nombre']) || empty($input['email'])) {
            throw new Exception("Todos los campos son requeridos");
        }

        $stmt = $conn->prepare("UPDATE usuarios SET nombre = ?, email = ? WHERE id = ?");
        $stmt->bind_param("ssi", $input['nombre'], $input['email'], $input['id']);
        
        if (!$stmt->execute()) {
            throw new Exception("Error al actualizar usuario: " . $stmt->error);
        }
        
        if ($stmt->affected_rows === 0) {
            throw new Exception("No se encontró el usuario o no hubo cambios");
        }
        
        echo json_encode([
            'success' => true,
            'message' => 'Usuario actualizado exitosamente'
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