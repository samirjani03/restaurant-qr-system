<?php
header('Content-Type: application/json');
$conn = new mysqli('localhost', 'root', '', 'restaurant_qr');

$data = json_decode(file_get_contents('php://input'), true);
$tableNumber = $data['tableNumber'];
$orderDetails = json_encode($data['order']);

$sql = "INSERT INTO orders (table_number, order_details) VALUES ('$tableNumber', '$orderDetails')";
if ($conn->query($sql)) {
    echo json_encode(['status' => 'success']);
} else {
    echo json_encode(['status' => 'error', 'message' => $conn->error]);
}
?>
