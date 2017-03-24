<!DOCTYPE html>
<html>
    <head>
        <title>Registration</title>
        <meta charset="UTF-8">
        <link rel="icon" href="img/favicon.ico">
        <link id="pagestyle" rel="stylesheet" href="css/index.css" />
        <link id="pagestyle" rel="stylesheet" href="css/switch.css" />

        <link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet">
   
        <script src="//ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min.js"></script>

        <script src="//cdnjs.cloudflare.com/ajax/libs/wavesurfer.js/1.0.52/wavesurfer.min.js"></script>
        <script src="http://ajax.aspnetcdn.com/ajax/jquery.validate/1.11.1/jquery.validate.js"></script>
        <script src="http://d3js.org/d3.v3.min.js"></script>
        <script id="darkScript" src="js/treeFunctions.js"></script>
        <script src="js/functions.js"></script>
    </head>
<body>
<?php
	require('db.php');
    // If form submitted, insert values into the database.
    if (isset($_POST['username'])){
        $username = $_POST['username'];
        $password = $_POST['password'];
		$username = stripslashes($username);
		$username = mysqli_real_escape_string($conn, $username);
		$password = stripslashes($password);
		$password = mysqli_real_escape_string($conn, $password);
		$trn_date = date("Y-m-d H:i:s");
        $query = "INSERT into `users` (username, password, trn_date) VALUES ('$username', '".md5($password)."', '$trn_date')";
        $result = mysqli_query($conn, $query) or die(mysqli_error($conn));
        if($result){
            echo '<div class="form" id="loginRegisterForm">'."<h3>You are registered successfully.</h3><br/>Click here to <a href='login.php'>Login</a></div>";
        }
    }else{
?>
<div id="loginRegisterForm">
<h1>Registration</h1>
<form name="registration" action="" method="post">
<input type="text" class="form-control" name="username" placeholder="Username" required />
<input type="password" class="form-control" name="password" placeholder="Password" required />
<input type="submit" name="submit" value="Register" />
<p>Go back to  <a href='login.php'>login</a></p>
</form>
</div>
<?php } ?>
</body>
</html>