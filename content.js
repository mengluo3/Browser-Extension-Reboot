/**
 * @fileoverview JS script that loads on every tab. Renders a sticky note on the page.
 *
 */




/**VARIABLES**/
//var goal;
var isOn;
var winID;

//for dragging
var initX, initY, mousePressX, mousePressY, boxWidth = 250, boxHeight = 100;

//for storing goals 
var primaryGoals={};//goals are stored with key-value pairs. 
var count=0;//number of primary goals. 



/**FUNCTION CALLS**/

//now that the functions have been defined, we're going to call upon them
resetCSS();
addStickyNote();



/**FUNCTION DEFINITIONS**/

/**
 * Reset all CSS.
 **/
function resetCSS(){
	document.body.style.margin="0px!important";
	document.body.style.padding="0px!important";
	document.body.style.fontFamily="Roboto, Calibri!important";
	document.body.style.fontSize="12pt!important";
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




/**
 * Function for dynamically adding the sticky note.
 */
function addStickyNote(){ 
	
	//1. Check if the extension is on or not
	//checkIfOn(function(){
		//2. If on, get the goal, and add the divs.
		//if(isOn){
			//getGoal(function(goal){

			
			//Create a new div element that is a white rectangle. This is the background of the sticky note.
		  	var box = document.createElement("div");
			  	box.id="sticky";
				box.style.width = boxWidth + "px";
				box.style.minHeight = boxHeight + "px !important";
				box.style.maxHeight = "600px";
				box.style.background = "white";
				box.style.borderRadius = "15px";
				box.style.boxShadow = "1px 1px 2px 2px #D0D0D0";
				box.style.color = "black";
				box.style.position = "fixed";
				box.style.right = "0";
				box.style.bottom = "0";
				box.style.margin = "1%";
				box.style.zIndex="1000000000";
				box.style.display = "block";
				box.style.fontFamily = "Roboto, Calibri!important";
				box.style.fontSize = "10pt";
				box.style.textAlign = "left";
				box.style.borderColor  = "#D0D0D0 !important";
				box.style.borderStyle  = "solid !important";
				box.style.borderWidth  = "1px !important";

				//add new element to the clear background
				document.body.append(box);

				//BELOW two lines: unused code for making the sticky note disappear upon hover.
				//document.getElementById('sticky').addEventListener('mouseover', onHover);
				//document.getElementById('sticky').addEventListener('mouseleave', offHover);

				//add event listener to the sticky note.	
				box.addEventListener('mousedown', function(event) {

					initX = this.offsetLeft;
					initY = this.offsetTop;
					mousePressX = event.clientX;
					mousePressY = event.clientY;

					this.addEventListener('mousemove', repositionStickyNote, false);

					window.addEventListener('mouseup', function() {
					  box.removeEventListener('mousemove', repositionStickyNote, false);
					}, false);

				}, false);
	
			
			//Create a new button element. This is the '-' minimize button on the sticky note.
			var min = document.createElement('button');
				min.innerHTML ="—";

				min.style.fontFamily="Roboto, Calibri";
				min.style.textAlign = "center"; 
				min.style.padding = "1%"; 
				min.style.textDecoration = "none";
				min.id="min";
				//circ.style.width = "20px";
				//circ.style.height = "20px";
			 	min.style.borderRadius = "50%";
			 	min.style.borderWidth = "0px";
				min.style.color = "gray";
				min.style.background = "white";
				min.style.position = "absolute";
				min.style.right = "15%";
			    min.style.top = "20px";
		  
			 	document.getElementById("sticky").append(min); 
			 	min.addEventListener ("click", function() {
			          //TODO
			     }); 


			//Create a new button element. This is the 'x' exit button on the sticky note.
			var circ = document.createElement('button');
				circ.innerHTML ="x";

				circ.style.fontFamily="Roboto, Calibri";
				circ.style.textAlign = "center"; 
				circ.style.textDecoration = "none";
				circ.id="min";
				//circ.style.width = "20px";
				//circ.style.height = "20px";
			 	circ.style.borderRadius = "50%";
			 	circ.style.borderWidth = "0px";
				circ.style.color = "gray";
				circ.style.background = "white";
				circ.style.position = "absolute";
				circ.style.right = "5%";
			    circ.style.top = "20px";
		  
			 	document.getElementById("sticky").append(circ); 
			 	circ.addEventListener ("click", function() {
			          removeSticky();
			     }); 

			 //Create a new button element. This is the button for adding a new goal.
			 var plus = document.createElement('div');
			 	plus.innerHTML ="+";

			 	plus.style.fontFamily="Roboto, Calibri";
			 	plus.style.textAlign = "center"; 
			 	plus.style.textDecoration = "none";
			 	plus.id="addGoalButton";
			 	plus.style.width = "20px";
			 	plus.style.height = "20px";
			 	plus.style.borderWidth = "1px";
			 	plus.style.borderStyle = "solid";
			 	plus.style.borderColor="gray";
			 	plus.style.borderRadius="10%";
			 	plus.style.background = "white";
			 	plus.style.color = "gray";
			 	plus.style.fontWeight="700";
			 	plus.style.position = "absolute";
			 	plus.style.right = "5%";
			    plus.style.bottom = "10px";

			  
			  	document.getElementById("sticky").append(plus); 
			  	plus.addEventListener ("mouseover", function() {
			           this.style.cursor = "pointer";
			    }); 
			  	plus.addEventListener ("click", function() {
			           newGoal();
			    }); 

			
			//Create a new p element. This is the 'GOAL" heading at the top of the sticky note.
			var heading = document.createElement("p");  
				heading.style.fontFamily = "Roboto, Calibri!important";                     
				heading.id = "testHead";
				heading.style.margin="10%";
				heading.style.marginBottom="5%";
				//heading.innerText = "🌱 TASKS"; 
				//heading.innerText = "✨ TASKS"; 
				heading.innerText = "TASKS"; 
				//cell.innerHTML="Write your new task here!✨";           
				document.getElementById("sticky").append(heading);                     


			//Create a new div element. This is the horizontal line below "GOAL" on the sticky note.
			var line = document.createElement("div");    
				line.style.width = "90%";
				line.style.height = "1px";
				line.style.margin = "auto";
				line.style.background = "#D0D0D0";
				document.getElementById("sticky").append(line);                      

			//Create a new div element. This is the area for appending goal statements. 
			var goalDiv = document.createElement("div"); 
				goalDiv.style.margin = "10%";
				goalDiv.style.marginTop="5%";
			    goalDiv.style.marginBottom = "50px";
			    goalDiv.style.maxHeight="450px";
			    goalDiv.style.fontFamily = "Roboto, Calibri!important";
			    goalDiv.style.overflow="auto";                     
				goalDiv.id="goalDiv";

				document.getElementById("sticky").append(goalDiv);   



			//Create a new p element. This is the goal statement.
			var para = document.createElement("p"); 
				para.style.margin = "10%";
				para.style.marginTop="7%";
				para.innerText = goal;
			
				document.getElementById("sticky").append(para);                    


			//Create a new span element. This is the area to which the checkbox and the "Goal Accomplished" label are appended.
			var checkSpan = document.createElement("span");
				checkSpan.id="checkSpan";
				checkSpan.style.position = "absolute";
				checkSpan.style.display = "inline-block";
				checkSpan.style.float = "left";
				checkSpan.style.float = "left";
			  	checkSpan.style.marginLeft = "10%";
			  	checkSpan.style.marginBottom = "10%";
				document.getElementById("sticky").append(checkSpan);


			//Create a new span element. This is the div to which the label of the checkbox will be appended.
			var labelSpan = document.createElement("span");
				labelSpan.id="labelSpan";
				labelSpan.style.display = "inline-block";
			  	labelSpan.style.marginLeft = "20%";
			  	labelSpan.style.marginBottom = "10%";

				document.getElementById("sticky").append(labelSpan);
			

			//Create a new span element. This is the checkbox that removes the sticky note if clicked.\
			var check = document.createElement("input");
			  check.type = "checkbox";

	    	  check.style.height = "15px";
	    	  check.style.width = "15px";
	    	  check.style.background = "white !important";
	    	  check.style.borderRadius = "5px";
	    	  check.style.border = "2px solid #000000 !important";
	    	  check.style.display = "inline";
			  check.style.marginLeft = "10%";
			  check.style.marginRight = "1%";
			  check.style.marginBottom = "10%";
			  check.style.marginTop = "-8%";
			  check.innerHTML = "Goal Accomplished";

			  check.href="javascript:removeStickyPermanent()"
			  check.addEventListener('change', () => {
			        if (check.checked) {
			            removeStickyPermanent();
			        }
			  });
			    
			  document.getElementById("checkSpan").append(check);
			  

			  //Create a new label element. This is the label of the checkbox.
			  var newlabel = document.createElement("label");
				  newlabel.style.display = "inline";
				  newlabel.innerHTML = "Goal Accomplished!";
				  newlabel.style.marginBottom = "10%";
				  newlabel.color = "black";
				  document.getElementById("labelSpan").append(newlabel);

			  //document.getElementById('sticky').childNodes.addEventListener('mouseover', onHover);
			  //document.getElementById('sticky').childNodes.addEventListener('mouseout', offHover);

			  //Create a new button element. This is for exporting the csv file of data.
			  var exportButton = document.createElement('button');
				exportButton.innerHTML ="Export CSV Data";

				exportButton.style.textAlign = "center"; 
				exportButton.style.textDecoration = "none";
				exportButton.style.background = "white";
				exportButton.style.color = "black";
				exportButton.style.marginLeft = "10%";
			  	exportButton.style.marginRight = "1%";
			  	exportButton.style.marginBottom = "10%";
			  	exportButton.style.marginTop = "-8%";

		  
			 	document.getElementById("sticky").append(exportButton); 
			 	exportButton.addEventListener ("click", function() {
			          writeCSV();
			     }); 
	  

			//});//end of getGoal()

		//}//end of if(isOn)

	//});//end of checkIfOn()

}//end of addStickyNote();




var dummyInput = "What is your next goal?";

/**
 * Function for adding a new goal to the sticky note. 
 **/
function newGoal(){
	console.log("adding a new goal");

	//append a text field
	//within that row, have the shortcut field.
	var cell = document.createElement("div");
		cell.style.background="white";
		cell.style.position="relative";//alows to stack atop one another. 
		//cell.style.bottom="50%";
		cell.style.width = "95%";
		cell.style.minHeight = "20px";
		cell.style.paddingRight = "5%";
		cell.style.marginBottom = "5%";
		//cell.style.borderBottom = "solid";
		cell.style.borderWidth = "0.5px";
		cell.id = "newTag" + "cell1";
		cell.style.fontFamily = "Roboto, Calibri!important"; 
		//cell.innerHTML="Write your new task here!✨";
		cell.innerHTML="Write your new task here!";
		cell.style.color = "gray";
		//cell.contentEditable="true";
		cell.outline="none";
		cell.style.textDecoration = "none";


		cell.addEventListener('mouseover', function(e){
			this.style.cursor = "text";
			cell.style.color = "black";
			//cell.style.textDecoration = "underline";
			cell.addEventListener('mouseout', function mouseOut(e){
				cell.style.borderBottom = "none";
				cell.style.textDecoration = "none";
				cell.removeEventListener('mouseout', mouseOut);
			});
		});

		cell.addEventListener('click', click1, false);

		function click1(e){
			cell.innerHTML = "";
			cell.style.width = "95%";

			cell.removeEventListener('click', click1, false);
			//append a text-input field to cell
			var textField = document.createElement("input");
				textField.type = "text";
				textField.style.width = "95%";
				textField.value = dummyInput;
				textField.style.fontSize = "1em";//0.8 of root font size
				textField.style.fontFamily = "Roboto, Calibri!important"; 
				textField.style.border = "none!important"; 



			cell.append(textField);



			var clickedOutside = false;//if the user clicked elsewhere on the page
			document.addEventListener('mousedown', clickedOutsideFunction, false);

			function clickedOutsideFunction(e){
				let clickedElement = e.target; // clicked element
				if(e.target != textField){
					clickedOutside = true;
					submit(e);
				}
			}

			//if the user hits enter and releases, then update the tags object and remove the keyup listener. 
			cell.addEventListener("keyup", submit, false);

			function submit(event){
				if(event.key == "Enter"){//if the key is the "Enter" key
					//updates the tags object shortcut
					//newTag.shortcut = textField.value;
					dummyInput = textField.value;

					//remove the text field now.
					//updates the table to accomodate this
					cell.innerHTML = textField.value;
					cell.style.width="95%!important";
					cell.style.borderBottom = "none";
					cell.style.color = "black";
					cell.addEventListener('mouseover', function(e){
						cell.style.borderBottom = "solid";
						cell.style.borderWidth="0.1px";
						cell.addEventListener('mouseout', function mouseOut(e){
							cell.style.borderBottom = "none";
							cell.removeEventListener('mouseout', mouseOut);
						});
					});

					cell.removeEventListener("keyup", submit, false);
					document.removeEventListener('mousedown', clickedOutsideFunction, false);
					cell.addEventListener('click', click1, false);//re-add the event listener so the user can edit again
					
					event.preventDefault();
					return false;
				}

				if(clickedOutside == true){
					//updates the tags object shortcut
					//newTag.shortcut = textField.value;

					dummyInput = textField.value;

					//remove the text field now.
					//updates the table to accomodate this
					cell.innerHTML = textField.value;
					cell.style.width="95%!important";
					cell.style.borderBottom = "none";
					cell.style.color = "black";
					cell.addEventListener('mouseover', function(e){
						cell.style.borderBottom = "solid";
						cell.style.borderWidth="0.1px";
						cell.addEventListener('mouseout', function mouseOut(e){
							cell.style.borderBottom = "none";
							cell.removeEventListener('mouseout', mouseOut);
						});
					});

					clickedOutside = false;
					document.removeEventListener('mousedown', clickedOutsideFunction, false);
					cell.addEventListener('click', click1, false);//re-add the event listener so the user can edit again
					
					event.preventDefault();
					return false;
				}

			}//end of keyup()

			return false;
		}//end of click1()
	document.getElementById("goalDiv").append(cell);

	//add listener that, when the text field is activated and "Enter" is hit, then the goal is stored in storage
	//and the text field solidifies into a div with a listener on it. 
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
  console.log("removeSticky() is working.");
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
  console.log("removeSticky() is working.");
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