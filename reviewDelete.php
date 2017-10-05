<?php
session_start();
	require('db.php');
    if (isset($_SESSION['username'])){

        $username = $_SESSION['username'];
		$username = stripslashes($username);

        $reviewID = $_POST['reviewID'];
        $dataOut = array();



        $sql = "DELETE FROM reviews WHERE reviewID='$reviewID'";
        mysqli_query($conn,$sql);
        $dataOut['success'] = true;

        echo json_encode($dataOut);
    }
?>