<?php
include('../db/connection.php');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $table_id = $_POST['table_id'];
    $items = $_POST['items'];

    if (!empty($items)) {
        foreach ($items as $item_id) {
            $query = "INSERT INTO orders (table_id, item_id, status) VALUES ('$table_id', '$item_id', 'Pending')";
            $conn->query($query);
        }
        echo "Order placed successfully!";
    } else {
        echo "No items selected.";
    }
}
?>
