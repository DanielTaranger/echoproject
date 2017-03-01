<?php
session_start();
	require('db.php');
    if (isset($_SESSION['username'])){
        $username = $_SESSION['username'];
		$username = stripslashes($username);

        $projectID = $_POST['projectID'];

        $data = array();

        $query = "SELECT * FROM projects WHERE projectID='$projectID' LIMIT 1";
		$result = mysqli_query($conn, $query) or die(mysqli_error($conn));
		$rows = mysqli_num_rows($result);

		if($rows>=1){
	
			while($row = mysqli_fetch_array($result)) {
				$data['project'] = '<h1>'.$row[2].'</h1>'."<p>Created ".substr($row[4], 0, 10)."</p>".'<hr><p>'.$row[3].'</p>';
				if($row[5] === 0){
					$query3 = "SELECT * FROM versions  WHERE projectID='$projectID' AND parent='0'";
					$result2 = mysqli_query($conn, $query3) or die(mysqli_error($conn));
					$rows2 = mysqli_num_rows($result2);
						if($rows2>=1){
							while($row4 = mysqli_fetch_array($result2)) {
								$data['active'] = $row4[1];
							}
						}

				}else {
					$data['active'] = $row[5];
				}

			}

		}else{
            echo "<p>No projects found</p>";
		} 

        echo json_encode($data);
    }else{
		echo "<p>You are not permitted to do this</p>";
	}

?>