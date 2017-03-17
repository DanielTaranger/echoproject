<?php
session_start();
	require('db.php');
    if (isset($_SESSION['username'])){
        $username = $_SESSION['username'];
		$username = stripslashes($username);

        $projectID = $_POST['projectID'];

        $data = array();

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
                        $colorBits = $colorBits . '<div class="bitLight" style="background-color: #'.$rowB[2]. ';"></div>';
                    }
                }

            $colorBitArr2 = explode(",", substr($out, 1));
                foreach ($colorBitArr2 as $bit) {
                    if($bit == "1"){
                        $colorBits2 = $colorBits2 . '<div class="bitDark"></div>';
                    }else{
                        $colorBits2 = $colorBits2 . '<div class="bitLight" style="background-color: #'.$rowB[2]. ';"></div>';
                    }
                } 
            }
        }


				
        $data['project'] = '<div class="bitsContainer">'.$colorBits2 .'</div>'. '<div class="bitsContainer">'.$colorBits .'</div>';
                


        $query = "SELECT * FROM projects WHERE projectID='$projectID' LIMIT 1";
		$result = mysqli_query($conn, $query) or die(mysqli_error($conn));
		$rows = mysqli_num_rows($result);

		if($rows>=1){
	
			while($row = mysqli_fetch_array($result)) {
				$data['project'] = $data['project'] . '<h1 id="projectHeader">'.$row[2].'</h1>'."<p>Created ".substr($row[4], 0, 10)."</p>".'<p>'.$row[3].'</p><hr>';
				if($row[5] === 0){
					$query3 = "SELECT * FROM versions  WHERE projectID='$projectID' AND parent='0'";
					$result2 = mysqli_query($conn, $query3) or die(mysqli_error($conn));
					$rows2 = mysqli_num_rows($result2);
						if($rows2>=1){
							while($row4 = mysqli_fetch_array($result2)) {
								$data['active'] = $row4[1];
							}
						}

				}else {
					$data['active'] = $row[5];
				}

			}


		}else{
            echo "<p>No projects found</p>";
		} 

        echo json_encode($data);
    }else{
		echo "<p>You are not permitted to do this</p>";
	}

?>