$(function () {
    $('.projectContainer').click(function() {
        $(this).children('#menuButton').slideToggle(function() {
            $(this).toggleClass('in out');
        });
        
        $(this).siblings().find('#menuButtons').slideUp(function() {
            $(this).removeClass('in').addClass('out');
        });
    });
});


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

function dashboard(){
	$(document).ready(function() {
		$( "#contentDash" ).load( "dashboardLoader.php");	
	});
}

function indexScreen(){
		unactiveProjects();
        cleanDiv('overview');
		cleanDiv('versionContainer');
		getLastProject();
}

function cleanDiv(input, input2){
			document.getElementById(input).innerHTML = "";
			if (input2) {
				loadProject(input2);
			}
			
}


function createNewProject(){
$(document).ready(function() {
		cleanDiv('content');
		cleanDiv('overview');
		cleanDiv('versionContainer');
		loadProjectForm();
		buttonClean();
		
	});
}

function loadProjectForm(){
		unactiveProjects();
        $( "#content" ).load( "include/projectForm.html");
        cleanDiv("overview");
		statusUpdate("Projectform loaded successfully!")
}

//fills the menubar for first time login
function fillMenu(){
	
		var menuButton0 = '<a href="purge.php" class="menuButton"'+ '>purge projects'+'</a>';
		var menuButton1 = '<a href="dashboard.php" class="menuButton"'+ '>Dashboard'+'</a>';
		var menuButton2 = '<a href="index.php" class="menuButton"'+ '>echo'+'<span id="NB">BETA</span>'+ '</a>';
		var menuButton3 = '<a href="profile" class="menuButton"' + '>My Profile</a>';

		var	output = menuButton0 + menuButton1 + menuButton2 + menuButton3;
		document.getElementById("menuBarDashboard").innerHTML = output;		
}

function swapStyleSheet(sheet){
	document.getElementById('pagestyle').setAttribute('href', sheet);
}

function isItEmpty(input){
	if ($("#"+input).is('empty')) {
		return true;
	} else {
		return false;
	}
}

function menuOpen(input){
	$(document).ready(function() {
			$('#'+input).attr("class", "buttonVisible");
			toggle = "off";
	});
}

function buttonClean(){
	var elems = document.getElementsByClassName('buttonVisible')
	for (var i = 0; i < elems.length; i++) {
		
				elems[i].setAttribute("class","menuButtons");
	}
}

function unactiveProjects(){
		var elems = document.getElementsByClassName('projectContainer')
		for (var i = 0; i < elems.length; i++) {
					elems[i].removeAttribute("id");
		}

}


function activeProject(input){
	$(document).ready(function() {  
			unactiveProjects();

			var query = document.querySelector('[onclick="loadProject('+"'"+input+"'"+')"]');
			if(query != null){
				query.setAttribute('id', 'active');
				menuOpen(input);
			}else{
				console.log("no project found");
			}
	});  
}

function menuCollapse(input){
	if (toggleID == input) {
			if(toggle == "on"){
				menuOpen(input);
			}else{
				buttonClean();
				toggle = "on";
			}
	}else if (toggleID !== input){
	    toggleID = input;
				buttonClean();
				menuOpen(input);

	}else if (toggleID == ""){
	    toggleID = input;
				menuOpen(input);
	}
}

function slideMenuLeft(){
	document.getElementById("app").style.left = "-200px";
	document.getElementById("menuSlider").setAttribute("onclick", "slideMenuRight()");
}

function slideMenuRight(){
	document.getElementById("app").style.left = "0px";
	document.getElementById("menuSlider").setAttribute("onclick", "slideMenuLeft()");
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

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    ev.target.appendChild(document.getElementById(data));
}

function isVersionStored(input){
	var len = reviewArray.length;
	var counter =0;
	var check = false;

	do{
		if(reviewArray[counter]==input){
			reviewArray.splice(counter,1);
			check = false;
			break;
		}else{
			check = true;
		}
		counter++;
	}
	while(counter < len);
	if(check){
		reviewArray.push(input);
	}

	return check;
}

function removeReviewVersion(input1,input2){
	$(document).ready(function() {  
			var query = document.querySelector('[onclick="reviewAddVersion('+"'"+input1+"', '"+input2+"'"+ ')"]');
			if(query != null){
				$(query).parent().remove();
			}else{
				console.log("no projectLK found");
				console.log(query);

			}
	});  
}

function hideComments(){
	if(commentsHidden == false){
		$('.commentContentBox').addClass('hiddenElement');
	    $('.commentContentBox').removeClass('visibleElement');
		commentsHidden 	= true;
	    $('#hideComments').html('show comments');
		console.log(commentsHidden);
	}else{
		commentsHidden 	= false;
		$('.commentContentBox').addClass('visibleElement');	
	    $('.commentContentBox').removeClass('hiddenElement');
	    $('#hideComments').html('hide comments');
		console.log(commentsHidden);
	}
}