<?php
		
session_start();
require('db.php');  
    if (isset($_SESSION['username'])){
        $username = $_SESSION['username'];
        $username = stripslashes($username);

        $projectID = $_POST['projectID'];
        $projectID = stripslashes($projectID);

        $query="SELECT * FROM versions WHERE projectID='$projectID'";
        $result = mysqli_query($conn, $query) or die(mysqli_error($conn));
        $rows = mysqli_num_rows($result);

        $data = array();

        //selection of versions
        $first = file_get_contents("include/versionForm.html");
        $end = file_get_contents("include/versionFormEnd.html");
        $before = '<div><p>Parent version</p><select id="myselect" class="form-group">';
        $middle = "";
        $after = "</select></div>";
        $sumbit = '	<input  type="submit"  onclick="submitVersionFormAjax(' ."'".$projectID. "'". ')" value="Create Version">';
      
        //selection of files

        $filename = 'uploaded_files/'.$projectID ;
        if (file_exists($filename)) {
            $fileListing = "";
            $fileBefore = '<div><p>Audio file</p><select id="fileselect" class="form-group">';
            $fileAfter = "</select></div>";
            $dir = 'uploaded_files/'.$projectID ."/";
            $files = scandir($dir,2);

            unset($files[0]);
            unset($files[1]);


            foreach ($files as $value){
                if( is_file($dir.$value)){
                $fileListing = $fileListing . '<option value="' . $value . '">' . $value . '</option>';
                }
            }
            $fileSelect = $fileBefore . $fileListing . $fileAfter;


            if($rows>=1){
                while($row = mysqli_fetch_array($result)) {
                    $middle = $middle . '<option value="'.$row[1].'">'.$row[2].'</option>';
                }                    
                $data['data'] =   $first . $before . $middle . $after . $fileSelect . $sumbit . $end;
                $data['success'] = true;
            }else{

                $data['data'] =  $first  . $fileSelect .  $sumbit . $end;
                $data['success'] = true;
            }   

        } else {

            $noUploadedMessage = "<p><b>No files uploaded!</b> click upload above to add files to this project</p>"; //'<a href="#" class="menuButton" onclick="'. "loadUploadForm('".  $projectID. "')".'">Click here to upload files</a>';

            if($rows>=1){
                while($row = mysqli_fetch_array($result)) {
                    $middle = $middle . '<option value="'.$row[1].'">'.$row[2].'</option>';
                }                    
                $data['data'] =   $first . $before . $middle . $after . $noUploadedMessage. $sumbit . $end;
                $data['success'] = true;
            }else{

                $data['data'] =  $first  . $noUploadedMessage .  $sumbit . $end;
                $data['success'] = true;
            }   
        }

        echo json_encode($data);
    }
    
?>