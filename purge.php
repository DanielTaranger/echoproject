<?php
session_start();
	require('db.php');
    if (isset($_SESSION['username'])){
        $username = $_SESSION['username'];
		$username = stripslashes($username);

        $sql = "DELETE FROM projects WHERE username='$username'";
        mysqli_query($conn,$sql);
        $sql = "DELETE FROM versions WHERE username='$username'";
        mysqli_query($conn,$sql);
        $sql = "DELETE FROM project_icons WHERE username='$username'";
        mysqli_query($conn,$sql);
        $sql = "DELETE FROM reviews WHERE username='$username'";
        mysqli_query($conn,$sql);
        $sql = "DELETE FROM review_relations WHERE username='$username'";
        mysqli_query($conn,$sql);
        $sql = "DELETE FROM review_comments WHERE username='$username'";
        mysqli_query($conn,$sql);



        header('Location: index.php');
    }

?>