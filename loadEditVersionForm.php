<?php
		
session_start();
require('db.php');  
    if (isset($_SESSION['username'])){
        $username = $_SESSION['username'];
        $username = stripslashes($username);

        $versionID = $_POST['versionID'];

        $query="SELECT * FROM versions WHERE versionID='$versionID'";
        $result = mysqli_query($conn, $query) or die(mysqli_error($conn));
        $rows = mysqli_num_rows($result);

        $before = '<div><p>Parent version</p><select id="myselect" class="form-group">';
        $after = "</select></div>";

        $projectID = "";         
        $titleData = "";
        $descriptionData = "";   
        $fileData = "";

        if($rows>=1){
            while($row = mysqli_fetch_array($result)) {
                $projectID = $row[0];         
                $titleData = $row[2];
                $descriptionData = $row[3];   
                $fileData = $row[5];
            }  
        }else {

        }

        $data = array();

        $beforefirst = file_get_contents("include/contentBox.html");
        $first = file_get_contents("include/editForm.html");
        $editClick = '<div id="versionButtons">'.'<a id="editButton"  class="versionButton" onclick="LoadVersionInfo('."'". $versionID ."'".')"></a>' . '<a id="deleteButton"  class="versionButton" onclick="deleteVersion('."'". $projectID ."', '" . $versionID . "'".')"><img src="img/dump.png" alt="Delete" height="15" width="15"></a>';		
;
        $bfirst = $editClick . '<a id="boxclose"  class="versionButton" onclick="cleanDiv'."('" ."versionContainer" . "')".'"></a></div>';              
        $end = file_get_contents("include/editFormEnd.html");
        $middle = "";
        $sumbit = '	<input  type="submit"  onclick="updateVersion(' ."'".$versionID. "'". ')" value="Update">' . '	<input  type="submit"  onclick="LoadVersionInfo(' ."'".$versionID. "'". ')" value="Cancel">';
      
        //selection of files
        $filename = 'uploaded_files/'.$projectID;
        $fileSelect = "<p><b>No audio files on this project!</b> click Audio Files menu  to add files</p>"; 

        if (is_dir($filename)) {
            if($fileData=="no file"){
                 $clickList ="";
            //    $clickList = '<input type="submit" onclick="getFileList'."('" . $projectID . "', '". $versionID ."')".'" value="Add File">';    
                $fileSelect = '<p id="fileAlert"><b>No audio files attached!</b> click ' .'<a href="#"'.' onclick="getFileList'."('" . $projectID . "', '". $versionID ."')".'"'.">here</a>". ' to pick a audio file to use </p>'; 
                $filePicker = '<div id="fileSelector"></div>';


                $fileSelect =  $clickList .$fileSelect . $filePicker ;
            }else {

                $fileListing = "";
                $fileBefore = '<p>Audio file</p><select id="fileselect" class="form-group">';
                $fileAfter = "</select>";
                $dir = 'uploaded_files/'.$projectID ."/";
                $files = scandir($dir,2);

                unset($files[0]);
                unset($files[1]);

                foreach ($files as $value){
                    if( is_file($dir.$value)){
                        if($fileData == $value){
                             $fileListing = $fileListing . '<option value="' . $value . '" selected>' . $value . '</option>';
                        }else{
                            $fileListing = $fileListing . '<option value="' . $value . '" >' . $value . '</option>';
                        }
                    }
                }
                $fileSelect = $fileBefore . $fileListing . $fileAfter;
            
/*
                $fileSelect = '<p id="fileAlert">click here to change file</p>'; 
                $clickList = '<a id="fileClick" onclick="getFileList'."('" . $projectID . "')".'">Click</a>';    
                $filePicker = '<div id="fileSelector"></div>';

                $fileSelect = $fileSelect  . $clickList. $filePicker;
*/
            }
        }  


        if($rows>1){
                while($row = mysqli_fetch_array($result)) {
                    $middle = $middle . '<option value="'.$row[1].'">'.$row[2].'</option>';
                }                    
                $data['data'] =   $beforefirst . $bfirst . $first  . $before . $middle . $after . $fileSelect . $sumbit . $end;
                $data['success'] = true;
            }else{

                $data['data'] =  $beforefirst . $bfirst . $first . $fileSelect .  $sumbit . $end;
                $data['success'] = true;
        }   

        $data['title'] = $titleData;
        $data['description'] = $descriptionData;

        echo json_encode($data);
    }
    
?>