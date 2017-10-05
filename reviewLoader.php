<?php
session_start();
	require('db.php');
    if (isset($_SESSION['username'])){
        $username = $_SESSION['username'];
		$username = stripslashes($username);

         $data = array();
         $dataOut = "";
         $reviewID = $_POST['reviewID'];
         $projectID = "";
         $projectID = $_POST['projectID'];

        /*
        SELECT * FROM terms WHERE id IN 
        (SELECT term_id FROM terms_relation WHERE taxonomy = "categ")

        */
        if($projectID == ""){
            $query = "SELECT * FROM versions  WHERE versionID IN".
            '(SELECT versionID FROM review_relations WHERE reviewID = "'.$reviewID.'")ORDER BY RAND()';

            $result = mysqli_query($conn, $query) or die(mysqli_error($conn));
            $rows = mysqli_num_rows($result);
            
            $index = 1;
            if($rows>=1){

                while($row = mysqli_fetch_array($result)) {
                
                    
                    if($row[5]=="no file"){
                        $dataOut =  $dataOut . '<div class="reviewContainer">' .'<p>Track missing</p>'.'</div>';
                    }else {
                        $index = 1;
                        $dataOut =  $dataOut . '<div class="reviewContainer">' .
                        '<h2 class="reviewContainerHeader">Anonymous track #'. $index .'</h2>'. 
                    '<audio controls class="reviewAudio">'.
                    '<source src="uploaded_files/'. $row[0] ."/".$row[5].
                    '" type="audio/mpeg">'.
                    'Your browser does not support the audio element.'.
                    '</audio>';                    
            
                        $dataOut =  $dataOut .
                        '<textarea class="reviewComment"'.'id="textarea'.  $reviewID .'" class="form-control" rows="3" name="comment" placeholder="Please type what you think of this track"></textarea>'.
                            '<div class="voteContainer">'.
                                '<p class="voteText">Did you like the track?</p>'.
                                '<img class="thumbUp"'    . 'id="thumbUp' .$row[1]. '"'.     'onclick="reviewRate('."'".$reviewID."', '". $row[1] ."', 'up'".")". '"'. ' src="img/thmbup.svg" alt="thumb" width="20px" height="20px">'.
                                '<img class="thumbDown"'  . 'id="thumbDown'.$row[1] . '"'.     'onclick="reviewRate('."'".$reviewID."', '". $row[1] ."', 'down'".")". '"'. ' src="img/thmbup.svg" alt="thumb" width="20px" height="20px">'. 
                            '</div>'.  
                            '<div class="commentSubmit">'.
                            '<input type="submit"'.'id="subCommentBtn'.  $reviewID .'" onclick="submitCommentFormAjax('."'".$row[1]."', '". $reviewID ."'".')" value="Comment">'.
                            '</div>'. '</div>';
                    
                            }
                            $index = $index + 1;
                        }
                        

                    }else{
                        echo "<p>No projects found</p>";
                    } 

                    $data['reviews'] = $dataOut;
        }else{
            $reviewDateTo = "";
            $reviewDateFrom = "";
            $reviewVersions = "";

            $query = "SELECT * FROM reviews  WHERE reviewID='$reviewID'";
            $result = mysqli_query($conn, $query) or die(mysqli_error($conn));
            $rows = mysqli_num_rows($result);
  
            if($rows>=1){
                  while($row = mysqli_fetch_array($result)) {
                    $reviewDateTo = $row[3];
                    $reviewDateFrom = $row[4];
                }
            }
            $query = "SELECT * FROM versions  WHERE versionID IN".
            '(SELECT versionID FROM review_relations WHERE reviewID = "'.$reviewID.'")';
            $result = mysqli_query($conn, $query) or die(mysqli_error($conn));
            $rows = mysqli_num_rows($result);

            if($rows>=1){
                while($row = mysqli_fetch_array($result)) {
                    $reviewVersions =  $reviewVersions . "<br>".$row[2];
                }
            }

            $dataOut = 
            '<span class="reviewEditButton" onclick="reviewPanelMenu('."'"."reviewLoad"."'".')"'.'"'.">back</span>".
            '<span class="reviewEditButton" onclick="deleteReview">delete review</span>'. 
            '<p>'.$reviewDateTo.'</p>'.
            '<p>'.$reviewDateFrom.'</p>'.
            $reviewVersions;
            $data['rightPanelReviews'] = $dataOut;
        }

        echo json_encode($data);
        }else{
            echo "<p>You are not permitted to do this</p>";
        }
    
?>