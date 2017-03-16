<?php
session_start();
ob_start();
	require('db.php');
	
    // If form submitted, insert values into the database.
    if (isset($_SESSION['username'])){
        $username = $_SESSION['username'];
		$username = stripslashes($username);

	//Checking is user existing in the database or not
        $query = "SELECT * FROM projects WHERE username='$username' ORDER BY date DESC";
		$result = mysqli_query($conn, $query) or die(mysqli_error($conn));
		$rows = mysqli_num_rows($result);
		if($rows>=1){
	
			while($row = mysqli_fetch_array($result)) {
				
				$projName = "";

				if(strlen($row[2])>=14){
					$projName = substr($row[2], 0, 14) . "..."; 
				}else{
					$projName = $row[2];
				}
				echo '<a href="#'.$row[2].'" class="projectContainer" onclick="loadProject('."'".$row[1]."'".')">'. $projName ."</a>";
			}
		  
		}else{
            echo "<p>No projects found</p>";
		} 

    }else{
		echo "<p>You are not permitted to do this</p>";
	}

ob_end_flush();
?>