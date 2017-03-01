<?php
		
session_start();
require('db.php');  
    if (isset($_SESSION['username'])){
        $username = $_SESSION['username'];
        $username = stripslashes($username);

        $projectID = $_POST['projectID'];
        $versionID = $_POST['versionID'];


        $query="SELECT * FROM versions WHERE projectID='$projectID'";
        $result = mysqli_query($conn, $query) or die(mysqli_error($conn));
        $rows = mysqli_num_rows($result);

        $data = array();

        $beforefirst = file_get_contents("include/contentBox.html");
        $first = file_get_contents("include/versionForm.html");

        $bfirst = '<div id="versionButtons">'.'<a id="boxclose" class="versionButton" onclick="cleanDiv'."('content'," . "'" . $projectID . "')".'"></a>'."</div>";

        $end = file_get_contents("include/versionFormEnd.html");
        $before = '<div><p>Parent version</p><select id="myselect" class="form-group">';
        $middle = "";
        $after = "</select></div>";
        $sumbit = '	<input  type="submit"  onclick="submitVersionFormAjax(' ."'".$projectID. "'". ')" value="Create">';
      
        //selection of files

        $filename = 'uploaded_files/'.$projectID;
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
                    if($row[1] == $versionID){
                        $middle = $middle . '<option value="'.$row[1].'" selected="selected">'.$row[2].'</option>';
                    }else{
                        $middle = $middle . '<option value="'.$row[1].'">'.$row[2].'</option>';
                    }
                }                    
                $data['data'] =   $beforefirst . $bfirst . $first  . $before . $middle . $after . $fileSelect . $sumbit . $end;
                $data['success'] = true;
            }else{

                $data['data'] =  $beforefirst . $bfirst . $first . $fileSelect .  $sumbit . $end;
                $data['success'] = true;
            }   

        } else {

            $noUploadedMessage = "<p><b>No files uploaded!</b> click File Manager to add files to this project</p>"; 

            if($rows>=1){
                while($row = mysqli_fetch_array($result)) {
                    if($row[1] == $versionID){
                        $middle = $middle . '<option value="'.$row[1].'" selected="selected">'.$row[2].'</option>';
                    }else{
                        $middle = $middle . '<option value="'.$row[1].'">'.$row[2].'</option>';
                    }
                }
                $data['data'] =   $beforefirst . $bfirst . $first . $before . $middle . $after . $noUploadedMessage. $sumbit . $end;
                $data['success'] = true;
            }else{
                $data['data'] =  $beforefirst . $bfirst . $first . $noUploadedMessage .  $sumbit . $end;
                $data['success'] = true;
            }   
        }

        echo json_encode($data);
    }
    
?>