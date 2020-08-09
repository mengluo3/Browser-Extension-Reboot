/**
 * @fileoverview JS script that loads on every tab. Renders a sticky note on the page.
 *
 */





/**FUNCTION DEFINITIONS**/
function hi(){
	//console.log("hi");
 	//iterate through localStorage. 
 	for (var i = 0; i < localStorage.length; i++){

      // console.log("iterating through localStorage");
      var key = localStorage.key(i);
      //console.log("key in localStorage: " + key);
  	}
}




 
      


/**
 * Functions for passing and receiving variables to and from the background script
 **/
//Function for getting goal from background script. After getting the goal, insert to a div with the callback function.
function getGoal(_callback){
	//get the goal from the background script. 
	var thisGoal;
    chrome.runtime.sendMessage({greeting: "getGoal"}, function(response) {
	  		thisGoal = response.farewell;//get the goal from the background script. 
	  		_callback(thisGoal);
		});	 
}

/**
 * Function for checking if the sticky note has not been exited out of (from the background script), 
 * then using that to run the content script if the function has been run.  
 **/
function checkIfOn(_callback){
    chrome.runtime.sendMessage({greeting: "checkIfOn"}, function(response) {
	  		isOn = response.farewell;
	  		_callback(isOn);
		});	
}











//_________________________________________________________________________________________________________________________________________

/***********************************************************************
*
* Function for writing to CSV file.
*
*/
function writeCSV(){
	var rows = [
			    ["name1", "city1", "some other info"],
			    ["name2", "city2", "more info"]
			];

	let csvContent = "data:text/csv;charset=utf-8,";

	rows.forEach(function(rowArray) {
	    let row = rowArray.join(","); //combine everything in the array in a single string
	    csvContent += row + "\r\n"; //add the row to the csv content
	});

	var encodedUri = encodeURI(csvContent);
	var link = document.createElement("a");
	link.setAttribute("href", encodedUri);
	link.setAttribute("download", "my_data.csv");
	document.body.append(link); // Required for FF

	link.click(); // This will download the data file named "my_data.csv".
}




/***********************************************************************
*
* Function for removing sticky note permanently after the checkbox is checked.
*
*/
function removeStickyPermanent() {
  // Removes an element from the document.
  var element = document.getElementById("sticky");
  element.style.display = "none";
  //turn off so next time the program does not add a sticky note once the goal is accomplished.
  chrome.runtime.sendMessage({greeting: "turnOff"});	
}


/***********************************************************************
*
* Function for removing sticky note temporarily when the 'x' button is clicked.
*
*/
function removeSticky() {
  // Removes an element from the document.
  var stickyNote = document.getElementById("sticky");
  stickyNote.remove();
}

/***********************************************************************
*
* Functions for making sticky note invisible when hovered over and visible when hovered over. 
* Unused.
*
*/
function onHover(){
	var element = document.getElementById("sticky");
	var children = document.getElementById("sticky").childNodes;
	//element.hide();
  	element.style.opacity = "0";
  	element.style.zIndex="-100000000000";
  	for (var i = 0; i < children.length; i++) {
    	children[i].style.opacity = "0";
    	children[i].style.zIndex="-100000000000";
  	}
  	//children.style.opacity = "0";
  	//children.style.zIndex="-100000000000";
}

function offHover(){
	setTimeout(function () {
        var element = document.getElementById("sticky");
	  	var children = document.getElementById("sticky").childNodes;
	  	element.style.opacity = "1.0";
	  	element.style.zIndex="100000000000";
	  	for (var i = 0; i < children.length; i++) {
	    	children[i].style.opacity = "1.0";
	    	children[i].style.zIndex="100000000000";
	  	}
    }, 500);
	
}

/**
 * Repositions sticky note when dragged. 
 */
function repositionStickyNote(event) {
	console.log("reportision function called");
	/*this.style.left = initX + event.clientX - mousePressX + 'px';
	this.style.top = initY + event.clientY - mousePressY + 'px';

	
	var box = document.getElementById("sticky");
	var h = box.scrollHeight;
	

	
	this.style.bottom = window.innerHeight - (initY + event.clientY - mousePressY) - 200 + 'px';//This is DISTANCE from the bottom, NOT the bottom coordinate from top
	console.log("sticky top: " + this.style.top + ", sticky bottom: " + this.style.bottom);*/
}