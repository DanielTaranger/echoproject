<?php
session_start();
	require('db.php');
    if (isset($_SESSION['username'])){
        $username = $_SESSION['username'];
		$username = stripslashes($username);

         $data = array();
         $dataOut = "";
         $reviewID = $_POST['reviewID'];

        /*
        SELECT * FROM terms WHERE id IN 
        (SELECT term_id FROM terms_relation WHERE taxonomy = "categ")

        */

        $query = "SELECT * FROM versions  WHERE versionID IN".
       '(SELECT versionID FROM review_relations WHERE reviewID = "'.$reviewID.'")';

		$result = mysqli_query($conn, $query) or die(mysqli_error($conn));
		$rows = mysqli_num_rows($result);
		

		if($rows>=1){

			while($row = mysqli_fetch_array($result)) {
                
				if($row[5]=="no file"){
                     $dataOut =  $dataOut . '<div class="reviewContainer">' .'<p>Track missing</p>'.'</div>';
				}else {
					 $dataOut =  $dataOut . '<div class="reviewContainer">' . 
                        '<div class="voteContainer">'.
                            '<p class="voteText">Did you like the track?</p>'.
                            '<img class="thumbUp" src="img/thmbup.svg" alt="thumb" width="20px" height="20px">'.
                            '<img class="thumbDown" src="img/thmbup.svg" alt="thumb" width="20px" height="20px">'. 
                        '</div>'. 
                    '<audio controls>'.
					'<source src="uploaded_files/'. $row[0] ."/".$row[5].
					'" type="audio/mpeg">'.
					'Your browser does not support the audio element.'.
					'</audio>'.      
                    '</div>';
				}

			}
			

		}else{
            echo "<p>No projects found</p>";
		} 

         $data['reviews'] = $dataOut;
        echo json_encode($data);
        }else{
            echo "<p>You are not permitted to do this</p>";
        }
    
?>