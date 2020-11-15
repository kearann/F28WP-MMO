
document.body.style.backgroundImage  = "url(./imgs/bg.png)";
document.body.style.backgroundRepeat = "repeat";
var clientHeight = document.body.clientHeight;
var clientWidth = document.body.clientWidth;


var player = {
	id: "user",
	prev:{x:700, y:300}, 
	pos: {x:700, y:300},
	prev: {x:300, y:100},
	size: {x:10, y:10},
	dir: {x:0, y:0},
	points: 0,
	health: 100
}



player.size.x = document.getElementById("user").offsetWidth;	
player.size.y = document.getElementById("user").offsetHeight;



document.onkeydown = keyDown;



function keyUp(e)
{
	var obj = document.getElementById( "user" );	
	obj.classList.add( "stopped" );
		
}

document.onkeyup = keyUp;


function keyDown(e) {

    e = e || window.event;	//if e doesn't exist in browser version use the window.event

	
	
	var object = {x:0, y:0};
	
	var steps = 10;
	var obj = document.getElementById( player.id );
    if (e && e.keyCode == '38') { object.y -= steps; obj.style.background = "transparent url('imgs/right.png') 0 0 no-repeat";} // up arrow  
    if (e && e.keyCode == '40') { object.y += steps;obj.style.background = "transparent url('imgs/right.png') 0 0 no-repeat"; } // down arrow
    if (e && e.keyCode == '37') { object.x -= steps; obj.style.background = "transparent url('imgs/left.png') 0 0 no-repeat";} // left arrow
    if (e && e.keyCode == '39') { object.x += steps; obj.style.background = "transparent url('imgs/right.png') 0 0 no-repeat";} // right arrow
	if (e && e.keyCode == '27') { // esc key
		showPopup(pause); 
	}
	
	
	player.prev.x = player.pos.x;	//saves previous position before player is moved
	player.prev.y = player.pos.y;
	
	player.pos.x += object.x;	//moves player by the value of object x and y values
	player.pos.y += object.y;
	
	
	
	var obj = document.getElementById( player.id );
	obj.style.left = player.pos.x + "px";
	obj.style.top  = player.pos.y + "px";
	
	for (var ii=0; ii<objectBlocks.length; ii++)
	{
		var div = document.getElementById(objectBlocks[ii].id);
		document.getElementById("health").innerHTML = "Health: " + (player.health) + "/100";
		document.getElementById("points").innerHTML = "Points: " +(player.points);
		if((objectBlocks[ii].detectCollision(player.id, player, player.dimensions))=="med" || (objectBlocks[ii].detectCollision(player.id, player, player.dimensions))=="coin"){
			div.style.left = getRandomIntInclusive(50, document.body.clientWidth-50)+"px";
			div.style.top = getRandomIntInclusive(50, document.body.clientHeight-50)+"px";
		};
	}
	
	obj.style.left = player.pos.x + "px";	//updates player position incase it was changed by detectCollision
	obj.style.top  = player.pos.y + "px";
	
	
	
	
	if ( e )
	{
		obj.classList.remove( "stopped" );	//if button pressed remove stopped from class name which will start animation
	}
	
}

// no scroll bars
document.documentElement.style.overflow = 'hidden';  // firefox, chrome
document.body.scroll = "no"; // ie only











popupStack = []

function showPopup( str )
{
	popupStack.push( str )	//adds html code for new menu screen to stack of previous menus
	
	var bb = document.getElementById( "popupbody");	
	bb.innerHTML = str;	//adds html code for menu screen to popupbody div
	
	
	var dd = document.getElementById( "menuContainer" );
	dd.className = "show";	//changes the class of the menu container so it is no longer hidden
}

function closePopup()
{
	var prevMenu = popupStack.pop();	//removes top element in stack of previous menu screens
	
	if ( popupStack.length <= 0 )	
	{
		var dd = document.getElementById( "menuContainer" );	
		dd.className = "";	//if there are no more previous menu screens in stack hide container by removing class
		
		return;
	}
	
	prevMenu = popupStack.pop();	//removes top menu code in stack and stores it in variable prevMenu

	
	showPopup( prevMenu );	//sends code of previous menu screen to showPopup() to display on screen
	
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
			<button class="button" onclick="closePopup();">Play</button>
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

showPopup(play);




var objectBlocks = [];

keyDown(null);
keyUp(null);





function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
}



var clientHeight = document.body.clientHeight;
var clientWidth = document.body.clientWidth;




var newId = 0;	//variable to hold the next new ID number
function MyObject (xx, yy, clientWidth, clientHeight, img, type) {
	this.id      = 'ids' + newId;	
	this.pos     = {x:xx,  y:yy};
	this.prevPos = {x:xx,  y:yy};	
	this.type	 = type;
	newId += 1;	//increment newId by 1 to next id number

	this.update = function()
	{
		this.div.style.left = this.pos.x + 'px';
		this.div.style.top  = this.pos.y + 'px';
	}
	
	this.detectCollision = function(playerID, player, dimensions,type)
	{
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
		
		var xDiff = ((playerLeft+(playerWidth/2)) - (objectLeft+(objectWidth/2)));
		var yDiff = ((playerTop+(playerHeight/2)) - (objectTop+(objectHeight/2)));
		
		var xSize = (playerWidth+objectWidth)/2;
		var ySize = (playerHeight+objectHeight)/2;
		
		
		if ( Math.abs(yDiff) < Math.abs(ySize)  && 
  		     Math.abs(xDiff) < Math.abs(xSize) )
		{
			if (this.type=='water'){
				player.pos.y = player.prev.y;	//if user collides with water stop them from moving further
				player.pos.x = player.prev.x;
			}
			else if (this.type=='med'){
				player.health += 25;	
				if (player.health>100){player.health = 100;}	//if user collides with med kit increase health by 25 (max 100pts)
				return 'med';	
			}
			else if (this.type=='coin'){
				player.points += 25;	//if user collides with a coin increase points by 25 
				return 'coin';
				
				
			}
			return true; // Collision detected
		}
		return false; // No collision
	}
	
	this.div                = document.createElement("div"); 
	this.div.id             = this.id;
	this.div.className      = "block";
	this.div.style.width    = clientWidth;
	this.div.style.height   = clientHeight;
	this.div.style.position = "absolute";
	this.div.style.left     = this.pos.x + "px";
	this.div.style.top      = this.pos.y + "px";
	this.div.style.zIndex   = -5;
	this.div.style.backgroundImage = "url('"+img+"')";
	document.body.appendChild(this.div);
	
	this.dimensions = {x: this.div.style.offsetWidth, y: this.div.style.offsetHeight };
	
	this.update();
}





/* adds water objects to objectBlocks stack */

objectBlocks.push( new MyObject(-20,   -20, clientWidth+40, 40, './imgs/water.png','water') );
objectBlocks.push( new MyObject(-20, clientHeight-20, clientWidth+40, 40, './imgs/water.png','water') );
objectBlocks.push( new MyObject(-20,   -20, 40,    clientHeight+40, './imgs/water.png','water') );
objectBlocks.push( new MyObject(200,   100, 70,    clientHeight-400, './imgs/wall.png','water') );	
objectBlocks.push( new MyObject(800,   20, 70,    clientHeight-500, './imgs/water.png','water') );
objectBlocks.push( new MyObject(800,   500, 70,    clientHeight-200, './imgs/water.png','water') );
objectBlocks.push( new MyObject(clientWidth-20,   -20, 40,    clientHeight+40, './imgs/water.png','water') );
for (var i=0; i<3; ++i){
	objectBlocks.push( new MyObject(getRandomIntInclusive(50, document.body.clientWidth-50),   getRandomIntInclusive(50, document.body.clientHeight-50 ), 60, 40, './imgs/med.png','med') );
}
for (var i=0; i<5; ++i){
	objectBlocks.push( new MyObject(getRandomIntInclusive(50, document.body.clientWidth-50),   getRandomIntInclusive(50, document.body.clientHeight-50 ), 40, 40, './imgs/coin.png','coin') );
}






