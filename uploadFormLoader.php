<?php	
session_start();
require('db.php');  
    if (isset($_SESSION['username'])){
        $username = $_SESSION['username'];
        $username = stripslashes($username);

        $projectID = $_POST['projectID'];
        $projectName = "";

        $query="SELECT * FROM projects WHERE username='$username'";
        $result = mysqli_query($conn, $query) or die(mysqli_error($conn));
        $rows = mysqli_num_rows($result);

        $data = array();


        $uploadFormBeforeStart = '<div id="contentBox">' .'<div id="versionButtons">'. '<a class="versionButton" id="boxclose" onclick="loadProject('."'".$projectID."'".')"></a></div>';  
        $uploadFormStart = file_get_contents("include/uploadFormStart.html");
        $uploadFormEnd = file_get_contents("include/uploadFormEnd.html");

        $before = '<div><p>Project to upload to</p><select name="uploadProjectSelect" id="myselect" class="form-group">';
        $middle = "";
        $after = "</select></div>";

        if($rows>=1){
            while($row = mysqli_fetch_array($result)) {
                $projectName = $row[2];
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
                                $fileListing = $fileListing .'<div class="fileListPlayerContainer">' .'<p class="fileInfo">'.'file: '.$value.'</p>'.'<audio controls class="fileListPlayer"><source src="'.$dir.$value. '" type="audio/mpeg">Your browser does not support the audio element.</audio>'.'<a href="#" id="fileView" onclick="deleteFile('."'".$projectID."','".$value."'".')">' . 'Delete' . '</a>'. '</div>';

                        }
                    }
                    if (is_dir_empty($dir)) {
                    $fileSelect =  $fileListing;
                    }else{
                    $fileSelect =  '<h1>'.$projectName.' project files</h1>'. $fileListing;
                    }
               
        }  
            $data['data2'] = $fileSelect;
            $data['data1'] =  $uploadFormBeforeStart . $uploadFormStart . $before . $middle . $after . $uploadFormEnd;
            $data['success'] = true;

        }else{
            $data['data2'] = $fileSelect;
            $data['data1'] =  "<h3>An error occurred fetching your projects</h3>";
            $data['success'] = true;
        }   

        echo json_encode($data);
    }
    
    function is_dir_empty($dir) {
        if (!is_readable($dir)) return NULL; 
        $handle = opendir($dir);
        while (false !== ($entry = readdir($handle))) {
            if ($entry != "." && $entry != "..") {
            return FALSE;
            }
        }
        return TRUE;
        }
?>