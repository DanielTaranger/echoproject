<?php 		
session_start();
require('db.php');  
    if (isset($_SESSION['username'])){
        $data2 = array();
        $username = $_SESSION['username'];
        $username = stripslashes($username);
        $data = array();

        $projectID = $_POST['projectID'];

        $query="SELECT * FROM versions WHERE projectID='$projectID' ORDER BY parent ASC";
        $result = mysqli_query($conn, $query) or die(mysqli_error($conn));
        $rows = mysqli_num_rows($result);
    
        if($rows>=1){
         
            while($row = mysqli_fetch_array($result)) {
                $inData = array();

                $inData['versionID'] = $row[1];
                $inData['title'] = $row[2];
                $inData['description'] = $row[3];
                $inData['parent'] = $row[4];
                $inData['projectID'] = $row[0];

                array_push($data,$inData);
            }       

                $new = array();
                foreach ($data as $a){
                    $new[$a['parent']][] = $a;
                }
    

                function createTree(&$list, $parent){
                    $tree = array();
                    foreach ($parent as $k=>$l){
                        if(isset($list[$l['versionID']])){
                            $l['children'] = createTree($list, $list[$l['versionID']]);
                        }
                        $tree[] = $l;
                    } 
                    return $tree;

                }
                       $tree = createTree($new, array($data[0]));
                $data = $tree;

               
        }else{
              $data['success'] = false;
        }
            echo json_encode($data);
    }
    
?>