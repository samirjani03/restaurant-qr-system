<?php
// tables.php
include('../db/connection.php');

// Fetch available tables from database
$query = "SELECT * FROM tables";
$result = $conn->query($query);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tables Management</title>
    <link rel="stylesheet" href="../css/styles.css">
</head>
<body>
    <h1>Tables Management</h1>
    <table border="1">
        <thead>
            <tr>
                <th>Table ID</th>
                <th>Status</th>
                <th>QR Code</th>
            </tr>
        </thead>
        <tbody>
            <?php
            if ($result->num_rows > 0) {
                while ($row = $result->fetch_assoc()) {
                    echo "<tr>";
                    echo "<td>{$row['id']}</td>";
                    echo "<td>" . ($row['is_occupied'] ? "Occupied" : "Available") . "</td>";
                    echo "<td><img src='https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=Table={$row['id']}' alt='QR Code'></td>";
                    echo "</tr>";
                }
            } else {
                echo "<tr><td colspan='3'>No tables found</td></tr>";
            }
            ?>
        </tbody>
    </table>
</body>
</html>
