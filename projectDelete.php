<?php
session_start();
	require('db.php');
    if (isset($_SESSION['username'])){
        $username = $_SESSION['username'];
		$username = stripslashes($username);

        $projectID = $_POST['projectID'];
        $dataOut = array();

        $dirname = "uploaded_files/";
        $dirname = $dirname . $projectID;

        if (file_exists($dirname)) {
                array_map('unlink', glob("$dirname/*.mp3*"));
                rmdir($dirname);
        }


        $sql = "DELETE FROM projects WHERE projectID='$projectID'";

            if (mysqli_query($conn,$sql)) {
                $dataOut['success'] = true;
                $dataOut['data'] = "Record deleted successfully";
            } else {
                 $dataOut['data'] ="Error deleting record: " . mysqli_error($conn);
                 $dataOut['success'] = false;
            }
        
        $sql = "DELETE FROM versions WHERE projectID='$projectID'";

            if (mysqli_query($conn,$sql)) {
                $dataOut['success'] = true;
                $dataOut['data'] = "Record deleted successfully";
            } else {
                 $dataOut['data'] ="Error deleting record: " . mysqli_error($conn);
                 $dataOut['success'] = false;
            }

         $sql = "DELETE FROM project_icons WHERE projectID='$projectID'";

            if (mysqli_query($conn,$sql)) {
                $dataOut['success'] = true;
                $dataOut['data'] = "Record deleted successfully";
            } else {
                 $dataOut['data'] ="Error deleting record: " . mysqli_error($conn);
                 $dataOut['success'] = false;
            }


        echo json_encode($dataOut);
    }else{
	}

?>