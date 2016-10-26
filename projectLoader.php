<?php
session_start();
ob_start();
	require('db.php');
	
    // If form submitted, insert values into the database.
    if (isset($_SESSION['username'])){
        $username = $_SESSION['username'];
		$username = stripslashes($username);

	//Checking is user existing in the database or not
        $query = "SELECT * FROM projects WHERE username='$username'";
		$result = mysqli_query($conn, $query) or die(mysqli_error($conn));
		$rows = mysqli_num_rows($result);
		if($rows>=1){
	
			while($row = mysqli_fetch_array($result)) {
				echo '<a href="#'.$row[2].'" id="projectContainer" onclick="loadProject('."'".$row[1]."'".')">'.$row[2]."</div>";
			}
		  
		}else{
            echo "<p>No projects found</p>";
		} 

    }else{
		echo "<p>You are not permitted to do this</p>";
	}

ob_end_flush();
?>