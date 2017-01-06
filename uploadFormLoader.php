<?php	
session_start();
require('db.php');  
    if (isset($_SESSION['username'])){
        $username = $_SESSION['username'];
        $username = stripslashes($username);

        $projectID = $_POST['projectID'];

        $query="SELECT * FROM projects WHERE username='$username'";
        $result = mysqli_query($conn, $query) or die(mysqli_error($conn));
        $rows = mysqli_num_rows($result);

        $data = array();


        $uploadFormBeforeStart = '<div id="contentBox">' . '<a class="boxclose" id="boxclose" onclick="loadProject('."'".$projectID."'".')"></a>';  
        $uploadFormStart = file_get_contents("include/uploadFormStart.html");
        $uploadFormEnd = file_get_contents("include/uploadFormEnd.html");

        $before = '<div><p>Project to upload to</p><select name="uploadProjectSelect" id="myselect" class="form-group">';
        $middle = "";
        $after = "</select></div>";

        if($rows>=1){
            while($row = mysqli_fetch_array($result)) {

                if($row[1] == $projectID){
                    $middle = $middle . '<option value="'.$row[1].'" selected>'.$row[2].'</option>';
                }else {
                 $middle = $middle . '<option value="'.$row[1].'">'.$row[2].'</option>';
                }

            }  

             $fileSelect = "";
            $dirname = "uploaded_files/";
            $dirname = $dirname . $projectID;


            if (is_dir($dirname)) {

                    $fileListing = "";
                    $dir = 'uploaded_files/'.$projectID ."/";
                    $files = scandir($dir,2);

                    unset($files[0]);
                    unset($files[1]);

                    foreach ($files as $value){
                        if( is_file($dir.$value)){
                                $fileListing = $fileListing . '<a href="#" id="fileView" onclick="(' . $value . '")>' . $value . '</a>';
                        }
                    }
                    $fileSelect =  $fileListing;
        }  
             $data['data2'] = $fileSelect;
            $data['data1'] =  $uploadFormBeforeStart . $uploadFormStart . $before . $middle . $after . $uploadFormEnd;
            $data['success'] = true;

        }else{
            $data['data2'] = $fileSelect;
            $data['data1'] =  "<h3>An error occurred fetching our projects</h3>";
            $data['success'] = true;
        }   

        echo json_encode($data);
    }
    
?>