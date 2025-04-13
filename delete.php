<?php
header("Access-Control-Allow-Origin: http://127.0.0.1");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=utf-8");

require __DIR__ . '/conexion.php';

$input = json_decode(file_get_contents('php://input'), true);

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    try {
        if (empty($input['id'])) {
            throw new Exception("ID es requerido");
        }

        $stmt = $conn->prepare("DELETE FROM usuarios WHERE id = ?");
        $stmt->bind_param("i", $input['id']);
        
        if (!$stmt->execute()) {
            throw new Exception("Error al eliminar usuario: " . $stmt->error);
        }
        
        if ($stmt->affected_rows === 0) {
            throw new Exception("No se encontró el usuario con ese ID");
        }
        
        echo json_encode([
            'success' => true,
            'message' => 'Usuario eliminado exitosamente'
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