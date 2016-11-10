<?php      

    $projectID = $_POST['projectID'];
    $filename = 'uploaded_files/'.$projectID;
    
    if (file_exists($filename)) {
        $fileListing = "";
        $fileBefore = '<p>Audio file</p><select id="fileselect" class="form-group">';
        $fileAfter = "</select>";
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
    }

    $data = array();

    $data['data'] = $fileSelect;


?>