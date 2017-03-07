<?php
session_start();
	require('db.php');
    if (isset($_SESSION['username'])){
        $username = $_SESSION['username'];
		$username = stripslashes($username);

        $projectID = $_POST['projectID'];
        $file = $_POST['file'];
        $dataOut = array();

        $query = "UPDATE versions SET file = 'no file' WHERE projectID='$projectID'";
        $result = mysqli_query($conn, $query) or die(mysqli_error($conn));

        array_map('unlink', glob("uploaded_files/".$projectID."/".$file));

        $dataOut['success'] = true;
        echo json_encode($dataOut);
    }else{

	}

?>