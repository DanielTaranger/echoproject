<?php
session_start();
	require('db.php');
    if (isset($_SESSION['username'])){
        $username = $_SESSION['username'];
		$username = stripslashes($username);

        $state = $_POST['state'];
        $dataOut = array();
        $dataOut['success'] = false;

        $query="SELECT * FROM user_settings WHERE username='$username'";
        $result = mysqli_query($conn, $query) or die(mysqli_error($conn));
        $rows = mysqli_num_rows($result);
    
        if($rows>=1){
                $query2 = "UPDATE user_settings SET username = '$username', theme = '$state' WHERE username='$username'";
                $result = mysqli_query($conn, $query2) or die(mysqli_error($conn));
                $dataOut['success'] = true;

        }else{
            $query =  "INSERT INTO user_settings (username, theme, last_project, pre_last_project) VALUES ('".$username."', '".$state."', '0', '0')";
            $result = mysqli_query($conn, $query) or die(mysqli_error($conn));
             $dataOut['success'] = true;

        }


        echo json_encode($dataOut);
    }else{
    
	}

?>