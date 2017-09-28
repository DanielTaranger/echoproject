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
    

        $datefrom = new DateTime($data[0]);
        $datefrom = $datefrom->format('y-m-d');

        $dateto = new DateTime($data[1]);
        $dateto =  $dateto->format('y-m-d');

        $data = array_slice($data, 2); 

        $query =  "INSERT INTO reviews (datefrom, dateto) VALUES ('".$datefrom."', '".$dateto."')";
        $result = mysqli_query($conn, $query) or die(mysqli_error($conn));
        
        $query = "SELECT * FROM reviews ORDER BY date DESC LIMIT 1";
        $result = mysqli_query($conn, $query) or die(mysqli_error($conn));

        $row = mysqli_fetch_array($result);

        $reviewID= $row[0];


        for ($i = 0; $i < count($data); $i++) {
            $query2 =  "INSERT INTO review_relations (versionID, username, reviewID) VALUES"."('" .  $data[$i] ."', '" . $username."', '" . $reviewID . "')";
            $result = mysqli_query($conn, $query2) or die(mysqli_error($conn));
        }
             

    }

$data['success'] = true;
	
echo json_encode($data);