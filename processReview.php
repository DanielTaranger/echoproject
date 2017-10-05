<?php
$data 			= array(); 		// array to pass back data

session_start();
require('db.php');  
    if (isset($_SESSION['username'])){
        $username = $_SESSION['username'];
        $username = stripslashes($username);

        $dataencoded = $_POST['data'];
        $data = json_decode($dataencoded,true);
        $datefrom = $data[0];
        $dateto = $data[1];
        $projectID = $data[2];

        $query = "SELECT * FROM reviews WHERE projectID='$projectID'";
        $result = mysqli_query($conn, $query) or die(mysqli_error($conn));

        $row = mysqli_fetch_array($result);

        if($row[1] != $projectID){

                $datefrom = new DateTime($data[0]);
                $datefrom = $datefrom->format('y-m-d');

                $dateto = new DateTime($data[1]);
                $dateto =  $dateto->format('y-m-d');

                $data = array_slice($data, 3); 

                $query =  "INSERT INTO reviews (projectID, username, datefrom, dateto) VALUES ('".$projectID."', '".$username."', '".$datefrom."', '".$dateto."')";
                $result = mysqli_query($conn, $query) or die(mysqli_error($conn));
                
                $query = "SELECT * FROM reviews ORDER BY date DESC LIMIT 1";
                $result = mysqli_query($conn, $query) or die(mysqli_error($conn));

                $row = mysqli_fetch_array($result);

                $reviewID= $row[0];
                $rating = 0.00;


                for ($i = 0; $i < count($data); $i++) {
                    $query2 =  "INSERT INTO review_relations (username, projectID, versionID, reviewID, rating) VALUES"."('" .  $username .
                                                            "', '".  $projectID ."', '".  $data[$i] ."', '" . $reviewID ."', '" . $rating . "')";
                    $result = mysqli_query($conn, $query2) or die(mysqli_error($conn));
                }
                
                $data['success'] = true;

        }else{
            $data['success'] = false;
        }
    }


	
echo json_encode($data);