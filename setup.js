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
var count=-1;//number of primary goals. 



/**FUNCTION CALLS**/

//now that the functions have been defined, we're going to call upon them

//only call functions on parent windows. Child windows should not get tasks. 
if(window.opener == null){
	//localStorage.clear();
	//hi();
	//console.log("scripts up and running");
	//localStorage.clear();
	resetCSS();
	addStickyNote();
	loadGoalsFromStorage();
}

/**FUNCTION DEFINITIONS**/

function fromPopup(){
	alert("Popup communicating!");
}


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

		   /* //Create a new button element. This is the button for adding a new goal.
		    var plusSub = document.createElement('div');
		    	plusSub.innerHTML ="+";

		    	plusSub.style.fontFamily="Roboto, Calibri";
		    	plusSub.style.textAlign = "center"; 
		    	plusSub.style.textDecoration = "none";
		    	plusSub.id="addGoalButton";
		    	plusSub.style.width = "20px";
		    	plusSub.style.height = "20px";
		    	plusSub.style.borderWidth = "1px";
		    	plusSub.style.borderStyle = "solid";
		    	plusSub.style.borderColor="gray";
		    	plusSub.style.borderRadius="10%";
		    	plusSub.style.background = "white";
		    	plusSub.style.color = "gray";
		    	plusSub.style.fontWeight="700";
		    	plusSub.style.position = "absolute";
		    	plusSub.style.right = "15%";
		        plusSub.style.bottom = "10px";

		     
		     	document.getElementById("sticky").append(plusSub); 
		     	plusSub.addEventListener ("mouseover", function() {
		              this.style.cursor = "pointer";
		        }); 
		     	plusSub.addEventListener ("click", function() {
		              newSubGoal();
		        }); 
*/
			
			//Create a new p element. This is the 'GOAL" heading at the top of the sticky note.
			var heading = document.createElement("p");  
				heading.style.fontFamily = "Roboto, Calibri!important";                     
				heading.id = "testHead";
				heading.style.margin="10%";
				heading.style.marginBottom="5%";
				//heading.innerText = "🌱 TASKS"; 
				heading.innerText = "✨ TASKS"; 
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




			//Create a new span element. This is the checkbox that removes the sticky note if clicked.\
			/*var check = document.createElement("input");
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
			  */

			  //Create a new label element. This is the label of the checkbox.
			 /* var newlabel = document.createElement("label");
				  newlabel.style.display = "inline";
				  newlabel.innerHTML = "Goal Accomplished!";
				  newlabel.style.marginBottom = "10%";
				  newlabel.color = "black";
				  document.getElementById("labelSpan").append(newlabel);*/

			  //document.getElementById('sticky').childNodes.addEventListener('mouseover', onHover);
			  //document.getElementById('sticky').childNodes.addEventListener('mouseout', offHover);

			  //Create a new button element. This is for exporting the csv file of data.
			  /*var exportButton = document.createElement('button');
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
			     }); */
	  

			//});//end of getGoal()

		//}//end of if(isOn)

	//});//end of checkIfOn()

}//end of addStickyNote();