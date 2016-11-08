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
        $editClick = '<a id="editButton" onclick="LoadVersionInfo('."'". $versionID ."'".')"></a>';
        $bfirst = $editClick . '<a class="boxclose" id="boxclose" onclick="cleanDiv'."('content'," . "'" . $row[1] . "')".'"></a>';              
        $end = file_get_contents("include/editFormEnd.html");
        $middle = "";
        $sumbit = '	<input  type="submit"  onclick="updateVersion(' ."'".$versionID. "'". ')" value="Update">';
      
        //selection of files
        $filename = 'uploaded_files/'.$projectID;
        $fileSelect = "<p><b>No files uploaded!</b> click upload above to add files to this project</p>"; 

        if (file_exists($filename)) {
            if($row[5]=="no file"){
                $fileSelect = "<p><b>No files selected!</b> click here to pick track to use</p>"; 
                $clickList = '<a onclick="getFileList'."('" . $projectID . "')".'">Click</a>';    
                $filePicker = '<div id="fileSelector></div>';

                $fileSelect = $fileSelect . $filePicker . $clickList;
            }else {

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