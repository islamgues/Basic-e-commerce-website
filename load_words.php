<?php

// Connect to the MySQL database
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "mydb";

$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}


$query = "SELECT SUBSTRING_INDEX(productName, ' ', 1) AS first_word FROM product";
$result = $conn->query($query);


$first_words = [];


if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $first_words[] = $row["first_word"];
    }
}

$json_array = json_encode($first_words);


echo $json_array;

$conn->close();

?>