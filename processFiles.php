<?php
$uploadProjectSelect = $_POST['uploadProjectSelect'];
$valid_formats = array("mp3");
$max_file_size = 2*1024*1000; //100 kb
$path = "uploaded_files/"; // Upload directory

if (!file_exists($path . $uploadProjectSelect)) {
    mkdir($path . $uploadProjectSelect, 0777, true);
	$path = $path . $uploadProjectSelect . "/";
}else{
	$path = $path . $uploadProjectSelect . "/";
}
$count = 0;

 

if(isset($_POST) and $_SERVER['REQUEST_METHOD'] == "POST"){
	// Loop $_FILES to exeicute all files
	foreach ($_FILES['files']['name'] as $f => $name) {     
	    if ($_FILES['files']['error'][$f] == 4) {
	        continue; // Skip file if any error found
	    }	       
	    if ($_FILES['files']['error'][$f] == 0) {	           
	        if ($_FILES['files']['size'][$f] > $max_file_size) {
	            $message[] = "$name is too large!.";
	            continue; // Skip large files
	        }
			elseif( ! in_array(pathinfo($name, PATHINFO_EXTENSION), $valid_formats) ){
				$message[] = "$name is not a valid format";
				continue; // Skip invalid file formats
			}
	        else{ // No error found! Move uploaded files 
	            if(move_uploaded_file($_FILES["files"]["tmp_name"][$f], $path.$name))
	            $count++; // Number of successfully uploaded file
				header('Location: index.php#');
				echo "<h1>Upload successful</h1>";
				}
			}
		}
	}



?>