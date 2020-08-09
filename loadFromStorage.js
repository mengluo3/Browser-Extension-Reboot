
/**
 * Load in goals from localStorage.
 **/
 function loadGoalsFromStorage(){
 	//iterate through localStorage. 
 	for (var i = 0; i < localStorage.length; i++){

            // console.log("iterating through localStorage");
            var key = localStorage.key(i);
            //console.log("key in localStorage: " + key);
            //console.log("key: " + key);

            var keyType=key.split("|")[0];

            if(keyType == "goal"){
            	var id = key.split("|")[1];
            	primaryGoals[id] = JSON.parse(localStorage.getItem(key));
            	//console.log("added to primaryGoals: " + primaryGoals[id]);
            }

            if(keyType == "goalCount"){
            	count = localStorage.getItem(key);
	     }
	}

	//if count is still null, then set to 0. 
	if(count == -1){
		count = 0;
		localStorage.setItem("goalCount", 0);
	}


	//Now render all the goals and subgoals
	Object.keys(primaryGoals).forEach(function(goalID){
		renderGoal(goalID); 
	});
 }
