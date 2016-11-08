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
				$data['data'] = '<div id="contentBox">'.
				'<a id="editButton" onclick="editVersion('."'". $versionID ."'".')"></a>'.
				'<a class="boxclose" id="boxclose" onclick="cleanDiv('."'"."versionContainer"."'".')"></a>'.
				'<h1 id="versionHeading">'.$row[2].'</h1><p>'.$row[3].'</p>';
				if(!isset($row5)){
					$data['data'] = $data['data'] . '</div>';
				}else {
					$data['data'] = $data . 
					'<audio controls>'.
					'<source src="uploaded_files/'. $row[0] ."/".$row[5].
					'" type="audio/mpeg">'.
					'Your browser does not support the audio element.'.
					'</audio>'.'</div>';
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