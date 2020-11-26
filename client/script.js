// Adds background grass
document.body.style.backgroundImage = "url(./imgs/bg.png)";
document.body.style.backgroundRepeat = "repeat";

// Gets client dimensions
var clientHeight = document.body.clientHeight;
var clientWidth = document.body.clientWidth;
var socket = io();
var sessionId = null;

// Player object
var player = {
	id: "user",
	prev: { x: 700, y: 300 },
	pos: { x: 700, y: 300 },
	size: { x: 10, y: 10 },
	direction: 90,
	points: 0,
	health: 100,
	name: null,
	firing: false,
};

var emitData = {
	name: null,
	playerDir: null,
};

// Sets player size to the players div size
player.size.x = document.getElementById("user").offsetWidth;
player.size.y = document.getElementById("user").offsetHeight;

// no scroll bars
document.documentElement.style.overflow = "hidden"; // firefox, chrome
document.body.scroll = "no"; // ie only

var steps = 10;
var rightPressed = false;
var leftPressed = false;
var upPressed = false;
var downPressed = false;
var spacePressed = false;
var chatActive = false;	//creates variable to hold a boolean variable for whether or not the user is in the chat

document.addEventListener("keydown", keyDown, false);
document.addEventListener("keyup", keyUp, false);

var users = {};


function keyDown(e) {
	if (popupStack.length == 0 && chatActive == false) {
		if (e.keyCode == 39) {
			// right arrow
			rightPressed = true;
		} else if (e.keyCode == 37) {
			// left arrow
			leftPressed = true;
		}
		if (e.keyCode == 40) {
			// down arrow
			downPressed = true;
		} else if (e.keyCode == 38) {
			// up arrow
			upPressed = true;
		}
		if (e.keyCode == 32) {
			// spacebar
			if (player.firing == false) {
				console.log('spacepressed and calling arrow');
				// Arrow dissapprears
				socket.emit('arrow', player.direction);
				player.firing = true;
				setTimeout(firingFalse, 500);
			}
		}
	}
	if (e.keyCode == 27) {
		// esc key
		// Bug: Pressing esc multiple times opens multiple popups
		showPopup(pause);
	}
}

function keyUp(e) {
	if (e.keyCode == 39) {
		rightPressed = false;
	} else if (e.keyCode == 37) {
		leftPressed = false;
	}
	if (e.keyCode == 40) {
		downPressed = false;
	} else if (e.keyCode == 38) {
		upPressed = false;
	}
}

/* Game loop */
var fps = 60;


setInterval(gameTick, 1000 / fps);	//creates an inverval that runs the function gameTick 60 times a second


function gameTick() {
	socket.emit('update');	//sends request to server for update of all player positions
	if (emitData.name) {
		var obj = document.getElementById(player.id);

		// saves previous position before player is moved
		//player.prev.x = player.pos.x;
		//player.prev.y = player.pos.y;

		// Key Input
		if (rightPressed) {
			//obj.classList.remove("facingLeft", "facingUp", "facingDown", "stopped");
			//obj.classList.add("facingRight");
			//player.pos.x += steps;
			emitData.playerDir = "right";
			player.direction = 90;
			emitData.stopped = "moving";
		} else if (leftPressed) {
			//obj.classList.remove("facingRight", "facingUp", "facingDown", "stopped");
			//obj.classList.add("facingLeft");
			//player.pos.x -= steps;
			emitData.playerDir = "left";
			player.direction = 270;
			emitData.stopped = "moving";
		} else if (upPressed) {
			//obj.classList.remove("facingLeft", "facingRight", "facingDown", "stopped");
			//obj.classList.add("facingUp");
			//player.pos.y -= steps;
			emitData.playerDir = "up";
			player.direction = 0;
			emitData.stopped = "moving";
		} else if (downPressed) {
			//obj.classList.remove("facingRight", "facingUp", "facingLeft", "stopped");
			//obj.classList.add("facingDown");
			//player.pos.y += steps;
			emitData.playerDir = "down";
			player.direction = 180;
			emitData.stopped = "moving";
		} else {
			//obj.classList.add("stopped");
			emitData.playerDir = null;
			emitData.stopped = "stopped";
		}

		socket.emit('input info', emitData);

		// Move player to position
		//obj.style.left = player.pos.x + "px";
		//obj.style.top = player.pos.y + "px";


	}
}

// Receive movement data
/*
socket.on('input info', function (playerNewPos) {
	player.pos.x = playerNewPos.x;
	player.pos.y = playerNewPos.y;
})
*/

socket.on('user disconnected', function (player) {	//when a message is recieved from server for when a user disconnects 
	if (player){
	var obj = document.getElementById(player.id);	
	obj.remove();}	//remove the div object for that player from map
})


socket.on ('dead', function (Id){	//if server sends response saying someone has died
	if (Id.id == sessionId){	//if the user who has died is the client show dead menu popup
		showPopup(dead);	
		document.getElementById("score").innerHTML +=  Id.points;} //Add points to popup paragraph with Id 'score'
	else {
		if (Id){	//if Id isn't the same as the client AND is not null
			var obj = document.getElementById(Id.id);	
			obj.remove();		//remove the div object for the player who died from map
			delete users[Id];	//delete the player from 'users' 
		}
	}
})
socket.on('updated', function (players) {	//when database returns the updated player details list
	for (var id in players) {	//loop through each player in list
		 playerNew = players[id];	//store value of current player in 'playerNew'
		if (!users.hasOwnProperty(playerNew.id)) {	//if player doesn't already exist in 'users' then create a div for it  
			let div = document.createElement('div');	
			div.id = playerNew.id;			//sets id of div to that players socket id (from server)
			div.className = 'player facingRight';	//add class to div to add formatting of sprite
			document.body.appendChild(div);	//add new player div to body
		}
		let obj = document.getElementById(playerNew.id)	
		obj.style.left = playerNew.x + "px";	//sets x and y position the div for current playerNew  
		obj.style.top = playerNew.y + "px"
		obj.classList.remove("facingRight", "facingUp", "facingLeft", "facingDown","moving","stopped");	//remove previous classes which change sprite direction
		obj.classList.add(playerNew.direction);	//add the class list to point sprite in correct direction
		obj.classList.add(playerNew.stopped);
		console.log(playerNew.stopped);
		



				if (playerNew.username == player.name) {
			document.getElementById("health").innerHTML = "Health: " + playerNew.health + "/100";
			document.getElementById("points").innerHTML = "Points: " + playerNew.points;
			// Activates collision detection for player
			//creates variable to hold whether the powerups have been moved or not
			for (var ii = 0; ii < objectBlocks.length; ii++) {
				var div = document.getElementById(objectBlocks[ii].id);
				//document.getElementById("health").innerHTML = "Health: " + player.health + "/100";
				//document.getElementById("points").innerHTML = "Points: " + player.points;
				var doesCollide = objectBlocks[ii].detectCollision(playerNew.id, playerNew, player.dimensions);
				var doesCollideBool = false;
				if (doesCollide == "med") {
					socket.emit('med');
				}
				if (doesCollide == "coin") {
					socket.emit('point');
				}
				if (doesCollide == "med" || doesCollide == "coin") {
					div = moveDiv(true, div, ii); //Calls function that will move the div to new location
				}
				if (doesCollide == "block") {
					if (objectBlocks[ii].detectCollision(playerNew.id, playerNew, player.dimensions) == "block") {
						if (playerNew.direction == "facingRight") {
							playerNew.x -= 10;
						} else if (playerNew.direction == "facingLeft") {
							playerNew.x += 10;
						} else if (playerNew.direction == "facingDown") {
							playerNew.y -= 10;
						} else if (playerNew.direction == "facingUp") {
							playerNew.y += 10;
						}
					}
					socket.emit('hit block', playerNew);
				}
			}
		}



		obj.style.left = playerNew.x + "px";
		obj.style.top = playerNew.y + "px";
		obj.classList.remove("facingRight", "facingUp", "facingLeft", "facingDown");
		obj.classList.add(playerNew.direction);;
		

		users[playerNew.id] = playerNew;

	}


})

socket.on('leaderboard', function (leaderboard){
	
	socket.emit('searchLeaderboard');
	socket.on('leadPos', function(data){
		playerRank = data;
		})
	
	if (typeof playerRank !== 'undefined'){
	if (leaderboard[0]){
		if (playerRank.rank ==1){
			document.getElementById("first").innerHTML = playerRank.rank+". " + playerRank.name + " : " + playerRank.points;
			document.getElementById("first").style.color = "green";
		} else{
			document.getElementById("first").innerHTML = "1. " + leaderboard[0].username + " : " + leaderboard[0].points;
			document.getElementById("first").style.color = "white";
		}
	} else{document.getElementById("first").innerHTML =" ";}
	
	if (leaderboard[1]){
		if (playerRank.rank ==2){
			document.getElementById("second").innerHTML = playerRank.rank+". " + playerRank.name + " : " + playerRank.points;
			document.getElementById("second").style.color = "green";
		} else{
			document.getElementById("second").innerHTML = "2. " + leaderboard[1].username + " : " + leaderboard[1].points;
			document.getElementById("second").style.color = "white";
		}
	}else{document.getElementById("second").innerHTML =" ";}
	if (leaderboard[2]){
		if (playerRank.rank ==3){
			document.getElementById("third").innerHTML = playerRank.rank+". " + playerRank.name + " : " + playerRank.points;
			document.getElementById("third").style.color = "green";
		} else{
			document.getElementById("third").innerHTML = "3. " + leaderboard[2].username + " : " + leaderboard[2].points;
			document.getElementById("third").style.color = "white";
		}
	}else{document.getElementById("third").innerHTML =" ";}
	if (playerRank.rank > 3){
			document.getElementById("place").innerHTML = playerRank.rank+". " + playerRank.name + " : " + playerRank.points;
			document.getElementById("place").style.color = "green";
	} else {
		if (leaderboard[3]){
			document.getElementById("place").innerHTML = "4. " + leaderboard[3].username + " : " + leaderboard[3].points;
			document.getElementById("place").style.color = "white";
		}else{document.getElementById("place").innerHTML =" ";}
	}
		
	
}})

function activechat(state) {	
	chatActive = state;
}

function loopObjects() {
	for (var ii = 0; ii < objectBlocks.length; ii++) {
		var div = document.getElementById(objectBlocks[ii].id);
		if (objectBlocks[ii].type != "block") {
			div = moveDiv(false, div, ii); //Calls function that will move the div to new location
		}
	}
}

function moveDiv(moved, div, ii) {	//function to move power up divs to new position 
	if (moved) {	//if div needs to be moved again (currently not in suitable position)
		div.style.left =	
			getRandomIntInclusive(50, document.body.clientWidth - 50) + "px";	//sets div position to random x and y coordinate
		div.style.top =
			getRandomIntInclusive(50, document.body.clientHeight - 50) + "px";
	}
	var update = true;
	while (update) { //while new div position is still unsuitable
		for (var count = 0; count < objectBlocks.length; count++) { 
			if (objectBlocks[count].detectOverlap(objectBlocks[ii].id, objectBlocks[ii].type)) { //loop through all other blocking objects and check if coordinates intersect
				moveDiv(true, div, ii); // if they are move div again
			} else {
				update = false; //if div has been moved to suitable position then loop can end
			}
		}
	}

	return div;
}

function getData() {
	var name = document.forms["username"]["uName"].value;
	player.name = name;
	emitData.name = name;
	socket.emit('new_players', name);
}

popupStack = [];

function showPopup(str) {
	popupStack.push(str); //adds html code for new menu screen to stack of previous menus

	var bb = document.getElementById("popupbody");
	bb.innerHTML = str; //adds html code for menu screen to popupbody div

	var dd = document.getElementById("menuContainer");
	dd.className = "show"; //changes the class of the menu container so it is no longer hidden
}

function closePopup(all) {
	i = 1;
	if (all != undefined) {
		i = popupStack.length;
	}
	for (var ii = 0; ii < i; ii++) {
		var prevMenu = popupStack.pop(); //removes top element in stack of previous menu screens

		if (popupStack.length <= 0) {
			var dd = document.getElementById("menuContainer");
			dd.className = ""; //if there are no more previous menu screens in stack hide container by removing class

			return;
		}

		prevMenu = popupStack.pop(); //removes top menu code in stack and stores it in variable prevMenu

		showPopup(prevMenu); //sends code of previous menu screen to showPopup() to display on screen
	}
}

//creates variables which holds the html code for each menu
var pause = `
	<br><br>
	<div class="pauseMenu">
		 <h2>Paused</h2> 
		 <br>
		 
		<button class="button" onclick="closePopup();">Back</button>
	</div>
`;

var play = `<div class="buttonContainer">
			<button class="button" onclick="showPopup(form1);loopObjects();">Play</button>
			<button class="button" onclick="showPopup(help);">Help</button>
			</div>`;

var help = `
	<br><br>
	<div class="pauseMenu">
		 <h2>Help</h2> 
		 <br>
		 <p>
		 **Game Instructions**
		 </p>
		 
		<button class="button" onclick="closePopup();">Back</button>
	</div>
`;

var dead = // creates variable which holds html code for when a player dies
`
	<br><br>
	<div class="pauseMenu">
		 <h1>YOU DIED.</h1> 
		 <br>
		 <p id ="score">
		 Your High Score Was:  
		 </p>
		
		<button class="button" onclick="window.location.reload();">Retry</button>
	</div>
`;


var form1 = `<div class="buttonContainer" style="top:110px;">
			<form name="username"  onsubmit="getData();closePopup(1);" >
  <input class="button" style="width:100%;" type="text" id="uName" name="uName" autofocus placeholder="Enter Username">
  <br><br>
  <input class="button" type="submit" value="Submit">
</form> 
			
			</div>`;

showPopup(play);

var objectBlocks = [];

function getRandomIntInclusive(min, max) { // **function taken from Dr B Kenwright** which takes in two numbers and outputs a random number between them (inclusive)
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
}

var clientHeight = document.body.clientHeight;
var clientWidth = document.body.clientWidth;

socket.on('fire', function(arrow){	//when a message is recieved from server for when an arrow has been fired
	callArrowMove(arrow.x, arrow.y, arrow.angle, arrow.id); //creates and moves an new arrow using the starting coordinates, angle and id of shooter from server
})

function callArrowMove(x, y, dir, id) {	//recieves position, angle and shooter info and creates new arrow object from that
	id = new arrow(
		x + clientWidth * 0.025,
		y + clientHeight * 0.025,
		clientWidth * 0.02,
		clientHeight * 0.04,
		"./imgs/arrow.png",
		dir,
		id
		
	);

	id.movearrow();	//starts movearrow method on the arrow (id)
}

function firingFalse() {	//function that sets player.firing to false which will be used to restrict fire rate
	player.firing = false;
}

var arrowId = 0; //variable to hold the next new arrow ID number
function arrow(xx, yy, clientWidth, clientHeight, img, direction, id) {
	var userId = id;
	this.id = "arrowids" + arrowId;
	this.pos = { x: xx, y: yy };
	this.startPos = { x: xx, y: yy };
	this.angle = direction;
	this.dist = 0;
	arrowId += 1; //increment newId by 1 to next id number

	this.update = function () {
		this.div.style.left = this.pos.x + "px";
		this.div.style.top = this.pos.y + "px";
	};

	this.movearrow = function () {	//function which controls arrow movement
		var axis = null;
		var closest = null;
		if (this.angle == 0) { //if angle is 0 (arrow pointing up) find the first blocking object in its path
			for (var i = 0; i < objectBlocks.length; i++) {	//loops through all blocking objects
				if (
					objectBlocks[i].pos.y + parseInt(objectBlocks[i].div.style.height) <
					this.pos.y &&
					objectBlocks[i].pos.x <= this.pos.x + 20 &&
					objectBlocks[i].pos.x + parseInt(objectBlocks[i].div.style.width) >=
					this.pos.x + 20 &&
					(closest == null ||
						objectBlocks[i].pos.y +
						parseInt(objectBlocks[i].div.style.height) -
						this.pos.y >
						closest) &&
					objectBlocks[i].type == "block"		
				) {
					closest =	//if current object is in the arrows path, closer than current 'closest' object and a blocking object then set 'closest' to its distance from arrow 
						objectBlocks[i].pos.y +
						parseInt(objectBlocks[i].div.style.height) -
						this.pos.y +
						5;
				}
			}
			axis = "y"; //sets axis to y to be used later for direction of moving arrow
		
		} else if (this.angle == 180) { //if angle is 180 (arrow pointing down) find the first blocking object in its path
			for (var i = 0; i < objectBlocks.length; i++) {	//loops through all blocking objects
				if (
					objectBlocks[i].pos.y >
					this.pos.y + parseInt(this.div.style.height) &&
					objectBlocks[i].pos.x <= this.pos.x + 20 &&
					objectBlocks[i].pos.x + parseInt(objectBlocks[i].div.style.width) >=
					this.pos.x + 20 &&
					(closest == null ||
						objectBlocks[i].pos.y -
						(this.pos.y + parseInt(this.div.style.height)) <
						closest) &&
					objectBlocks[i].type == "block"
				) {
					closest =	//if current object is in the arrows path, closer than current 'closest' object and a blocking object then set 'closest' to its distance from arrow 
						objectBlocks[i].pos.y -
						(this.pos.y + parseInt(this.div.style.height)) +
						5;
				}
			}
			axis = "y"; //sets axis to y to be used later for direction of moving arrow
			
		} else if (this.angle == 90) {	//if angle is 90 (arrow pointing right) find the first blocking object in its path
			for (var i = 0; i < objectBlocks.length; i++) { //loops through all blocking objects
				if (
					objectBlocks[i].pos.x > this.pos.x + parseInt(this.div.style.width) &&
					objectBlocks[i].pos.y <= this.pos.y + 20 &&
					objectBlocks[i].pos.y + parseInt(objectBlocks[i].div.style.height) >=
					this.pos.y + 20 &&
					(closest == null ||
						objectBlocks[i].pos.x -
						(this.pos.x + parseInt(this.div.style.width)) <
						closest) &&
					objectBlocks[i].type == "block"
				) {
					closest =	//if current object is in the arrows path, closer than current 'closest' object and a blocking object then set 'closest' to its distance from arrow 
						objectBlocks[i].pos.x -
						(this.pos.x + parseInt(this.div.style.width)) +
						5;
				}
			}
			axis = "x"; //sets axis to x to be used later for direction of moving arrow
			
		} else if (this.angle == 270) { //if angle is 270 (arrow pointing left) find the first blocking object in its path
			for (var i = 0; i < objectBlocks.length; i++) {	//loops through all blocking objects
				if (
					objectBlocks[i].pos.x + parseInt(objectBlocks[i].div.style.width) <
					this.pos.x &&
					objectBlocks[i].pos.y <= this.pos.y + 20 &&
					objectBlocks[i].pos.y + parseInt(objectBlocks[i].div.style.height) >=
					this.pos.y + 20 &&
					(closest == null ||
						objectBlocks[i].pos.x +
						parseInt(objectBlocks[i].div.style.width) -
						this.pos.x >
						closest) &&
					objectBlocks[i].type == "block"
				) {
					closest =	//if current object is in the arrows path, closer than current 'closest' object and a blocking object then set 'closest' to its distance from arrow 
						objectBlocks[i].pos.x +
						parseInt(objectBlocks[i].div.style.width) -
						this.pos.x +
						5;
				}
			}
			axis = "x";	//sets axis to x to be used later for direction of moving arrow
		}

		var position = 0; //creates variable to store the distance travelled by arrow (init 0)
		var move = 0; //creates a variable to store how far to move across axis in each step
		var id = setInterval(frame, 5);	//creates interval which runs the function 'frame' every 5 seconds
		var obj = document.getElementById(this.id);	
		function frame() {
			if (!sessionId){	//if the users socket id hasn't been stored request it from server
				socket.emit('getId');
				socket.on('returnId', function(id){
				sessionId = id;	//store the returned id
			})}
			
			let playerData = document.getElementById(sessionId);	//get and store the clients player div 
			if (playerData != null){ //if playerdata is a valid defined div 

				if (obj.style.top <  ((parseInt(playerData.style.top) +  playerData.offsetHeight )+"px" )  &&  
					obj.style.top >  playerData.style.top && 
					obj.style.left <  ((parseInt(playerData.style.left) +  playerData.offsetWidth )+"px" ) &&
					obj.style.left >  playerData.style.left && userId != sessionId){
												//if arrow was fired by another user and collides with the clients sprite 
						socket.emit('hit');		//send a message to server that the client has been hit (server will update health)	
						clearInterval(id);		//cancels the interval which was running the frame function on a loop
						obj.remove();			//removes the arrow div from the map
				}
				for (var enemy in users){	//loops through each player in 'users'
					let enemyData = document.getElementById(enemy);
						if (enemy != sessionId && enemyData){	//if user is not the client AND a valid div 
							
							if (obj.style.top <  ((parseInt(enemyData.style.top) +  enemyData.offsetHeight )+"px" )  &&  
							obj.style.top + 5 >  enemyData.style.top && 
							obj.style.left <  ((parseInt(enemyData.style.left) +  enemyData.offsetWidth )+"px" ) &&
							obj.style.left >  enemyData.style.left && userId != enemy){
													//if arrow was fired by anyone other than the enemy sprite its collided with
								clearInterval(id);	//cancels the interval which was running the frame function on a loop
								obj.remove();		//removes the arrow div from the map
								
				}}}
				if (
					Math.abs(position) >= Math.abs(closest) || //if the distance travelled is greater or equal to the distance from first blick
					position > clientHeight * 18 ||		//or distance travelled is greater than the max its allowed 
					position < -clientHeight * 18
				) {
					clearInterval(id);	//cancel the interval which was running the frame function on a loop
					obj.remove();		////remove the arrow div from the map
				} else if (position < closest) {	//if distance travelled is less than distance to closest block
					position++;	//increment position counter by 1
					move = 1;	//set moved to 1 (distance of step = 1)
				} else if (position > closest) {	//if distance travelled is greater than distance to closest block
					position--;	//increment position counter by -1
					move = -1;	//set moved to -1 (distance of step is back 1)
				}
				if (axis == "y") {	//if arrow is travelling along y axis move arrows y coordinate by 'move'
					obj.style.top = parseInt(obj.style.top) + move + "px";
				} else {	//if arrow is travelling along x axis move arrows x coordinate by 'move'
					obj.style.left = parseInt(obj.style.left) + move + "px";
				}
		}
	}};

	this.div = document.createElement("div");	//creates new div object 
	this.div.id = this.id;	//sets divs id to the id created earlier in function
	this.div.className = "block";	//sets the arrows class name to block
	this.div.style.width = clientWidth;
	this.div.style.height = clientHeight;	//sets width and height 
	this.div.style.position = "absolute";
	this.div.pos = { x: xx, y: yy };
	this.div.style.left = this.pos.x + "px";		
	this.div.style.top = this.pos.y + "px";	//sets the position of div
	this.div.style.zIndex = -5;	//sets zindex (layer level) to -5
	this.div.style.backgroundImage = "url('" + img + "')"; //fills background of div with image of arrow
	this.div.style.backgroundSize = "100% 100%";	//ensures img fills the whole div
	this.div.style.transform = "rotate(" + this.angle + "deg)";	//rotates the arrow div to angle of movement
	document.body.appendChild(this.div);	//adds final div element to the document

	this.dimensions = {
		x: this.div.style.offsetWidth,
		y: this.div.style.offsetHeight,
	};

	this.update();
}


var newId = 0; //variable to hold the next new ID number
function MyObject(xx, yy, clientWidth, clientHeight, img, type, imgX, imgY) {
	this.id = "ids" + newId;
	this.pos = { x: xx, y: yy };
	this.prevPos = { x: xx, y: yy };
	this.type = type;
	newId += 1; //increment arrowId by 1 to next id number

	this.update = function () {
		this.div.style.left = this.pos.x + "px";
		this.div.style.top = this.pos.y + "px";
	};



	this.detectOverlap = function (id1, type) {
		object1Info = document.getElementById(this.id);
		var object1Width = object1Info.offsetWidth;
		var object1Height = object1Info.offsetHeight;
		var object1Left = object1Info.offsetLeft;
		var object1Top = object1Info.offsetTop;

		var object2Info = document.getElementById(id1);
		var object2Width = object2Info.offsetWidth;
		var object2Height = object2Info.offsetHeight;
		var object2Left = object2Info.offsetLeft;
		var object2Top = object2Info.offsetTop;

		var xDiff =
			object1Left + object1Width / 2 - (object2Left + object2Width / 2);
		var yDiff =
			object1Top + object1Height / 2 - (object2Top + object2Height / 2);

		var xSize = (object1Width + object2Width) / 2;
		var ySize = (object1Height + object2Height) / 2;

		if (
			Math.abs(yDiff) < Math.abs(ySize) &&
			Math.abs(xDiff) < Math.abs(xSize)
		) {
			if (this.type == "block" && type != "block") {
				return true; // Collision detected
			}

			return false;
		} //*/
		return false; // No collision
	};



	this.detectCollision = function (playerID, player, dimensions, type) {
		playerInfo = document.getElementById(playerID);
		objectInfo = document.getElementById(this.id);
		var playerWidth = playerInfo.offsetWidth;
		var playerHeight = playerInfo.offsetHeight;
		var playerLeft = playerInfo.offsetLeft;
		var playerTop = playerInfo.offsetTop;
		var objectWidth = objectInfo.offsetWidth;
		var objectHeight = objectInfo.offsetHeight;
		var objectLeft = objectInfo.offsetLeft;
		var objectTop = objectInfo.offsetTop;

		var xDiff = playerLeft + playerWidth / 2 - (objectLeft + objectWidth / 2);
		var yDiff = playerTop + playerHeight / 2 - (objectTop + objectHeight / 2);

		var xSize = (playerWidth + objectWidth) / 2;
		var ySize = (playerHeight + objectHeight) / 2;

		if (
			Math.abs(yDiff) < Math.abs(ySize) &&
			Math.abs(xDiff) < Math.abs(xSize)
		) {
			if (this.type == "block") {
				return "block"; // doesnt move character
			} else if (this.type == "med") {
				//if user collides with med kit increase health by 25 (max 100pts)
				return "med";
			} else if (this.type == "coin") {

				return "coin";
			}
			return true; // Collision detected
		}
		return false; // No collision
	};

	this.div = document.createElement("div");
	this.div.id = this.id;
	this.div.className = "block";
	this.div.style.width = clientWidth;
	this.div.style.height = clientHeight;
	this.div.style.position = "absolute";
	this.div.style.left = this.pos.x + "px";
	this.div.style.top = this.pos.y + "px";
	this.div.style.zIndex = -5;
	this.div.style.backgroundImage = "url('" + img + "')";
	this.div.style.backgroundSize = imgX + "% " + imgY + "%";
	document.body.appendChild(this.div);

	

	this.update();
}

/* adds water objects to objectBlocks stack */

objectBlocks.push(
	new MyObject(
		0,
		0,
		clientWidth,
		clientHeight * 0.09,
		"./imgs/tWater.png",
		"block",
		5,
		100
	)
); //top water
objectBlocks.push(
	new MyObject(
		0,
		clientHeight - clientHeight * 0.07,
		clientWidth,
		clientHeight * 0.09,
		"./imgs/bwater.png",
		"block",
		5,
		100
	)
); // bottom water
objectBlocks.push(
	new MyObject(
		-(clientWidth * 0.02),
		0,
		clientWidth * 0.05,
		clientHeight,
		"./imgs/water.png",
		"block",
		100,
		7
	)
); // left water
objectBlocks.push(
	new MyObject(
		clientWidth - clientWidth * 0.03,
		0,
		clientWidth * 0.05,
		clientHeight,
		"./imgs/water.png",
		"block",
		100,
		7
	)
); // right water
objectBlocks.push(
	new MyObject(
		clientWidth * 0.1,
		clientHeight * 0.25,
		clientWidth * 0.075,
		clientHeight * 0.5,
		"./imgs/wall.png",
		"block",
		100,
		33.333
	)
); //wall
objectBlocks.push(
	new MyObject(
		clientWidth * 0.78,
		clientHeight * 0.45,
		clientWidth * 0.05,
		clientHeight * 0.3333,
		"./imgs/wall.png",
		"block",
		160,
		50
	)
); //wall
objectBlocks.push(
	new MyObject(
		clientWidth * 0.78,
		clientHeight * 0.37,
		clientWidth * 0.2,
		clientHeight * 0.09,
		"./imgs/wall.png",
		"block",
		50,
		150
	)
); //wall
objectBlocks.push(
	new MyObject(
		clientWidth * 0.5,
		0,
		clientWidth * 0.06,
		clientHeight * 0.37,
		"./imgs/water.png",
		"block",
		100,
		20
	)
); // Tmiddle water
objectBlocks.push(
	new MyObject(
		clientWidth * 0.5,
		clientHeight - clientHeight * 0.37,
		clientWidth * 0.06,
		clientHeight * 0.37,
		"./imgs/water.png",
		"block",
		100,
		20
	)
); // Bmiddle water
objectBlocks.push(
	new MyObject(
		clientWidth * 0.5,
		0,
		clientWidth * 0.06,
		clientHeight * 0.05,
		"./imgs/waterB.png",
		"block",
		100,
		100
	)
);
objectBlocks.push(
	new MyObject(
		clientWidth * 0.5,
		clientHeight - clientHeight * 0.05,
		clientWidth * 0.06,
		clientHeight * 0.05,
		"./imgs/waterB.png",
		"block",
		100,
		100
	)
);
objectBlocks.push(
	new MyObject(
		0,
		clientHeight - clientHeight * 0.04,
		clientWidth * 0.06,
		clientHeight * 0.04,
		"./imgs/waterB.png",
		"block",
		100,
		100
	)
);
objectBlocks.push(
	new MyObject(
		0,
		0,
		clientWidth * 0.06,
		clientHeight * 0.06,
		"./imgs/waterB.png",
		"block",
		100,
		100
	)
);
objectBlocks.push(
	new MyObject(
		clientWidth - clientWidth * 0.06,
		clientHeight - clientHeight * 0.04,
		clientWidth * 0.06,
		clientHeight * 0.04,
		"./imgs/waterB.png",
		"block",
		100,
		100
	)
);
objectBlocks.push(
	new MyObject(
		clientWidth - clientWidth * 0.06,
		0,
		clientWidth * 0.06,
		clientHeight * 0.06,
		"./imgs/waterB.png",
		"block",
		100,
		100
	)
);

for (var i = 0; i < 4; ++i) {
	objectBlocks.push(
		new MyObject(
			getRandomIntInclusive(
				clientWidth * 0.05,
				clientWidth - clientWidth * 0.05
			),
			getRandomIntInclusive(
				clientHeight * 0.09,
				clientHeight - clientHeight * 0.09
			),
			clientWidth * 0.03,
			clientHeight * 0.07,
			"./imgs/Cheese.png",
			"med",
			100,
			100
		)
	);
}
for (var i = 0; i < 6; ++i) {
	objectBlocks.push(
		new MyObject(
			getRandomIntInclusive(
				clientWidth * 0.05,
				clientWidth - clientWidth * 0.05
			),
			getRandomIntInclusive(
				clientHeight * 0.09,
				clientHeight - clientHeight * 0.09
			),
			clientWidth * 0.03,
			clientHeight * 0.07,
			"./imgs/coin.png",
			"coin",
			100,
			100
		)
	); //36 /32
}
var socket = io();
$(function () {
	var players = [];
	$("#chatForm").submit(function () {
		var emitMSG = {
			name: player.name,
			message: $("#chatTextBox").val()
		}

		socket.emit("chat message", emitMSG);
		$("#chatTextBox").val("");
		return false;
	});
	socket.on("chat message", function (msg) {
		$("#messages").append($("<li>").text(msg));
	});
});

/*socket.on("input info", function (users){
		if(players[socket.id]){
			x = document.getElementById(socket.id);
			x.style.left = users.x + "px";
			x.style.top = users.y + "px";
		} else{
			players[socket.id] = users;

			$(function () {

			//$("body").append('<div id=" + ' + socket.id +  '" class="player facingRight"></div>');
		};
		};
	});*/

	//socket.on("disconnected", function(users){
	//	remove players[socket.id];
//	});
