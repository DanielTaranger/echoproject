<?php

$errors         = array();  	// array to hold validation errors
$data 			= array(); 		// array to pass back data

// validate the variables ======================================================
	// if any of these variables don't exist, add an error to our $errors array

	if (empty($_POST['title']))
		$errors['title'] = 'Title is required.';

	if (empty($_POST['description']))
		$errors['description'] = 'Description is required.';


	if ( ! empty($errors)) {

		// if there are items in our errors array, return those errors
		$data['success'] = false;
		$data['errors']  = $errors;
	} else {
        session_start();
        require('db.php');  
            if (isset($_SESSION['username'])){
                $username = $_SESSION['username'];
                $username = stripslashes($username);

                $title = $_POST['title'];
                $title = stripslashes($title);

                $description = $_POST['description'];
                $description = stripslashes($description);

				if(isset($_POST['parent'])){
					$parent = $_POST['parent'];
               	 	$parent = stripslashes($parent);
				}else {
					$parent = 0;
				}

				$projectID = $_POST['projectID'];
                $projectID = stripslashes($projectID);

				if(isset($_POST['file'])){
					$file = $_POST['file'];
				}else {
					$file = "no file";
				}
				
				$query = "SELECT * FROM versions  WHERE projectID='$projectID'";
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
				
					
				$timestamp = date('Y-m-d h:i:s');

                $query =  "INSERT INTO versions (projectID, title, description, parent, file, timestamp, username) VALUES ('".$projectID."', '".
																										$title."', '".
																										$description."', '".
																										$parent."', '".
																										$file."', '".
																										$timestamp."', '".
																										$username."')";
                $result = mysqli_query($conn, $query) or die(mysqli_error($conn));


				//new search to make sure the added version is loaded on creation
				$query = "SELECT * FROM versions WHERE projectID='$projectID' ORDER BY timestamp ASC LIMIT 1";
				$result = mysqli_query($conn, $query) or die(mysqli_error($conn));
				$row = mysqli_fetch_array($result);
				$data['versionID'] = $row[1];
            }

		$data['success'] = true;
		$data['message'] = 'Success!';
	}

	// return all our data to an AJAX call
	echo json_encode($data);