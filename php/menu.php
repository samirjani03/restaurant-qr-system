<?php
include('../db/connection.php');

// Fetch menu items from database
$query = "SELECT * FROM menu";
$result = $conn->query($query);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Menu</title>
    <link rel="stylesheet" href="../css/styles.css">
</head>
<body>
    <h1>Menu</h1>
    <form action="../php/order_handler.php" method="POST">
        <table border="1">
            <thead>
                <tr>
                    <th>Item Name</th>
                    <th>Price</th>
                    <th>Select</th>
                </tr>
            </thead>
            <tbody>
                <?php
                if ($result->num_rows > 0) {
                    while ($row = $result->fetch_assoc()) {
                        echo "<tr>";
                        echo "<td>{$row['item_name']}</td>";
                        echo "<td>{$row['price']}</td>";
                        echo "<td><input type='checkbox' name='items[]' value='{$row['id']}'></td>";
                        echo "</tr>";
                    }
                } else {
                    echo "<tr><td colspan='3'>No menu items available</td></tr>";
                }
                ?>
            </tbody>
        </table>
        <input type="hidden" name="table_id" value="<?php echo $_GET['table_id']; ?>">
        <button type="submit">Place Order</button>
    </form>
</body>
</html>
