var theme = "off";
var projectIDStore = "";
var isWorking = false;
var toggle = "on";
var toggleID = "";
var review = false;
var reviewActive = false;
var reviewArray = [];


function locationHashChanged() {
    if (location.hash.substr(0, 8) === "#project") {
       loadProject(location.hash.substr(9));
    }else if(location.hash.substr(0, 7) === "#upload"){
		 loadUploadForm(location.hash.substr(8));
		 activeProject(location.hash.substr(8));
	}else if (location.hash.substr(0, 8) === "#version"){	
		 LoadVersionInfo(location.hash.substr(9));
	}else if (location.hash.substr(0, 6) === "#index"){	
		 indexScreen();
	}else if (location.hash.substr(0, 10) === "#dashboard"){	
		 dashboard();
	}else if (location.hash.substr(0, 7) === "#review"){	
		 reviewProject(location.hash.substr(8));
		 menuCollapse(location.hash.substr(8));
	}
	loadTheme();
	fillMenu();
}

window.onload = locationHashChanged;
///window.onhashchange  = locationHashChanged;

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
						if(location.hash.substr(0, 8) === "#project" ){
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




function loadProjects() {
        $( "#container" ).load( "projectLoader.php" );
}

function loadProject(input) {
	$( document ).ready(function() {
		menuCollapse(input);
		if(isWorking == false && projectIDStore != input){
			
		window.location.hash = '#project/'+input;

		isWorking == true;
		document.getElementById("content").innerHTML = '<img src="img/ripple.svg" style="float:left;width:25px;display:inline-block;">';
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
							isWorking == false;
							console.log("stomething wrong");
							statusUpdate("no such project found");
							document.getElementById("content").innerHTML = "<h1>No projects found</h1>";

						}else {
							getProjectInfo(input);	
							cleanDiv("versionContainer");
							cleanDiv("overview");
							$('#rightPanel').removeClass('rightPanel');
							cleanDiv("rightPanel");
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
	});
}

function getLastProject() {
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
					loadProject(data.last_project);
				}

			})

			.fail(function(data) {
				console.log(data);
			});
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

function loadTreeReview(input) {
	
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
					makeTreeReview(data);
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

//methon run when clicking the load Project button on the leftpanel button menu
function buttonLoadProject(input){
	getProjectInfo(input);
	$('#rightPanel').removeClass('rightPanel');
	cleanDiv("rightPanel");
	$('reviewTitle').removeClass('displayElement');
	
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
					if(reviewActive == true){
						$('#reviewButton').addClass('visibleElement');
					}
			})

			.fail(function(data) {
				console.log(data);
			});
			
			event.preventDefault();
		});
}

function reviewProject(input){
cleanDiv('rightPanel');
reviewArray = [];
reviewActive = true;
window.location.hash = '#review/'+input;
	$(document).ready(function() {
				if($('#versionContainer').is(':empty')){
					getProjectInfo(input);
				}
				loadTreeReview(input);
				$('#rightPanel').append('<p id="reviewHeader">Get feedback</p>'+'<p id="reviewHeaderInfo">click the add button on a version to add it here</p>'+'<div id="rightPanelContainer"></div>')
				$('#reviewHeader').addClass('visibleElement');
				$('#rightPanel').addClass('rightPanel');
				$('#reviewButton').addClass('visibleElement');
				$('#rightPanel').addClass('visibleElement');	
	});
}


function reviewAddVersion(input1, input2){
	$(document).ready(function(){
		var check = isVersionStored(input2);
		if(check === true){
			var temp = document.getElementById("rightPanelContainer");
			temp.innerHTML = temp.innerHTML + '<p class="reviewVersionTitle" onclick="'+"loadVersionInfo('"+input2+"')"+'">'+input1+"</p>";
			statusUpdate("Version "+input1+" added for review!");
		}else{
			removeReviewVersion(input2);
				statusUpdate("Version "+input1+" removed");
		}

	});
}


function loadUploadForm(input){

$('#rightPanel').removeClass('rightPanel');
window.location.hash = '#upload/'+input;

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
					getLastProject();
					loadProjects();
				
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



function submitProjectFormAjax(){
$(document).ready(function() {

	$('form').submit(function(event) {
	
		var formData = {
			'title' 				: $('input[name=title]').val(),
			'description' 			: $('#description').val()
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
						menuOpen(data.projectID);
						statusUpdate("Project created successfully!" + projectIDStore);
						cleanDiv("content");
						loadProject(data.projectID);
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
										menuOpen(input);
										loadTree(input);
										LoadVersionInfo(data.versionID);
										getProjectInfo(input);
				}
			})

			.fail(function(data) {
				console.log(data);
			});
		event.preventDefault();
	});

});

}


