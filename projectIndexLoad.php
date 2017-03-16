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
				
				$projName = '<p class="indexProjectName">';
                $time = '<p class="indexProjectTime">'. $row[4] . "</p>";
                $projectID = $row[1];
                

				if(strlen($row[2])>=14){
					$projName = $projName . substr($row[2], 0, 14) . "...". "</p>"; 
				}else{
					$projName = $projName . $row[2] . "</p>";
				}

        $query = "SELECT * FROM project_icons WHERE projectID='$projectID'";
        $resultB = mysqli_query($conn, $query) or die(mysqli_error($conn));
        $rowsB = mysqli_num_rows($resultB);

        $colorBits = "";
        $colorBits2 = "";

        if($rowsB>=1){

            while($rowB = mysqli_fetch_array($resultB)) {
            $bits = $rowB[1];

          //  $bits2 = strrev($bits);
            $bits2 = explode(",", $bits);  


            $out = "";
            $temp = "";
            $count = 0;

    
            foreach ($bits2 as $bit) {
                    $temp = $temp.$bit.",";
                    $count++;
                   if($count >= 3){
                        $out = $out . strrev($temp);
                        $temp = "";
                        $count = 0;
                    }
            }

            $colorBitArr = explode(",", $bits);    
                foreach ($colorBitArr as $bit) {
                    if($bit == "1"){
                        $colorBits = $colorBits . '<div class="bitDark"></div>';
                    }else{
                        $colorBits = $colorBits . '<div class="bitLight"></div>';
                    }
                }

            $colorBitArr2 = explode(",", substr($out, 1));
                foreach ($colorBitArr2 as $bit) {
                    if($bit == "1"){
                        $colorBits2 = $colorBits2 . '<div class="bitDark"></div>';
                    }else{
                        $colorBits2 = $colorBits2 . '<div class="bitLight"></div>';
                    }
                } 
            }
        }


				echo '<a href="#'.$row[2].'" class="projectIndexContainer" onclick="loadProject('."'".$row[1]."'".')">'. 
                '<div class="bitsContainer">'.$colorBits2 .'</div>'. '<div class="bitsContainer">'.$colorBits .'</div>'.$projName.$time."</a>";
                

			}
		  
		}else{
            echo "<p>No projects found</p>";
		} 

    }else{
		echo "<p>You are not permitted to do this</p>";
	}

ob_end_flush();
?>