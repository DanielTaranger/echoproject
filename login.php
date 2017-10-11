<?php
ob_start();
session_start();
include ("include/header.html");
	require('db.php');
	
    // If form submitted, insert values into the database.
    if (isset($_POST['username'])){
        $username = $_POST['username'];
        $password = $_POST['password'];
		$username = stripslashes($username);
		$username = mysqli_real_escape_string($conn, $username);
		$password = stripslashes($password);
		$password = mysqli_real_escape_string($conn, $password);

	//Checking is user existing in the database or not
        $query = "SELECT * FROM `users` WHERE username='$username' and password='".md5($password)."'";
		$result = mysqli_query($conn, $query) or die(mysqli_error($conn));
		$rows = mysqli_num_rows($result);
		if($rows==1){
			header("Location: index.php#review/0");
			$_SESSION['username'] = $username;
			
		}else{
		
		echo '<div  id="loginRegisterForm">'."<h3>Username/password is incorrect.</h3><br/>Click here to <a href='login.php'>Login</a></div>";
		} 

    }else{
		include ("include/registrationform.html");
	}



include ("include/footer.html");
ob_end_flush();
 ?>