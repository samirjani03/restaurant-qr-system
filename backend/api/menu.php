<?php
header('Content-Type: application/json');
$conn = new mysqli('localhost', 'root', '', 'restaurant_qr');

$sql = "SELECT * FROM menu WHERE available = 1";
$result = $conn->query($sql);

$menu = [];
while ($row = $result->fetch_assoc()) {
    $menu[] = $row;
}

echo json_encode($menu);
?>
