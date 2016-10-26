<?php
session_start();
	require('db.php');

    if (isset($_SESSION['username'])){
        $username = $_SESSION['username'];
		$username = stripslashes($username);

        $projectID = $_POST['projectID'];

        $data = array();

        $query = "SELECT * FROM projects WHERE projectID='$projectID'";
		$result = mysqli_query($conn, $query) or die(mysqli_error($conn));
		$rows = mysqli_num_rows($result);

		if($rows>=1){
	
			while($row = mysqli_fetch_array($result)) {
				$data = '<h1>'.$row[2].'</h1 id="projectH1">'.'<hr><p>'.$row[3].
                '<div id="waveform"></div>'.
                '</p>';
			}

		}else{
            echo "<p>No projects found</p>";
		} 

        echo json_encode($data);
    }else{
		echo "<p>You are not permitted to do this</p>";
	}

?>