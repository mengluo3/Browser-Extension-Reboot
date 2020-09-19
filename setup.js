/**
 * @fileoverview JS script that loads on every tab. Renders a sticky note on the page.
 *
 */




/**VARIABLES**/
//var goal;
var isOn;
var winID;

//for dragging
var initX, initY, mousePressX, mousePressY;
// var boxWidth = 250, boxHeight = 100;

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
	/*var ol = '<ul id="demo1" class="slippylist">';
    // ol+='<li class="demo-no-reorder">Swipe,</li>';
    ol+='<li class="demo-no-swipe">hold &amp; reorder <span class="instant">or instantly</span></li>';
    ol+='<li>or either</li>';
    ol+='<li class="demo-no-swipe">or none of them.</li>';
    // ol+='<li>Can play nicely with:</li>';
    // ol+='<li>interaction <input type="range"></li>';
    // ol+='<li style="transform: scaleX(0.97) skewX(-10deg); -webkit-transform: scaleX(0.97) skewX(-10deg)">inline CSS transforms</li>';
    // ol+='<li class="skewed">stylesheet transforms</li>';
    // ol+='<li class="demo-allow-select"><span class="demo-no-reorder">and selectable text, even though animating elements with selected text is a bit weird.</span></li>';
    // ol+='<li>iOS Safari</li>';
    // ol+='<li>Mobile Chrome</li>';
    // ol+='<li>Android Firefox</li>';
    // ol+='<li>Opera Presto and Blink</li>';
    // ol+='<li>No dependencies</li>';
	ol+='</ul>';
	var newDiv = document.createElement("div");
		newDiv.innerHTML = ol;
		//newDiv.id = "demo1";*/
	
	//1. Check if the extension is on or not
	//checkIfOn(function(){
		//2. If on, get the goal, and add the divs.
		//if(isOn){
			//getGoal(function(goal){

			
			//Create a new div element that is a white rectangle. This is the background of the sticky note.
		  	var box = document.createElement("div");
			  	box.id="sticky";

				//add new element to the clear background
				document.body.append(box);

/*				box.append(newDiv);

				function setupSlip(list) {
			        list.addEventListener('slip:beforereorder', function(e){
			        	console.log("slip:beforereorder");
			            if (e.target.classList.contains('demo-no-reorder')) {
			                e.preventDefault();
			            }
			        }, false);

			        // list.addEventListener('slip:beforeswipe', function(e){
			        //     if (e.target.nodeName == 'INPUT' || e.target.classList.contains('demo-no-swipe')) {
			        //         e.preventDefault();
			        //     }
			        // }, false);

			        // list.addEventListener('slip:beforewait', function(e){
			        //     if (e.target.classList.contains('instant')) e.preventDefault();
			        // }, false);

			        // list.addEventListener('slip:afterswipe', function(e){
			        //     e.target.parentNode.appendChild(e.target);
			        // }, false);

			        list.addEventListener('slip:reorder', function(e){
			        	console.log("slip:reorder");
			            e.target.parentNode.insertBefore(e.target, e.detail.insertBefore);
			            return false;
			        }, false);
			        return new Slip(list);
			    }
			 	var list = document.querySelector('ul#demo1');
				new Slip(list);
				setupSlip(list);
				*/


				//BELOW two lines: unused code for making the sticky note disappear upon hover.
				//document.getElementById('sticky').addEventListener('mouseover', onHover);
				//document.getElementById('sticky').addEventListener('mouseleave', offHover);

				//add event listener to the sticky note.	
				// box.addEventListener('mousedown', function(event) {

				// 	initX = this.offsetLeft;
				// 	initY = this.offsetTop;
				// 	mousePressX = event.clientX;
				// 	mousePressY = event.clientY;

				// 	this.addEventListener('mousemove', repositionStickyNote, false);

				// 	window.addEventListener('mouseup', function() {
				// 	  box.removeEventListener('mousemove', repositionStickyNote, false);
				// 	}, false);

				// }, false);
	
			
			//Create a new button element. This is the '-' minimize button on the sticky note.
			var min = document.createElement('button');
				min.innerHTML ="—";
				min.id="min";
		  
			 	document.getElementById("sticky").append(min); 
			 	min.addEventListener ("click", function() {
			          //TODO
			     }); 


			//Create a new button element. This is the 'x' exit button on the sticky note.
			var circ = document.createElement('button');
				circ.innerHTML ="x";
				circ.id="circ";
		  
			 	document.getElementById("sticky").append(circ); 
			 	circ.addEventListener ("click", function() {
			          removeSticky();
			     }); 

			 //Create a new button element. This is the button for adding a new goal.
			 var plus = document.createElement('div');
			 	plus.innerHTML ="+";
			 	plus.id="addGoalButton";

			  
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
				heading.id = "testHead";
				heading.innerText = "✨ TASKS";            
				document.getElementById("sticky").append(heading);                     


			//Create a new div element. This is the horizontal line below "GOAL" on the sticky note.
			var line = document.createElement("div");  
				line.id = "grayLine";  
				document.getElementById("sticky").append(line);                      

			//Create a new div element. This is the area for appending goal statements. 
			var goalDiv = document.createElement("div");                 
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