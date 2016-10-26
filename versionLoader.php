<?php
session_start();
	require('db.php');

    if (isset($_SESSION['username'])){
        $username = $_SESSION['username'];
		$username = stripslashes($username);

         $data = array();
         $versionID = $_POST['versionID'];

        $query = "SELECT * FROM versions  WHERE versionID='$versionID'";
		$result = mysqli_query($conn, $query) or die(mysqli_error($conn));
		$rows = mysqli_num_rows($result);

		if($rows>=1){
	
			while($row = mysqli_fetch_array($result)) {
				$data = '<div id="contentBox">'.'<a class="boxclose" id="boxclose" onclick="cleanDiv('."'"."versionContainer"."'".')"></a>'.'<h1>'.$row[2].'</h1>'.$row[3].'</div>';

			}

		}else{
            echo "<p>No projects found</p>";
		} 

        echo json_encode($data);
    }else{
		echo "<p>You are not permitted to do this</p>";
	}

?>