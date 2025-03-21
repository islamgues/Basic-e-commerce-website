<?php
// Establish a connection to the MySQL database
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "mydb";

$conn = new mysqli($servername, $username, $password, $dbname);

// Check the connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}


$searchTerm = $_GET['q']; 
$page = isset($_GET['page']) ? $_GET['page'] : 1; 
$perPage = 25; 

$offset = ($page - 1) * $perPage;


$sql = "SELECT * FROM product WHERE productName LIKE '%$searchTerm%'";


$sql .= " LIMIT $offset, $perPage";


$result = $conn->query($sql);


$searchResults = [];


if ($result->num_rows > 0) {
    
    while ($row = $result->fetch_assoc()) {
        $searchResults[] = $row;
    }
}


$conn->close();


header('Content-Type: application/json');
echo json_encode([
    'results' => $searchResults,
    'totalResults' => count($searchResults) // Assuming this is the total count for the current search query
]);
?>
