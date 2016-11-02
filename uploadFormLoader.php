<?php
		
session_start();
require('db.php');  
    if (isset($_SESSION['username'])){
        $username = $_SESSION['username'];
        $username = stripslashes($username);


        $query="SELECT * FROM projects WHERE username='$username'";
        $result = mysqli_query($conn, $query) or die(mysqli_error($conn));
        $rows = mysqli_num_rows($result);

        $data = "";

        //selection of versions
        $uploadFormStart = file_get_contents("include/uploadFormStart.html");
        $uploadFormEnd = file_get_contents("include/uploadFormEnd.html");

        $before = '<div><p>Project to upload to</p><select id="myselect" class="form-group">';
        $middle = "";
        $after = "</select></div>";

        if($rows>=1){
            while($row = mysqli_fetch_array($result)) {
                $middle = $middle . '<option value="'.$row[1].'">'.$row[2].'</option>';
            }                    
            $data =  $uploadFormStart . $before . $middle . $after . $uploadFormEnd;

        }else{

            $data =  "<h3>An error occurred fetching our projects</h3>";

        }   

        echo $data;
    }
    
?>