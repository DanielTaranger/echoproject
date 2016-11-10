<?php
session_start();
	require('db.php');
    if (isset($_SESSION['username'])){
        $username = $_SESSION['username'];
		$username = stripslashes($username);

        $projectID = $_POST['projectID'];
        $versionID = $_POST['versionID'];

        $parentID = "";
        $children = array();

        $query="SELECT * FROM versions WHERE projectID='$projectID' ORDER BY parent DESC";
        $result = mysqli_query($conn, $query) or die(mysqli_error($conn));
        $rows = mysqli_num_rows($result);
    
        if($rows>=1){
            while($row = mysqli_fetch_array($result)) {
                if($row[1] == $versionID){
                    $parentID = $row[4];
                }

                if($row[4] == $versionID){
                    $outData = $row[1];
                     array_push($children,$outData);
                }
            }
        }

        foreach($children as $value){
                $query = "UPDATE versions SET parent = '$parentID' WHERE versionID='$value'";
                $result = mysqli_query($conn, $query) or die(mysqli_error($conn));
        }


        $sql = "DELETE FROM versions WHERE versionID='$versionID'";

            if (mysqli_query($conn,$sql)) {
                echo "Record deleted successfully";
            } else {
                echo "Error deleting record: " . mysqli_error($conn);
            }


        echo $sql;
    }else{
		echo "<p>You are not permitted to do this</p>";
	}

?>