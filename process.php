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

				$last_version = 0;
      
                $query =  "INSERT INTO projects (username, title, description, last_version) VALUES ('".$username."', '".$title."', '".$description."', '".$last_version."')";
                $result = mysqli_query($conn, $query) or die(mysqli_error($conn));

				$query = "SELECT * FROM projects  WHERE title='$title'";
				$result = mysqli_query($conn, $query) or die(mysqli_error($conn));
				$rows = mysqli_num_rows($result);

				$projectID;


				if($rows>=1){
					while($row = mysqli_fetch_array($result)) {
							$projectID = $row[1];
							$data['projectID'] = $row[1];
						}
					
				}
				

				$query =  "INSERT INTO versions (projectID, title, description, parent, file) VALUES ('".$projectID.
				"', 'Ver 1', 'Default version text, please edit to your liking using the pencil icon in the top right', '0', 'no file')";
                $result = mysqli_query($conn, $query) or die(mysqli_error($conn));

            }

		$data['success'] = true;
		$data['message'] = 'Success!';
	}

	// return all our data to an AJAX call
	echo json_encode($data);