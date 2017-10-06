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
				//	'<a id="reviewButton" class="versionButton"  title="Add version to review" onclick="reviewAddVersion('."'". $row[2] ."',"."'".$versionID."'".')">'.
					'<img src="img/thmbupA.svg" id="reviewButton"  width="17" height="17" onclick="reviewAddVersion('."'". $row[2] ."',"."'".$versionID."'".')">'.
					'<a id="newVersionButton" class="versionButton" onclick="loadVersionForm('."'". $row[0] ."',"."'".$versionID."'".')"></a>'.
					'<a id="editButton" class="versionButton" onclick="editVersion('."'". $versionID ."'".')"></a>'.
					'<a id="deleteButton" class="versionButton" onclick="deleteVersion('."'". $row[0] ."', '" . $versionID . "'".')"><img src="img/dump.png" alt="Delete" height="15" width="15"></a>'.		
					'<a id="boxclose" class="versionButton" onclick="cleanDiv('."'"."versionContainer"."'".')"></a>'.
				'</div>'.
				'<h1 id="versionHeading">'.$row[2].'</h1><p>'.$row[3].'</p>';
				if($row[5]=="no file"){
					$data['data'] = $dataOut . '</div>';
				}else {
					$query = "SELECT * FROM review_comments  WHERE versionID='$versionID'";
					$result3 = mysqli_query($conn, $query) or die(mysqli_error($conn));
					$rows3 = mysqli_num_rows($result3);
					
					$comments = "";
					
					if($rows3>=1){
						while($row3 = mysqli_fetch_array($result3)) {
							$commentTemp = "";
							$username = $row3[3];
							$comment = $row3[4];
							$timestamp = $row3[5];

	
							$commentTemp = 
							'<div class="commentContentBox"><div class="commentMeta"><p class="commentUsername">'. $username.'</p><p class="commentTimestamp">posted: '. $timestamp."</p></div><p>". $comment . "</p></div>";
							$comments = $comments . $commentTemp;
						}

						
						$comments = '<button id="hideComments" onclick="hideComments()" >hide comments</button>'."</div>".$comments;
					}

					$query = "SELECT * FROM review_relations WHERE versionID='$versionID'";
					$result4 = mysqli_query($conn, $query) or die(mysqli_error($conn));
					$rows4 = mysqli_num_rows($result4);
					
					$rating = "";
					
					if($rows4>=1){
						while($row4 = mysqli_fetch_array($result4)) {
							$rateRatio = $row4[5]*100;
							$ratioNega = 100 - $rateRatio;
							$rating = 
							'<div id="ratingsbar" style="overflow: hidden;">'.
						//	'<img class="thumbUpf"   src="img/thmbup.svg" alt="thumb" width="15px" height="15px">'.
							'<p>rating: '.$rateRatio.'%</p>'.
						//	'<img class="thumbDownf"  src="img/thmbup.svg" alt="thumb" width="15px" height="15px">'.
							'<div style="background-color: #dd155b; height: 4px; float: left; width: '.$rateRatio.'%;"></div>'.
							'<div style="background-color: #ccc; height: 4px; float: left; width: '.$ratioNega.'%;"></div>'.
						    '</div>';
						 
							
							
						}
					}					
					

					$data['data'] = $dataOut . 
					'<audio controls>'.
					'<source src="uploaded_files/'. $row[0] ."/".$row[5].
					'" type="audio/mpeg">'.
					'Your browser does not support the audio element.'.
					'</audio>'.$rating .$comments;
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