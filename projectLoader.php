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

		$query = "SELECT * FROM project_icons WHERE projectID='$row[1]'";
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
                        $colorBits = $colorBits . '<div class="bitDark" style="width: 3px; height: 3px;"></div>';
                    }else{
                        $colorBits = $colorBits . '<div class="bitLight" style="background-color: #'.$rowB[2]. ';width: 3px; height: 3px;"></div>';
                    }
                }

            $colorBitArr2 = explode(",", substr($out, 1));
                foreach ($colorBitArr2 as $bit) {
                    if($bit == "1"){
                        $colorBits2 = $colorBits2 . '<div class="bitDark" style="width: 3px; height: 3px;"></div>';
                    }else{
                        $colorBits2 = $colorBits2 . '<div class="bitLight" style="background-color: #'.$rowB[2]. ';width: 3px; height: 3px;"></div>';
                    }
                } 
            }
        }


				
        $color = '<div class="bitsContainer" style="width: 9px;height: 18px; float:left; position: absolute; top: 11px; left: 6px;">'.$colorBits2 .'</div>'. '<div class="bitsContainer" style="width: 9px; height: 18px;float:left;position: absolute; top: 11px; left: 15px;">'.$colorBits .'</div>';
           
				echo '<a href="#project/'.$row[1].'" class="projectContainer" onclick="reviewProject('."'".$row[1]."'".')">'. $color .$projName ."</a>".
                '<div id="'.$row[1].'" class="menuButtons">'.
            //    '<a href="#" class="dropDownButton" onclick="'."buttonLoadProject('". $row[1] . "')" . '">Load Project</a>'.
                '<a href="#" class="dropDownButton" onclick="'."reviewProjectButton('".$row[1]."')" . '">Project Overview</a>'.
                '<a href="#" class="dropDownButton" onclick="'."loadUploadForm('". $row[1] . "')" . '">Audio Files</a>'.
                '<a href="#" class="dropDownButton" onclick="'."deleteProject('".$row[1]."')" . '">Delete Project</a>'.
                "</div>";
			}
		  
		}else{
            echo "<p>No projects found</p>";
		} 

    }else{
		echo "<p>You are not permitted to do this</p>";
	}

ob_end_flush();
?>