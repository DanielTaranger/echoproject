<?php

$errors         = array();  	// array to hold validation errors
$data 			= array(); 		// array to pass back data

// validate the variables ======================================================
	// if any of these variables don't exist, add an error to our $errors array

	if (empty($_POST['comment'])){
		$errors['comment'] = 'Comment is required.';

    }
	if (!empty($errors)) {

		// if there are items in our errors array, return those errors
		$data['success'] = false;
		$data['errors']  = $errors;
	} else {
        session_start();
        require('db.php');  
            if (isset($_SESSION['username'])){
                $username = $_SESSION['username'];
                $username = stripslashes($username);

                $comment = $_POST['comment'];
                $comment = stripslashes($comment);

				$versionID = $_POST['versionID'];
				$reviewID = $_POST['reviewID'];

				/*
				$query = "SELECT * FROM versions  WHERE versionID='$versionID'";
				$result = mysqli_query($conn, $query) or die(mysqli_error($conn));
				$rows = mysqli_num_rows($result);

				
				if($rows>=1){
					while($row = mysqli_fetch_array($result)) {
						$c = 2;
						if($row[2] == $title){
							$title = $title . "_" . $c;

						}else if(strtok($row[2],  '_') == $title){
							$c = substr($row[2], strpos($row[2], "_") + 2);
							$c++;
							$title = $title . "_" . $c;
						}
					}
				}

                */				
					
				$timestamp = date('Y-m-d h:i:s');

                $query =  "INSERT INTO review_comments (reviewID, versionID, username, comment, timestamp) VALUES ('".$reviewID."', '".
																										$versionID."', '".
																										$username."', '".
																										$comment."', '".
																										$timestamp."')";
                $result = mysqli_query($conn, $query) or die(mysqli_error($conn));
                $data['success'] = true;
                $data['message'] = 'Success!';
            }

	}

	// return all our data to an AJAX call
	echo json_encode($data);