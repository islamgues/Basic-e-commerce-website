<?php

$servername = "localhost";
$username = "root"; 
$password = ""; 
$database = "mydb"; 

$conn = new mysqli($servername, $username, $password, $database);

if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}


$sql = "SELECT productName FROM product";

$result = $conn->query($sql);

if ($result->num_rows > 0) {
  $products = array();
  while ($row = $result->fetch_assoc()) {
    $products[] = $row["productName"];
  }
  
  header('Content-Type: application/json');
  echo json_encode(array("products" => $products));
} else {
  echo "No products found";
}

$conn->close();
?>
