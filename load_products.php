<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "mydb";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql = "SELECT productName, price, productImg FROM product WHERE category not like 'women' ORDER BY RAND() LIMIT 25 ";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    // Output data of each row
    $products = [];
    while ($row = $result->fetch_assoc()) {
        $productName = $row["productName"];
        $price = $row["price"];
        $productImg = json_decode($row["productImg"], true); // Decode as an associative array
        
        // Get the main image URL from the productImg JSON
        $mainImageUrl = $productImg["image_url"] ?? '';
        
        $products[] = [
            'productName' => $productName,
            'price' => $price,
            'image_url' => $mainImageUrl
        ];
    }
    echo json_encode($products);
} else {
    echo "0 results";
}
$conn->close();
?>
