
function loadProjects() {
        $( "#container" ).load( "projectLoader.php" );
}

if ("onhashchange" in window) {

}

function locationHashChanged() {
    if (location.hash === "#index") {
        setTimeout(indexScreen, 0);
    }
    if (location.hash === "#createProject") {
        setTimeout(loadProjectForm, 0);
    }
}

window.onhashchange = locationHashChanged;

function loadProject(input) {

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

					statusUpdate("Please create a new version!");
					 loadVersionForm(projectID);

				}else {
					getProjectInfo(input);	
					updateMenu(input, null);
					cleanDiv("versionContainer");
					cleanDiv("overview");
					makeTree(data);
					statusUpdate("Project loaded successfully!");

				}
				});
			})

			.fail(function(data) {
				console.log(data);
			});
		    event.preventDefault();
    	
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
					statusUpdate("Please create a new version!");
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
					document.getElementById("content").innerHTML = data;	
			})

			.fail(function(data) {
				console.log(data);
			});
		    event.preventDefault();
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
					document.getElementById("versionContainer").innerHTML = data;	
			})

			.fail(function(data) {
				console.log(data);
			});
		    event.preventDefault();
		});
}



function updateMenu(input, input2){	
		var out1 =	'<a href="#" class="menuButton" onclick="'+"loadVersionForm('"+input+"')" + '">New</a>';

		var newVersion = "";

		if (input2 == null){
			newVersion = out1;
		}else {
			var out2 = '<a href="#" class="menuButton" onclick="'+"deleteVersion('"+input+"', '"+input2+"')" + '">Delete</a>';
			newVersion = out1 + out2;
		}

		document.getElementById("menuBar").innerHTML = newVersion;	

}


function loadProjectForm(){
        $( "#content" ).load( "include/projectForm2.html");
        cleanDiv("overview");
		statusUpdate("Projectform loaded successfully!")
}

function createNewProject(){
$(document).ready(function() {
		cleanDiv('overview');
		cleanDiv('content');
		cleanDiv('versionContainer');
		loadProjectForm();
	});
}

function loadVersionForm(input){

        var formData = {
			'projectID' : input
		};


		$.ajax({
			type 		: 'POST',
			url 		: 'versionFormLoader.php', 
			data 		: formData,
			encode 		: true
		})

			.done(function(data) {
					var obj = jQuery.parseJSON(data);
					
					document.getElementById("content").innerHTML = obj.data;
	
			})

			.fail(function(data) {
				console.log(data);
			});
		    event.preventDefault();
}

function deleteVersion(input,input2){
$(document).ready(function() {
var result = confirm("Want to delete?");
if (result) {

        var formData = {
			'projectID' : input,
			'versionID' : input2
		};
		$.ajax({
			type 		: 'POST',
			url 		: 'versionDelete.php', 
			data 		: formData,
			encode 		: true
		})

			.done(function(data) {
					loadProject(input);

				
			})

			.fail(function(data) {
				console.log(data);
			});
		    event.preventDefault();
	}
	});
}

function indexScreen(){
        
        $( "#content" ).load( "include/indexScreen.html");
        
}

function cleanDiv(input){
		document.getElementById(input).innerHTML = "";
}

function statusUpdate(input){
		$("#status").stop();
		$("#status").fadeIn(1);
		document.getElementById("status").innerHTML = input;
		$( "#status" ).delay(5000).fadeOut(2000);
}
	


function submitProjectFormAjax(){
$(document).ready(function() {

	$('form').submit(function(event) {

		$('.form-group').removeClass('has-error'); 
		$('.help-block').remove(); // remove the error text
	
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
						$('#title-group').addClass('has-error'); 
						$('#title-group').append('<div class="help-block">' + data.errors.title + '</div>'); 
					}

					if (data.errors.description) {
						$('#description-group').addClass('has-error'); 
						$('#description-group').append('<div class="help-block">' + data.errors.description + '</div>'); 
					}

				} else {
					statusUpdate("Project created successfully!")
					cleanDiv("content");
					loadProjects();
										
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
						$('#title-group').addClass('has-error'); 
						$('#title-group').append('<div class="help-block">' + data.errors.title + '</div>'); 
					}

					if (data.errors.description) {
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
