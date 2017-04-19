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
				$contentBox = file_get_contents("include/contentBox.html");
				$buttons = '<div id="versionButtons">'.'<a id="boxclose" class="versionButton" onclick="cleanDiv'."('content'," . "'" . $projectID . "')".'"></a>'."</div>";
				$formStart = file_get_contents("include/reviewForm.html");

				$formContent = '<div id="duration">erserserer</div>';

				
				$formEnd = file_get_contents("include/reviewFormEnd.html");

				$data['data'] = $contentBox .$buttons . $formStart . $formContent . $formEnd;
			}
		  
		}else{
            echo "<p>No projects found</p>";
		} 

       echo json_encode($data);

    }else{
		echo "<p>You are not permitted to do this</p>";
	} 
?>