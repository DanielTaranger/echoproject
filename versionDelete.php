<?php
session_start();
	require('db.php');
    if (isset($_SESSION['username'])){
        $username = $_SESSION['username'];
		$username = stripslashes($username);

        $projectID = $_POST['projectID'];
        $versionID = $_POST['versionID'];

        $sql = "DELETE versions WHERE versionID=".$versionID;

            if (mysqli_query($conn, $sql)) {
                echo "Record deleted successfully";
            } else {
                echo "Error deleting record: " . mysqli_error($conn);
            }

        mysqli_close($conn);

    
        mysql_close($conn);

        echo "<p>You did it</p>";
    }else{
		echo "<p>You are not permitted to do this</p>";
	}

?>