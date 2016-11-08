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
      
                $query =  "INSERT INTO versions (projectID, title, description, parent, file) VALUES ('".$projectID."', '".
																										$title."', '".
																										$description."', '".
																										$parent."', '".
																										$file."')";
                $result = mysqli_query($conn, $query) or die(mysqli_error($conn));
            }

		$data['success'] = true;
		$data['message'] = 'Success!';
	}

	// return all our data to an AJAX call
	echo json_encode($data);