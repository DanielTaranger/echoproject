var theme = "off";
var projectIDStore = "";
var isWorking = false;
var toggle = "on";
var toggleID = "";
var review = false;
var reviewActive = false;
var reviewArray = [];
var overviewScrollPos = "";
var commentsHidden = false;

$("audio").on("play", function(){
    var _this = $(this);
    $("audio").each(function(i,el){
        if(!$(el).is(_this))
            $(el).get(0).pause();
    });
});

function locationHashChanged() {
    if (location.hash.substr(0, 8) === "#project") {
       //loadProject(location.hash.substr(9));
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
						if(location.hash.substr(0, 7) == "review" ){
							console-log("am up");
							loadTree(projectIDStore);							
						}
					}
					}else{
					swapStyleSheet('css/index.css');
					document.getElementById('checkBoxTheme').removeAttribute('checked');
					theme = "off";
					if(isItEmpty("overview") == false){
						if(location.hash.substr(0, 7) == "review" ){
							console-log("am down");
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

//method responsible for the color theme of the app
function switchTheme(){
	if(document.getElementById('checkBoxTheme').checked){
	  statusUpdate("Dark mode enabled");
	  saveTheme("on");
  }else{
	  statusUpdate("Light mode enabled");
	  saveTheme("off");
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
							if(location.hash.substr(0, 8) === "#project" || location.hash.substr(0, 7) === "#review"){
							loadTree(projectIDStore);
							}
						}
					}else if (input=="off"){
						swapStyleSheet('css/index.css');
						document.getElementById('checkBoxTheme').removeAttribute('checked');
						theme = "off";
						if(isItEmpty("overview") == false){
							if(location.hash.substr(0, 8) === "#project" || location.hash.substr(0, 7) === "#review"){
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
		reviewActive = false;
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
					makeTree(data);
				}
				});
			})

			.fail(function(data) {
				console.log(data);
			});
			
			event.preventDefault();
}

function loadReview(input){ 
$(document).ready(function() {

		var reviewID = input;
        var formData = {
			'projectID' : projectIDStore,
			'reviewID' : input
		};


		$.ajax({
			type 		: 'POST',
			url 		: 'reviewLoader.php', 
			data 		: formData,
			dataType 	: 'json',
			encode 		: true
		})

			.done(function(data) {

					if(projectIDStore){
						cleanDiv("rightPanel");
						document.getElementById("rightPanel").innerHTML = data.rightPanelReviews;
					}else{
						cleanDiv("contentDash");
						document.getElementById("contentDash").innerHTML = data.reviews;
					}	

					
			})

			.fail(function(data) {
				console.log(data);
			});
			
			event.preventDefault();
	});
}

function reviewRate(reviewID, versionID, rating){ 
	$(document).ready(function() {
			console.log(versionID);

			var formData = {
				'reviewID' : reviewID,
				'versionID' : versionID,
				'rating' : rating
			};
	
	
			$.ajax({
				type 		: 'POST',
				url 		: 'processReviewRating.php', 
				data 		: formData,
				dataType 	: 'json',
				encode 		: true
			})
	
				.done(function(data) {
					if(rating == "down"){
						$('#thumbDown'+versionID).attr('src','img/thmbupA.svg');
						$('#thumbUp'+versionID).attr('src','img/thmbup.svg');						
					}else if(rating == "up"){
						$('#thumbUp'+versionID).attr('src','img/thmbupA.svg');
						$('#thumbDown'+versionID).attr('src','img/thmbup.svg');	
					}
				})
	
				.fail(function(data) {
					console.log(data);
				});
				
				event.preventDefault();
		});
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
	window.location.hash = '#project/'+input;
	reviewActive = false;
	getProjectInfo(input);
	$('#rightPanel').removeClass('rightPanel');
	cleanDiv("rightPanel");
	$('reviewTitle').removeClass('displayElement');
	$('reviewButton').removeClass('visibleElement');
	loadTree(projectIDStore);	
	setTimeout(scrollFunction(), 1);
	
}

function LoadVersionInfo(input){ 
$(document).ready(function() {
		var versionID = input;
		console.log(commentsHidden);
        var formData = {
			'versionID' : input,
			'comments'  : commentsHidden
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
if(reviewActive == !true || projectIDStore == !input){
cleanDiv('versionContainer');
cleanDiv('content');
cleanDiv('rightPanel');
reviewArray = [];
reviewActive = true;
window.location.hash = '#review/'+input;

	$(document).ready(function() {
				if($('#versionContainer').is(':empty')){
					getProjectInfo(input);
				}
				$('#rightPanel').append('<p id="reviewInsert" onclick="reviewPanelMenu('+"'reviewInsert'"+')">post review</p>');
				$('#rightPanel').append('<p id="reviewLoad" onclick="reviewPanelMenu('+"'reviewLoad'"+')">load reviews</p>');
				
				$('#reviewHeader').addClass('visibleElement');
				$('#rightPanel').addClass('rightPanel');
				$('#reviewButton').addClass('visibleElement');
				$('#rightPanel').addClass('visibleElement');	
				$( "#datepickerfrom" ).datepicker();
				$( "#datepickerto" ).datepicker();
				loadTree(projectIDStore);	

	});
	setTimeout(scrollFunction(), 1);
	}
}

function reviewPanelMenu(input){
				if(input == "reviewInsert"){
				$('#rightPanel').append('<p id="reviewHeader">Get feedback</p>'+'<p id="reviewHeaderInfo">click the add button on a version to add it here</p>'+'<div id="rightPanelContainer"></div>')
				$('#rightPanel').append('<p>Date from:</p> <input type="text" id="datepickerfrom">');
				$('#rightPanel').append('<p>Date to:</p> <input type="text" id="datepickerto">');
				$('#rightPanel').append('<input type="submit" id="submitReviewButton" onclick="submitReviewAjax()" value="Submit reivew">');
				}if(input == "reviewLoad"){
				
					$('#rightPanel').load('dashboardLoader.php');	
				}
				
}


function reviewAddVersion(input1, input2){
	$(document).ready(function(){
		var check = isVersionStored(input2);
		if(check === true){
			var temp = document.getElementById("rightPanelContainer");
			temp.innerHTML = temp.innerHTML + '<p class="reviewVersionTitle">'+input1+ '<span class="reviewAddVersion"onclick="reviewAddVersion('+"'"+input1+"', '"+input2+"'"+')">✖</span>'+"</p>";
			statusUpdate("Version "+input1+" added for review!");
		}else{
			removeReviewVersion(input1, input2);
				statusUpdate("Version "+input1+" removed");
		}

	});
}


function loadUploadForm(input){
reviewActive = false;
	$('#rightPanel').removeClass('rightPanel');
	cleanDiv("rightPanel");
	$('reviewTitle').removeClass('displayElement');
	$('reviewButton').removeClass('visibleElement');
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

function submitReviewAjax(){
$(document).ready(function() {
	
		reviewArray.unshift($('#datepickerfrom').val(), $('#datepickerto').val(), projectIDStore);
		var json_arr = JSON.stringify(reviewArray);
		console.log(json_arr);
		var formData = {
			'data' 					: json_arr
		};

		// process the form
		$.ajax({
			type 		: 'POST',
			url 		: 'processReview.php', 
			data 		: formData,
			dataType 	: 'json',
			encode 		: true
		})
			.done(function(data) {

				if ( ! data.success) {
					statusUpdate("Review posting was not successful");

				} else {
					statusUpdate("Review created successfully");
					cleanDiv("rightPanel");
					$("#rightPanel").append('<p id="reviewHeader">Review created successfully!</p>');
				}
			})

			.fail(function(data) {
				console.log(data);
			});
		event.preventDefault();
	
});
}

function submitVersionFormAjax(input){
overviewScrollPos = $('#overview').scrollLeft();
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
										overviewScrollPos = $('#overview').scrollLeft();
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
setTimeout(scrollFunction, 1);
}

function scrollFunction(){
$('#overview').animate({scrollLeft: overviewScrollPos+271}, 900);	

}



function submitCommentFormAjax(versionID,reviewID){
$(document).ready(function() {
statusUpdate("works hher 1");


		var formData = {
			'comment'				: $('#textarea'+reviewID).val(),
			'reviewID'				: reviewID,
			'versionID'				: versionID
		};

		// process the form
		$.ajax({
			type 		: 'POST',
			url 		: 'processReviewComment.php', 
			data 		: formData,
			dataType 	: 'json',
			encode 		: true
		})

			.done(function(data) {

				if ( ! data.success) {
						statusUpdate($('#textarea'+reviewID).val());
					if (data.errors.description) {
						console.log("errors");
						statusUpdate("Errors!");
					}

				} else {
						$('#textarea'+reviewID).remove();
						$('#subCommentBtn'+reviewID).remove();
						statusUpdate("Thanks for your comment!");

				}
			})

			.fail(function(data) {
				console.log(data);
			});

event.preventDefault();
});

}

