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
      
                $query =  "INSERT INTO projects (username, title, description) VALUES ('".$username."', '".$title."', '".$description."')";
                $result = mysqli_query($conn, $query) or die(mysqli_error($conn));
            }

		$data['success'] = true;
		$data['message'] = 'Success!';
	}

	// return all our data to an AJAX call
	echo json_encode($data);