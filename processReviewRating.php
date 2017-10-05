<?php


		// if there are items in our errors array, return those errors
		$data['success'] = false;

        session_start();
        require('db.php');  
            if (isset($_SESSION['username'])){
                $username = $_SESSION['username'];
                $username = stripslashes($username);

				$versionID = $_POST['versionID'];
                $reviewID = $_POST['reviewID'];
                $rating = 0;

                if($_POST['rating'] == "up"){
                    $rating = 1;
                }else{
                    $rating = 0;
                }

                $query = 'SELECT * FROM review_ratings WHERE versionID="'.$versionID.'" AND username="'.$username.'" ';
                $result = mysqli_query($conn, $query) or die(mysqli_error($conn));
                $row = mysqli_fetch_array($result);

                if($row>=1){

                    $query = "UPDATE review_ratings SET rating = '$rating' WHERE versionID='$versionID'AND username='$username'";
                     $result = mysqli_query($conn, $query) or die(mysqli_error($conn));

                }else{
                    $timestamp = date('Y-m-d h:i:s');

                    $query =  "INSERT INTO review_ratings (reviewID, versionID, username, rating, timestamp) VALUES ('".$reviewID."', '".
                                                                                                            $versionID."', '".
                                                                                                            $username."', '".
                                                                                                            $rating."', '".
                                                                                                            $timestamp."')";
                    $result = mysqli_query($conn, $query) or die(mysqli_error($conn));
     

                }
                
                $query = 'SELECT * FROM review_ratings WHERE versionID="'.$versionID.'"';
                $result = mysqli_query($conn, $query) or die(mysqli_error($conn));
                $rows = mysqli_num_rows($result);
                $amount = 0;
                $rateTot = 0;
                 if($rows>=1){
                     while($row = mysqli_fetch_array($result)) {
                        if($row[3] == -1){
                            $rateTot = $rateTot-1;
                        }else if($row[3] == 1){
                            $rateTot = $rateTot+1;
                        }else{  
                        }
                     }
                } 
                
                $average = $rateTot  / $rows;
             

                $query =  'UPDATE review_relations SET rating="'.$average  .'"'.' WHERE versionID="'.$versionID.'"';
                $result = mysqli_query($conn, $query) or die(mysqli_error($conn));

            }

    $data['success'] = true;
    $data['message'] = 'Success!';
	// return all our data to an AJAX call
    echo json_encode($data);
    

    ?>