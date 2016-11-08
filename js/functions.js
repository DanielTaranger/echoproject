$(document).ready(function() {  
  
    $('textarea[maxlength]').keyup(function(){  
        //get the limit from maxlength attribute  
        var limit = parseInt($(this).attr('maxlength'));  
        //get the current text inside the textarea  
        var text = $(this).val();  
        //count the number of characters in the text  
        var chars = text.length;  
  
        //check if there are more characters then allowed  
        if(chars > limit){  
            //and if there are use substr to get the text before the limit  
            var new_text = text.substr(0, limit);  
  
            //and change the current text with the new text  
            $(this).val(new_text);  
        }  
    });  
  
});  

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
					cleanDiv("overview");
					cleanDiv("versionContainer");
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
					document.getElementById("versionContainer").innerHTML = data.data;	
			})

			.fail(function(data) {
				console.log(data);
			});
		    event.preventDefault();
		});
}



function updateMenu(input, input2){	
		var out1 =	'<a href="#" class="menuButton" onclick="'+"loadVersionForm('"+ input +"')" + '">New</a>';
		var out3 = '<a href="#" class="menuButton" onclick="'+"loadUploadForm('"+ input + "')" + '">Upload</a>';

		var newVersion = "";

		if (input2 == null){
			newVersion = out1 + out3;
		}else {
			var out2 = '<a href="#" class="menuButton" onclick="'+"deleteVersion('"+input+"', '"+input2+"')" + '">Delete</a>';
			
			newVersion = out1 + out2 + out3;
		}

		document.getElementById("menuBar").innerHTML = newVersion;	

}


function loadProjectForm(){
        $( "#content" ).load( "include/projectForm.html");
        cleanDiv("overview");
		statusUpdate("Projectform loaded successfully!")
}

function loadUploadForm(input){
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
					
					document.getElementById("content").innerHTML = obj.data;
	
			})

			.fail(function(data) {
				console.log(data);
			});
		    event.preventDefault();

		statusUpdate("Projectform loaded successfully!");
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
cleanDiv("versionContainer");
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

function getFileList(input){ 

		var projectID = input;
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
					document.getElementById("fileSelector").innerHTML = data;	
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
        cleanDiv('overview');
		cleanDiv('versionContainer');
        $( "#content" ).load( "include/indexScreen.html");
        
}

function cleanDiv(input, input2){
			document.getElementById(input).innerHTML = "";
			if (typeof input2 !== 'undefined') {
				loadProject(input2);
			}
			
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
					statusUpdate("Project created successfully!")
					cleanDiv("content");
					getProjectInfo(data.projectID);
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
