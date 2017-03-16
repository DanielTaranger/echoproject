var theme = "off";
var projectIDStore = "";
var isWorking = false;

if ("onhashchange" in window) {
    
}

function locationHashChanged() {
	
    if (location.hash.substr(0, 8) === "#project") {
       loadProject(location.hash.substr(9));
    }else if(location.hash.substr(0, 7) === "#upload"){
		 loadUploadForm(location.hash.substr(8));
	}else if (location.hash.substr(0, 8) === "#version"){	
		 LoadVersionInfo(location.hash.substr(9));
	}else if (location.hash.substr(0, 6) === "#index"){	
		 indexScreen();
	}
}

window.onhashchange = locationHashChanged;

$(document).ready(function() {  
  locationHashChanged();
  loadTheme();

});  

function slideMenuLeft(){
	document.getElementById("app").style.left = "-200px";
	document.getElementById("menuSlider").setAttribute("onclick", "slideMenuRight()");

}

function slideMenuRight(){
	document.getElementById("app").style.left = "0px";
	document.getElementById("menuSlider").setAttribute("onclick", "slideMenuLeft()");

}


function switchTheme(){

  
	if(document.getElementById('checkBoxTheme').checked){
	  statusUpdate("Dark mode enabled");
	  saveTheme("on");
	 
  }else{
	  statusUpdate("Light mode enabled");
	  saveTheme("off");
  }
}

function activeProject(input){
	$(document).ready(function() {  
			unactiveProjects();
			document.querySelector('[onclick="loadProject('+"'"+input+"'"+')"]').setAttribute('id', 'active');
	});  
}

function unactiveProjects(){
		var elems = document.getElementsByClassName('projectContainer')
		for (var i = 0; i < elems.length; i++) {
					elems[i].removeAttribute("id");
		}
}

function loadTheme() {
		var data = "test";
        var formData = {
			'state' : data
		};
		$.ajax({
			type 		: 'POST',
			url 		: 'themeLoad.php', 
			data 		: formData,
			dataType 	: 'json',
			encode 		: true
		})

			.done(function(data) {
				if(data.success){
					if(data.theme=="on"){
					swapStyleSheet('css/dark.css');
					theme = "on";
					document.getElementById('checkBoxTheme').setAttribute('checked', 'checked');
					if(isItEmpty("overview") == false){
						if(location.hash.substr(0, 8) === "#project"){
							loadTree(projectIDStore);							
						}
					}
					}else{
					swapStyleSheet('css/index.css');
					document.getElementById('checkBoxTheme').removeAttribute('checked');
					theme = "off";
					if(isItEmpty("overview") == false){
						if(location.hash.substr(0, 8) === "#project"){
							loadTree(projectIDStore);							
						}
					}
					}
				}

			})

			.fail(function(data) {
				console.log(data);
			});
}


function isItEmpty(input){
	if ($("#"+input).is('empty')) {
		return true;
	} else {
		return false;
	}
}

function saveTheme(input) {
        var formData = {
			'state' : input
		};
		$.ajax({
			type 		: 'POST',
			url 		: 'themeSave.php', 
			data 		: formData,
			dataType 	: 'json',
			encode 		: true
		})

			.done(function(data) {
				if(data.success){
					if(input=="on"){
						swapStyleSheet('css/dark.css');
						document.getElementById('checkBoxTheme').setAttribute('checked', 'checked');
						theme = "on";
						if(isItEmpty("overview") == false){
							if(location.hash.substr(0, 8) === "#project"){
							loadTree(projectIDStore);
							}
						}
					}else if (input=="off"){
						swapStyleSheet('css/index.css');
						document.getElementById('checkBoxTheme').removeAttribute('checked');
						theme = "off";
						if(isItEmpty("overview") == false){
							if(location.hash.substr(0, 8) === "#project"){
							loadTree(projectIDStore);
							}
						}
					}
				}

			})

			.fail(function(data) {
				console.log(data);
			});
		   
}

function swapStyleSheet(sheet){
	document.getElementById('pagestyle').setAttribute('href', sheet);
}


function loadProjects() {
        $( "#container" ).load( "projectLoader.php" );
}

function loadProject(input) {

if(isWorking == false){
isWorking == true;
document.getElementById("content").innerHTML = '<img src="img/ripple.svg" style="float:left;width:25px;display:inline-block;">';

window.location.hash = '#project/'+input;
		projectIDStore = input;
		var projectID = input;
        var formData = {
			'projectID' : input
		};


		$.ajax({
			type 		: 'POST',
			url 		: 'versionTreeLoader.php', 
			data 		: formData,
			dataType 	: 'json',
			encode 		: true
		})

			.done(function(data) {
			$(document).ready(function() {
				
				if(data['success']==false){
					cleanDiv("overview");
					cleanDiv("versionContainer");
					cleanDiv('menuBar');
					statusUpdate("Please create a new version!");
					 loadVersionForm(projectID);
					 activeProject(input);
					 isWorking == false;

				}else {
					getProjectInfo(input);	
					updateMenu(input);
					cleanDiv("versionContainer");
					cleanDiv("overview");
					makeTree(data);
					statusUpdate("Project loaded successfully!");
					activeProject(input);
					isWorking == false;

				}
				});
			})

			.fail(function(data) {
				console.log(data);
			});
		    event.preventDefault();
	}
}

function loadTree(input) {
	
cleanDiv("overview");
		var projectID = input;
        var formData = {
			'projectID' : input
		};

		$.ajax({
			type 		: 'POST',
			url 		: 'versionTreeLoader.php', 
			data 		: formData,
			dataType 	: 'json',
			encode 		: true
		})

			.done(function(data) {
			$(document).ready(function() {
				
				if(data['success']==false){
				
				}else {
					makeTree(data);
				}
				});
			})

			.fail(function(data) {
				console.log(data);
			});
		    event.preventDefault();
    	
}

function getProjectInfo(input){ 
$(document).ready(function() {
		var projectID = input;
        var formData = {
			'projectID' : input
		};


		$.ajax({
			type 		: 'POST',
			url 		: 'projectInfoLoader.php', 
			data 		: formData,
			dataType 	: 'json',
			encode 		: true
		})

			.done(function(data) {
					cleanDiv("content");
					document.getElementById("content").innerHTML = data.project;	
					if(data.active > 0){
						LoadVersionInfo(data.active);
					}
					
			})

			.fail(function(data) {
				console.log(data);
			});
		    event.preventDefault();
	});
}

function LoadVersionInfo(input){ 
$(document).ready(function() {
		var versionID = input;
        var formData = {
			'versionID' : input
		};


		$.ajax({
			type 		: 'POST',
			url 		: 'versionLoader.php', 
			data 		: formData,
			dataType 	: 'json',
			encode 		: true
		})
		
			.done(function(data) {
				
					cleanDiv("versionContainer");
					document.getElementById("versionContainer").innerHTML = data.data;	
			})

			.fail(function(data) {
				console.log(data);
			});
		    event.preventDefault();
		});
}



function updateMenu(input){	
	//	var out1 =	'<a href="#" class="menuButton" onclick="'+"loadVersionForm('"+ input +"')" + '">New Version</a>';
		var out2 = '<a href="#" class="menuButton" onclick="'+"loadUploadForm('"+ input + "')" + '">Project Files</a>';
		var out3 = '<a href="#" class="menuButton" onclick="'+"deleteProject('"+input+"')" + '">Delete Project</a>';
			
		var	newVersion = // out1 + 
		out2 + out3;
		

		document.getElementById("menuBar").innerHTML = newVersion;	

		if(input === undefined){
			document.getElementById("menuBar").innerHTML = "";	
		}	
}


function loadProjectForm(){
		unactiveProjects();
        $( "#content" ).load( "include/projectForm.html");
        cleanDiv("overview");
		statusUpdate("Projectform loaded successfully!")
}

function loadUploadForm(input){
window.location.hash = '#upload/'+input;
updateMenu(input);
    //    $( "#content" ).load( "uploadFormLoader.php");
        cleanDiv("overview");
		cleanDiv("versionContainer");

		var formData = {
			'projectID' : input
		};


		$.ajax({
			type 		: 'POST',
			url 		: 'uploadFormLoader.php', 
			data 		: formData,
			encode 		: true
		})

			.done(function(data) {
					var obj = jQuery.parseJSON(data);
					
					document.getElementById("content").innerHTML = obj.data1;
					document.getElementById("versionContainer").innerHTML = obj.data2;
	
			})

			.fail(function(data) {
				console.log(data);
			});
		    event.preventDefault();

		statusUpdate("Projectform loaded successfully!");
}


function createNewProject(){
$(document).ready(function() {
		cleanDiv('content');
		cleanDiv('overview');
		cleanDiv('versionContainer');
		cleanDiv('menuBar');
		loadProjectForm();
	});
}

function loadVersionForm(input,input2){
cleanDiv("versionContainer");
        var formData = {
			'projectID' : input,
			'versionID' : input2
		};


		$.ajax({
			type 		: 'POST',
			url 		: 'versionFormLoader.php', 
			data 		: formData,
			encode 		: true
		})

			.done(function(data) {
					var obj = jQuery.parseJSON(data);
					
					document.getElementById("versionContainer").innerHTML = obj.data;
	
			})

			.fail(function(data) {
				console.log(data);
			});
		    event.preventDefault();
}


function editVersion(input){
$(document).ready(function() {
        var formData = {
			'versionID' : input
		};


		$.ajax({
			type 		: 'POST',
			url 		: 'loadEditVersionForm.php', 
			data 		: formData,
			encode 		: true
		})

			.done(function(data) {
					var obj = jQuery.parseJSON(data);
					document.getElementById("versionContainer").innerHTML = obj.data;
					$( "#title-group" ).children().val(obj.title);
					$( "#description-group" ).children().val(obj.description);		

					statusUpdate(obj.title);		
			})

			.fail(function(data) {
				console.log(data);
			});
		    event.preventDefault();
	});
}



function updateVersion(input){
$(document).ready(function() {

	$('form').submit(function(event) {

		$('.form-group').removeClass('has-error'); 
		$('.help-block').remove(); // remove the error text

		var formData = {
			'title' 				: $('input[name=title]').val(),
			'description' 			: $('#description').val(),
			'parent'				: $( "#myselect" ).val(),
			'file'					: $( "#fileselect" ).val(),
			'versionID'				: input
		};

		// process the form
		$.ajax({
			type 		: 'POST',
			url 		: 'versionUpdate.php', 
			data 		: formData,
			dataType 	: 'json',
			encode 		: true
		})

			.done(function(data) {

				if ( ! data.success) {

					if (data.errors.title) {
						$('.form-group').removeClass('has-error'); 
						$('.help-block').remove(); // remove the error text

						$('#title-group').addClass('has-error'); 
						$('#title-group').append('<div class="help-block">' + data.errors.title + '</div>'); 
					}

					if (data.errors.description) {
						$('.form-group').removeClass('has-error'); 
						$('.help-block').remove(); // remove the error text

						$('#description-group').addClass('has-error'); 
						$('#description-group').append('<div class="help-block">' + data.errors.description + '</div>'); 
					}

				} else {
					$('form').append('<div class="alert alert-success">' + data.message + '</div>');
                                        loadProjects();
										loadTree(data.projectID);
										LoadVersionInfo(data.versionID);
				}
			})

			.fail(function(data) {
				console.log(data);
			});
			event.preventDefault();
		});

	});
}

function getFileList(input){ 
$(document).ready(function() {
        var formData = {
			'projectID' : input
		};


		$.ajax({
			type 		: 'POST',
			url 		: 'fileListLoader.php', 
			data 		: formData,
			dataType 	: 'json',
			encode 		: true
		})

			.done(function(data) {
					document.getElementById("fileSelector").innerHTML = data.data;	
					$( "#fileAlert" ).remove();
					$( "#fileClick" ).remove();
				
			})

			.fail(function(data) {
				console.log(data);
			});
		    event.preventDefault();
	});
}


function deleteVersion(input,input2){
$(document).ready(function() {
var result = confirm("Are you sure you want to delete this version? The mp3 file attached will not be deleted");
if (result) {

        var formData = {
			'projectID' : input,
			'versionID' : input2
		};

		$.ajax({
			type 		: 'POST',
			url 		: 'versionDelete.php', 
			data 		: formData,
			dataType 	: 'json',
			encode 		: true
		})

			.done(function(data) {

				if(data.success == true){
				
				LoadVersionInfo(data.parent);
				statusUpdate(data.data);
				loadTree(input);
				}else{
					alert ("You cannot delete the root version!");
				}

				
			})

			.fail(function(data) {
				console.log(data);
			});
		    event.preventDefault();
	}
	});
}

function deleteFile(input,input2){
$(document).ready(function() {
var result = confirm("Are you sure you want to delete this file? The mp3 file attached will be deleted");
if (result) {

        var formData = {
			'projectID' : input,
			'file' : input2
		};
		
		$.ajax({
			type 		: 'POST',
			url 		: 'fileDelete.php', 
			data 		: formData,
			dataType 	: 'json',
			encode 		: true
		})

			.done(function(data) {

				if(data.success == true){
					loadUploadForm(input);
					statusUpdate("file "+input2+" deleted successfully!");
				}else{
					alert ("Something went wrong!");
				}

				
			})

			.fail(function(data) {
				console.log(data);
			});
		    event.preventDefault();
	}
	});
}
function deleteProject(input){
$(document).ready(function() {
var result = confirm("Are you sure you want to delete this project? Everything will be deleted, even the project files and audio files.");
if (result) {
        var formData = {
			'projectID' : input,
		};
		$.ajax({
			type 		: 'POST',
			url 		: 'projectDelete.php', 
			data 		: formData,
			dataType 	: 'json',
			encode 		: true
		})

			.done(function(data) {

				if(data.success == true){
					indexScreen();
					loadProjects();
					updateMenu();
				}else{
					alert ("You cannot delete this project");
				}

				
			})

			.fail(function(data) {
				console.log(data);
			});
		    event.preventDefault();
	}
	});
}

function indexScreen(){
		unactiveProjects();
        cleanDiv('overview');
		cleanDiv('versionContainer');
        $( "#content" ).load( "projectIndexLoad.php");
        
}

function cleanDiv(input, input2){
			document.getElementById(input).innerHTML = "";
			if (input2) {
				loadProject(input2);
			}
			
}

function cleanAll(){
	cleanDiv("content");
	cleanDiv("overview");
	cleanDiv("versionContainer");
}

function statusUpdate(input){
		$("#status").clearQueue();
		$("#status").stop();
		$("#status").fadeIn(1);
		document.getElementById("status").innerHTML = input;
		$( "#status" ).delay(2222).fadeOut(2000);

		
}


function submitProjectFormAjax(){
$(document).ready(function() {

	$('form').submit(function(event) {
	
		var formData = {
			'title' 				: $('input[name=title]').val(),
			'description' 			: $('#description').val(),
		};

		// process the form
		$.ajax({
			type 		: 'POST',
			url 		: 'process.php', 
			data 		: formData,
			dataType 	: 'json',
			encode 		: true
		})

			.done(function(data) {

			

				if ( ! data.success) {

					if (data.errors.title) {
						$('.form-group').removeClass('has-error'); 
						$('.help-block').remove(); // remove the error text
						
						$('#title-group').addClass('has-error'); 
						$('#title-group').append('<div class="help-block">' + data.errors.title + '</div>'); 
					}

					if (data.errors.description) {
						$('.form-group').removeClass('has-error'); 
						$('.help-block').remove(); // remove the error text

						$('#description-group').addClass('has-error'); 
						$('#description-group').append('<div class="help-block">' + data.errors.description + '</div>'); 
					}

				} else {
				
						loadProjects();
						projectIDStore = data.projectID;
						statusUpdate("Project created successfully!");
						cleanDiv("content");
						loadProject(projectIDStore);
						LoadVersionInfo(data.versionID);
						
					
				}
			})

			.fail(function(data) {
				console.log(data);
			});
		event.preventDefault();
	});

});

}


function submitVersionFormAjax(input){
$(document).ready(function() {

	$('form').submit(function(event) {

		$('.form-group').removeClass('has-error'); 
		$('.help-block').remove(); // remove the error text

		var formData = {
			'title' 				: $('input[name=title]').val(),
			'description' 			: $('#description').val(),
			'parent'				: $( "#myselect" ).val(),
			'file'					: $( "#fileselect" ).val(),
			'projectID'				: input
		};

		// process the form
		$.ajax({
			type 		: 'POST',
			url 		: 'processVersion.php', 
			data 		: formData,
			dataType 	: 'json',
			encode 		: true
		})

			.done(function(data) {

				

				if ( ! data.success) {

					if (data.errors.title) {
						$('.form-group').removeClass('has-error'); 
						$('.help-block').remove(); // remove the error text

						$('#title-group').addClass('has-error'); 
						$('#title-group').append('<div class="help-block">' + data.errors.title + '</div>'); 
					}

					if (data.errors.description) {
						$('.form-group').removeClass('has-error'); 
						$('.help-block').remove(); // remove the error text

						$('#description-group').addClass('has-error'); 
						$('#description-group').append('<div class="help-block">' + data.errors.description + '</div>'); 
					}

				} else {
					$('form').append('<div class="alert alert-success">' + data.message + '</div>');
                                        loadProjects();
										loadProject(input);
				}
			})

			.fail(function(data) {
				console.log(data);
			});
		event.preventDefault();
	});

});

}
