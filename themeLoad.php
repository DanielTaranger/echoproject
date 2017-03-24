<?php
session_start();
	require('db.php');
    if (isset($_SESSION['username'])){
        $username = $_SESSION['username'];
		$username = stripslashes($username);

        $dataOut = array();
        $dataOut['theme'] = "off";

        $query="SELECT * FROM user_settings WHERE username='$username'";
        $result = mysqli_query($conn, $query) or die(mysqli_error($conn));
        $rows = mysqli_num_rows($result);
    
        if($rows>=1){
           while($row = mysqli_fetch_array($result)) {
               $dataOut['theme'] = $row[2];
               $dataOut['success'] = true;
               $dataOut['last_project'] = $row[3];
		    }
        }else{
            $dataOut['success'] = false;
        }


        echo json_encode($dataOut);
    }else{
        echo "not allowed to do that";
	}

?>