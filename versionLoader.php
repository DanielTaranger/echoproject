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
				$timestamp = strtotime($row['6']);
				$date = date('d-m-Y', $timestamp);
				$dataOut= '<div id="contentBox">'.
				'<div id="versionButtons">'.
					'<p id="timestamp">'.'updated: '.$date.'</p>'.
					'<a id="newVersionButton" class="versionButton" onclick="loadVersionForm('."'". $row[0] ."',"."'".$versionID."'".')"></a>'.
					'<a id="editButton" class="versionButton" onclick="editVersion('."'". $versionID ."'".')"></a>'.
					'<a id="deleteButton" class="versionButton" onclick="deleteVersion('."'". $row[0] ."', '" . $versionID . "'".')"><img src="img/dump.png" alt="Delete" height="15" width="15"></a>'.		
					'<a id="boxclose" class="versionButton" onclick="cleanDiv('."'"."versionContainer"."'".')"></a>'.
				'</div>'.
				'<h1 id="versionHeading">'.$row[2].'</h1><p>'.$row[3].'</p>';
				if($row[5]=="no file"){
					$data['data'] = $dataOut . '</div>';
				}else {
					$data['data'] = $dataOut . 
					'<audio controls>'.
					'<source src="uploaded_files/'. $row[0] ."/".$row[5].
					'" type="audio/mpeg">'.
					'Your browser does not support the audio element.'.
					'</audio>'.'</div>';
				}
										 		//sets the last used version of a project 
				$query2 = "UPDATE projects SET last_version = '$versionID' WHERE projectID='$row[0]'";
				mysqli_query($conn, $query2) or die(mysqli_error($conn));
				
			}
			

		}else{
            echo "<p>No projects found</p>";
		} 

        echo json_encode($data);
    }else{
		echo "<p>You are not permitted to do this</p>";
	}

?>