<?php
session_start();
ob_start();
	require('db.php');
	
    // If form submitted, insert values into the database.
    if (isset($_SESSION['username'])){
        $username = $_SESSION['username'];
		$username = stripslashes($username);

        $projectID = $_POST['projectID'];
        $data = array();
		

	//Checking is user existing in the database or not
        $query = "SELECT * FROM projects WHERE projectID='$projectID'";
		$result = mysqli_query($conn, $query) or die(mysqli_error($conn));
		$rows = mysqli_num_rows($result);
		if($rows>=1){
	
			while($row = mysqli_fetch_array($result)) {
				$beforefirst = file_get_contents("include/contentBox.html");
				$first = file_get_contents("include/reviewForm.html");

				$middle = '<div id="duration">';


				$end = file_get_contents("include/reviewFormEnd.html");

				$data['data'] = $beforefirst . $middle . $first . $end;
			}
		  
		}else{
            echo "<p>No projects found</p>";
		} 

       echo json_encode($data);

    }else{
		echo "<p>You are not permitted to do this</p>";
	} 
?>