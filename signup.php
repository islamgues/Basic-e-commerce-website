<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $firstname = $_POST["firstname"];
    $lastname = $_POST["lastname"];
    $email = $_POST["email"];
    $username = $_POST["username"];
    $password = $_POST["password"];

    // Connect to your database (replace with your actual database credentials)
    $servername = "localhost";
    $db_username = "root";
    $db_password = "";
    $dbname = "mydb";

    $conn = new mysqli($servername, $db_username, $db_password, $dbname);

    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    // Insert new user into the database
    $sql = "INSERT INTO client (firstName, lastName, email, username, password)
            VALUES ('$firstname', '$lastname', '$email', '$username', '$password')";

    if ($conn->query($sql) === TRUE) {
        // User registered successfully, redirect to login page
        header("Location: login.html");
        exit();
    } else {
        // Error inserting user, display an error message
        echo "Error: " . $sql . "<br>" . $conn->error;
    }

    $conn->close();
}
?>
