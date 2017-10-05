<?php
session_start();
	require('db.php');
	
    // If form submitted, insert values into the database.
    if (isset($_SESSION['username'])){
        $username = $_SESSION['username'];
		$username = stripslashes($username);
        $data = "<h2>Active project reviews</h2>";

        $query = "SELECT * FROM reviews WHERE dateto >= curdate()";
		$result = mysqli_query($conn, $query) or die(mysqli_error($conn));
		$rows = mysqli_num_rows($result);

		if($rows>=1){
           
			while($row = mysqli_fetch_array($result)) {
                            $reviewID = $row[0];
                            $query = "SELECT * FROM review_relations WHERE reviewID='$row[0]'";
                            $resultB = mysqli_query($conn, $query) or die(mysqli_error($conn));
                            $rowsB = mysqli_num_rows($resultB);

                            $projectID = "";

                            if($rowsB>=1){

                                while($rowB = mysqli_fetch_array($resultB)) {
                                $projectID = $rowB[2];
                                }
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
                                            $colorBits = $colorBits . '<div class="bitDark" style="width:10px; height:10px;"></div>';
                                        }else{
                                            $colorBits = $colorBits . '<div class="bitLight" style="background-color: #'.$rowB[2]. ';width:10px; height:10px;"></div>';
                                        }
                                    }

                                $colorBitArr2 = explode(",", substr($out, 1));
                                    foreach ($colorBitArr2 as $bit) {
                                        if($bit == "1"){
                                            $colorBits2 = $colorBits2 . '<div class="bitDark" style="width:10px; height:10px;"></div>';
                                        }else{
                                            $colorBits2 = $colorBits2 . '<div class="bitLight" style="background-color: #'.$rowB[2]. ';width:10px; height:10px;"></div>';
                                        }
                                    } 
                                }
                            }


                                    
                            $color = '<div class="bitsContainer" style="width: 30px;height: 60px; float:left; position: absolute; top: 50px; left: 56px;">'.$colorBits2 .'</div>'. '<div class="bitsContainer" style="width: 30px; height: 60px;float:left;position: absolute; top: 50px; left: 86px;">'.$colorBits .'</div>';
           



                    $data = $data . '<div id="reviewBox" onclick="loadReview('."'".$reviewID."'".')">'.'<span>'.$username.$color.'</span>'.'</div>';
                }
            }
            echo $data;
        }
?>