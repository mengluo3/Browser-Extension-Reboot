

/**
 * Creates a JSON object for representing a goal and adds it to primaryGoals{}.
 * @param entryIDCount - The id of the goal, determined by the state of the "count" variable.
 * 						 Should be a number. E.g."1"
 * @param goal - the goal description. E.g.: "Write the biomimetics essay."
 * @return the JSON object created.
 **/
function createJsonGoal(entryIDCount, goal){
	var jsonGoalObj = {
		id: entryIDCount, 
		primaryGoal: goal,
		isChecked: false,
		subGoals:{},//subGoals, with their own count
					//Subgoal form is as follows -- 
					//key = {subGoalText: "Example"
							//isChecked: false
							//}
		numSubGoals: 0//initialized as 0, increase as subGoals increases
	}

	primaryGoals[entryIDCount] = jsonGoalObj;
	localStorage.setItem("goal|" + entryIDCount, JSON.stringify(primaryGoals[entryIDCount]));
	console.log("added to localStorage: " + localStorage.getItem("goal|" + entryIDCount));
	return jsonGoalObj;
}


/**
 * Creates a JSON object for representing a subgoal and adds it to primaryGoals{}.
 * @param parentId - The id of the parent goal.
 * @param desc - the goal description. E.g.: "Write the biomimetics essay."
 * @return the JSON object created.
 **/
function createJsonSubGoal(parentId, desc){
	var parentGoal = primaryGoals[parentId];
	var numSubGoals = parseInt(parentGoal.numSubGoals, 10);
	var jsonSubGoalObj = {
		id: numSubGoals, 
		subGoalText: desc,
		isChecked: false
	}

	//add to primaryGoals[parentId]
	parentGoal['numSubGoals'] = numSubGoals;
	parentGoal['subGoals'][parentGoal.numSubGoals] = jsonSubGoalObj;
	console.log("New subgoal added: " + parentGoal['subGoals'][numSubGoals]['subGoalText']);

	//increment numSubGoals
	parentGoal.numSubGoals = numSubGoals+1;

	//update in localStorage. 
	localStorage.setItem("goal|" + parentId, JSON.stringify(primaryGoals[parentId]));
	console.log("added to localStorage: " + localStorage.getItem("goal|" + parentId));
	return jsonSubGoalObj;
}

/**
 * Function for adding a new goal to the sticky note. 
 **/
function newGoal(){
	var id = count;

	var goalRow = document.createElement("div");
		goalRow.style.position="relative";
		goalRow.id="goalRow"+"|"+id;


	var checkbox = document.createElement("input");
		checkbox.id="checkbox"+"|"+id;
		checkbox.type = "checkbox";
		//checkbox.id = tagKey + "Check"; //id is the tag key and Check
		checkbox.style.display="inline-block";
		checkbox.style.zIndex="300!important";
		//checkbox.style.position="absolute";
		//checkbox.style.top="0";
		checkbox.style.verticalAlign="top";
		checkbox.style.margin="0!important";
		checkbox.addEventListener('change', function() {
		    if(this.checked) {
		    	var thisCell = document.getElementById("primaryCell"+"|"+id);
		    	primaryGoals[id]['isChecked'] = true;
		    	localStorage.setItem("goal|" + id, JSON.stringify(primaryGoals[id]));
		    	thisCell.style.textDecoration="line-through";
		    	thisCell.style.color="gray";
		    	console.log("checked!");

		    } else {
		    	var thisCell = document.getElementById("primaryCell"+"|"+id);
		    	primaryGoals[id]['isChecked'] = false;
		    	localStorage.setItem("goal|" + id, JSON.stringify(primaryGoals[id]));
		    	thisCell.style.textDecoration="none";
		    	thisCell.style.color="black";
		     	console.log("not checked!");
		    }
		});
	goalRow.append(checkbox);


	//append a text field
	//within that row, have the shortcut field.
	var cell = document.createElement("div");
		cell.id="primaryCell"+"|"+id;
		cell.style.display="inline-block";
		cell.style.position="absolute!important";
		cell.style.left="5px";
		cell.style.background="white";
		cell.style.position="relative";//alows to stack atop one another. 
		//cell.style.bottom="50%";
		cell.style.width = "80%";
		cell.style.minHeight = "20px";
		//cell.style.paddingRight = "5%";
		cell.style.marginBottom = "5%";

		//cell.style.borderBottom = "solid";
		cell.style.borderWidth = "0.5px";
		cell.style.fontFamily = "Roboto, Calibri!important"; 
		//cell.innerHTML="Write your new task here!✨";
		cell.innerHTML="Write your new task here!";
		cell.style.color = "gray";
		cell.contentEditable="true";
		cell.outline="none";
		cell.style.textDecoration = "none";

			function onclick(e){
				var thisID = e.target.id.split("|")[1];
				cell.style.color = "black";
				clickPrimaryGoal(e, thisID);
			}

			cell.addEventListener('click', onclick);

			/**
			 * Function called when a cell is being edited.
			 * @param event - the click mouseEvent
			 * @param id - the id of the cell being edited.
			 **/
			function clickPrimaryGoal(e, id){
				cell.removeEventListener('click', onclick);
		
				var clickedOutside = false;//if the user clicked elsewhere on the page
				document.addEventListener('click', clickedOutsideFunction);

				function clickedOutsideFunction(e){
					let clickedElement = e.target; // clicked element
					if(e.target != cell){
						clickedOutside = true;
						submitGoal(e, id);
					}
				}

				//if the user hits enter and releases, then update the tags object and remove the keyup listener. 
				//cell.addEventListener("keyup", submitGoal, false);

				/**
				 * Function called when user clicks away or hits center from the cell, indicating that they're
				 * done editing the goal.
				 * @param event - the mouse Event
				 * @param id - the id of the cell being edited.
				 **/
				function submitGoal(event, id){
					/*if(event.key == "Enter"){//if the key is the "Enter" key
						//update the JSON object created.
						if(primaryGoals[id] != null){
							//update the JSON goal object
							primaryGoals[id].primaryGoal = cell.innerHTML;
							console.log("Updated goal at ID: " + JSON.stringify(primaryGoals[count]));
						}else{
							//create the JSON goal object and add it to the array
							createJsonGoal(id, cell.innerHTML);
							console.log("goal at ID: " + JSON.stringify(primaryGoals[id]));
						}


						cell.removeEventListener("keyup", submitGoal, false);
						document.removeEventListener('mousedown', clickedOutsideFunction, false);
						cell.addEventListener('click', onclick, false);//re-add the event listener so the user can edit again
						
						event.preventDefault();
						return false;
					}*/

					if(clickedOutside == true){
						console.log("Clicked outside. innerHTML = " + cell.innerHTML);

						//update the JSON object created.
						if(primaryGoals[id] != null){
							//update the JSON goal object
							primaryGoals[id].primaryGoal = cell.innerHTML;
							localStorage.setItem("goal|" + id, JSON.stringify(primaryGoals[id]));
						}else{
							//create the JSON goal object and add it to the array
							createJsonGoal(id, cell.innerHTML);
						}

						clickedOutside = false;
						document.removeEventListener('click', clickedOutsideFunction);
						cell.addEventListener('click', onclick);//re-add the event listener so the user can edit again
						
						//if there's nothing there in the cell, remove the goal from the document and from storage.
						if(cell.innerHTML == "" || cell.innerHTML === "" || cell.innerHTML == "<br>"){
							alert("deleting task and subtasks");
							document.getElementById("goalDiv").removeChild(goalRow);
							delete primaryGoals[id];
							localStorage.removeItem("goal|" + id);
							//TODO: add browser-level storage in here once we implement that. 
						}

						event.preventDefault();
						return false;
					}


				}//end of keyup()

				return false;
			}//end of click1()

	goalRow.append(cell);

	//Create a new button element. This is the button for adding a new goal.
    var plusSub = document.createElement('div');
    	plusSub.innerHTML ="+";

    	plusSub.style.fontFamily="Roboto, Calibri";
    	plusSub.style.textAlign = "center"; 
    	plusSub.style.textDecoration = "none";
    	plusSub.id="plusSub" + "|" + id;
    	plusSub.style.width = "15px";
    	plusSub.style.height = "15px";
    	plusSub.style.borderWidth = "1px";
    	plusSub.style.borderStyle = "solid";
    	plusSub.style.borderColor="gray";
    	plusSub.style.borderRadius="10%";
    	plusSub.style.background = "white";
    	plusSub.style.color = "gray";
    	plusSub.style.fontWeight="700";
    	plusSub.style.fontSize="0.8em";
    	plusSub.style.display = "inline-block";
    	plusSub.style.position = "absolute";
    	plusSub.style.right = "0";
    	plusSub.style.marginTop = "5px";

     
     	goalRow.append(plusSub); 
     	plusSub.addEventListener ("mouseover", function() {
              this.style.cursor = "pointer";
        }); 
     	plusSub.addEventListener ("click", function() {
              newSubGoal(id);
        }); 


	document.getElementById("goalDiv").append(goalRow);
	count++;//to generate a unique ID for the next goal. 
	localStorage.setItem("goalCount|", count);
}


/**
 * Function for adding a new "sub" goal to the sticky note. 
 * @param id - the id of the goal you are editing.
 **/
function newSubGoal(id){

	//get the number of subGoals in your current goal's json object
	var numSubGoals = parseInt(primaryGoals[id].numSubGoals, 10);
	var subId = numSubGoals;
	//primaryGoals[id].numSubGoals = numSubGoals+1;//increment, because you are currently adding a goal.
	localStorage.setItem("goal|" + id, JSON.stringify(primaryGoals[id]));



	var subGoalRow = document.createElement("div");
		subGoalRow.style.position="relative";
		subGoalRow.style.width="100%";


	var checkbox = document.createElement("input");
		checkbox.type = "checkbox";
		//checkbox.id = tagKey + "Check"; //id is the tag key and Check
		checkbox.style.display="inline-block";
		//checkbox.style.position="absolute!important";
		checkbox.style.position="absolute";
		//checkbox.style.top="0";
		checkbox.style.verticalAlign="top";
		//checkbox.style.margin="0";
		checkbox.style.left="23px";
		checkbox.addEventListener('change', function() {
		    if(this.checked) {
		    	var thisCell = document.getElementById("subGoal" + "|" + id + "|" + subId);
		    	primaryGoals[id].subGoals[subId]['isChecked'] = true;
		    	localStorage.setItem("goal|" + id, JSON.stringify(primaryGoals[id]));
		    	thisCell.style.textDecoration="line-through";
		    	thisCell.style.color="gray";

		    } else {
		    	var thisCell = document.getElementById("subGoal" + "|" + id + "|" + subId);
		    	primaryGoals[id].subGoals[subId]['isChecked'] = false;
		    	localStorage.setItem("goal|" + id, JSON.stringify(primaryGoals[id]));
		    	thisCell.style.textDecoration="none";
		    	thisCell.style.color="black";
		    }
		});

			
	subGoalRow.append(checkbox);


	//append a text field
	var cell = document.createElement("div");
		cell.id = "subGoal" + "|" + id + "|" + subId;
		cell.style.display="inline-block";
		cell.style.position="absolute!important";
		//cell.style.zIndex="-50";
		cell.style.marginLeft="23%";
		cell.style.background="white";
		//cell.style.background="blue";
		cell.style.position="relative";//alows to stack atop one another. 
		//cell.style.bottom="50%";
		cell.style.width = "77%";
		cell.style.minHeight = "20px";
		cell.style.marginBottom = "5%";
		//cell.style.marginLeft="20%";
		//cell.style.borderBottom = "solid";
		cell.style.borderWidth = "0.5px";
		cell.style.fontFamily = "Roboto, Calibri!important"; 
		//cell.innerHTML="Write your new task here!✨";
		cell.innerHTML="Write your new task here!";
		cell.style.color = "gray";
		cell.contentEditable="true";
		cell.outline="none";
		cell.style.textDecoration = "none";



		cell.addEventListener('click', onclick);

		function onclick(e){
			console.log("cliecked sub goal");
			var thisID = e.target.id.split("|")[1];
			cell.style.color = "black";
			clickSubGoal(e, thisID, subId);
		}

		/**
		 * Function called when a cell is being edited.
		 * @param e - the click mouseEvent
		 * @param id - the id of the goal being edited, getting a subGoal added to it.
		 * @param subId - the subId of the subgoal getting edited.
		 **/
		function clickSubGoal(e, id, subId){
		 	cell.removeEventListener('click', onclick);
		
		 	var clickedOutside = false;//if the user clicked elsewhere on the page

		 	function clickedOutsideFunction(e){
		 		if(e.target != cell){
		 			console.log("clicked outside function! target: " + e.target.id);
		 			clickedOutside = true;
		 			editSubGoal(e, id, subId);
		 		}
		 	}
		 	document.addEventListener('click', clickedOutsideFunction);


			/*
			 * Function called when user clicks away or hits center from the cell, indicating that they're
			 * done editing the goal.
			 * @param event - the mouse Event
			 * @param id - the id of the cell being edited.
			 * @param subId - the id of the subGoal being edited.
			 */
			function editSubGoal(event, id, subId){
				
					if(clickedOutside == true){
						console.log("updating stuff");

						//update the JSON object created.
						if(primaryGoals[id] != null){
							//console.log("adding a subgoal to: " + JSON.stringify(primaryGoals[id]));
							//update the JSON goal object
							var newSubGoal = createJsonSubGoal(id, cell.innerHTML);
							//console.log("Updated subGoals at ID count: " + JSON.stringify(primaryGoals[id]));
						}

						clickedOutside = false;
						//cell.removeEventListener("click", onclick);
						document.removeEventListener('click', clickedOutsideFunction);
						cell.addEventListener('click', onclick);//re-add the event listener so the user can edit again

						//if there's nothing there in the cell, remove the goal from the document and from storage.
						if(cell.innerHTML == ""){
							console.log("nothing in cell");
							document.getElementById("goalRow" + "|" + id).removeChild(subGoalRow);
							delete primaryGoals[id].subGoals[subId];
							localStorage.setItem("goal|" + id, JSON.stringify(primaryGoals[id]));
							//TODO: add browser-level storage in here once we implement that. 
						}
						
						event.preventDefault();
						return false;
					}

			}//end of submitSubGoal()

		// 		return false;
		}//end of clickSubGoal()

	
			//return false;

	subGoalRow.append(cell);
	document.getElementById("goalRow" + "|" + id).append(subGoalRow);

	//add listener that, when the text field is activated and "Enter" is hit, then the goal is stored in storage
	//and the text field solidifies into a div with a listener on it. 
}