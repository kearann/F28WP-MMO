
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
	direction: 90,
	points: 0,
	health: 100,
	name:null
}



player.size.x = document.getElementById("user").offsetWidth;	
player.size.y = document.getElementById("user").offsetHeight;



document.onkeydown = keyDown;





/* 

*******************************ADDED CODE*********************************

*/






/*

*******************************ADDED CODE*********************************
*/






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
    if (e && e.keyCode == '38') { object.y -= steps; obj.style.background = "transparent url('imgs/right.png') 0 0 no-repeat"; player.direction = 0;} // up arrow  
    if (e && e.keyCode == '40') { object.y += steps;obj.style.background = "transparent url('imgs/right.png') 0 0 no-repeat"; player.direction = 180; } // down arrow
    if (e && e.keyCode == '37') { object.x -= steps; obj.style.background = "transparent url('imgs/left.png') 0 0 no-repeat";player.direction = 270;} // left arrow
    if (e && e.keyCode == '39') { object.x += steps; obj.style.background = "transparent url('imgs/right.png') 0 0 no-repeat";player.direction = 90;} // right arrow
	if (e && e.keyCode == '32') {id=new bullet(player.pos.x+30, player.pos.y+35, 10, 20, './imgs/bullet.png',player.direction); id.moveBullet();} // up arrow
	if (e && e.keyCode == '27') { // esc key
		showPopup(pause); 
	}
	
	
	player.prev.x = player.pos.x;	//saves previous position before player is moved
	player.prev.y = player.pos.y;
	
	player.pos.x += object.x;	//moves player by the value of object x and y values
	player.pos.y += object.y;
	
	
	
	
	
	
	
	
	if ( e && (e.keyCode == '38' || e.keyCode == '40' || e.keyCode == '37' || e.keyCode == '39'))
	{
		obj.classList.remove( "stopped" );	//if button pressed remove stopped from class name which will start animation
		var obj = document.getElementById( player.id );
	obj.style.left = player.pos.x + "px";
	obj.style.top  = player.pos.y + "px";
	var update=false;	//creates variable to hold whether the powerups have been moved or not
	for (var ii=0; ii<objectBlocks.length; ii++)
	{	
		var div = document.getElementById(objectBlocks[ii].id);
		document.getElementById("health").innerHTML = "Health: " + (player.health) + "/100";
		document.getElementById("points").innerHTML = "Points: " +(player.points);
		if((objectBlocks[ii].detectCollision(player.id, player, player.dimensions))=="med" || (objectBlocks[ii].detectCollision(player.id, player, player.dimensions))=="coin"){
			div=moveDiv(true,div,ii);	//Calls function that will move the div to new location
		}	
	}
	
	obj.style.left = player.pos.x + "px";	//updates player position incase it was changed by detectCollision
	obj.style.top  = player.pos.y + "px";
	}
	
}

// no scroll bars
document.documentElement.style.overflow = 'hidden';  // firefox, chrome
document.body.scroll = "no"; // ie only

//***START OF ADDED CODE***

function loopObjects(){
	for (var ii=0; ii<objectBlocks.length; ii++)
	{	
		var div = document.getElementById(objectBlocks[ii].id); 
		if(objectBlocks[ii].type!='water'){
			div=moveDiv(false,div,ii);	//Calls function that will move the div to new location
		}
	}
}

function moveDiv(moved,div,ii)
{
	if (moved){
	div.style.left = getRandomIntInclusive(50, document.body.clientWidth-50)+"px";
	div.style.top = getRandomIntInclusive(50, document.body.clientHeight-50)+"px";
	}	
	var update =true;
	while (update){	//while new div position is unsuitable
			for (var count=0; count<objectBlocks.length; count++)
			{
				if((objectBlocks[count].detectOverlap(objectBlocks[ii].id,objectBlocks[ii].type))){	//if new position of div is unsuitable (overlaps with blocking object) then it is moved again
					div.style.left = getRandomIntInclusive(50, document.body.clientWidth-50)+"px";
					div.style.top = getRandomIntInclusive(50, document.body.clientHeight-50)+"px";
				}
				else{
					update=false;	//if div has been moved to suitable position then loop can end
				}
			}
		}

	return div;
}

function getData(){
	var name=document.forms["username"]["uName"].value;
	player.name=name;
	
}

//***END OF ADDED CODE***




popupStack = []

function showPopup( str )
{
	popupStack.push( str )	//adds html code for new menu screen to stack of previous menus
	
	var bb = document.getElementById( "popupbody");	
	bb.innerHTML = str;	//adds html code for menu screen to popupbody div
	
	
	var dd = document.getElementById( "menuContainer" );
	dd.className = "show";	//changes the class of the menu container so it is no longer hidden
}

//***New Code***
function closePopup(all)
{
	i=1;
	if (all!=undefined){
		i=popupStack.length;
	}
	for(var ii=0; ii<i;ii++){
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

//***new code***
var form1 =  `<div class="buttonContainer" style="top:110px;">
			<form name="username" action="*.php" onsubmit="getData();closePopup(1);" >
  <input class="button" style="width:100%;" type="text" id="uName" name="uName" autofocus placeholder="Enter Username">
  <br><br>
  <input class="button" type="submit" value="Submit">
</form> 
			
			</div>`;

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








////////START NEW CODE///////

var bulletId = 0;	//variable to hold the next new ID number
function bullet (xx, yy, clientWidth, clientHeight, img, direction) {
	this.id      = 'bulletids' + bulletId;	
	this.pos     = {x:xx,  y:yy};
	this.startPos = {x:xx,  y:yy};	
	this.angle	 = direction;
	this.dist	=0;
	bulletId += 1;	//increment newId by 1 to next id number


	this.update = function()
	{
		this.div.style.left = this.pos.x + 'px';
		this.div.style.top  = this.pos.y + 'px';
	}
	
	this.moveBullet = function() {
		//window.alert(this.id);
		var axis =null;
		var closest=null;
		if (this.angle==0){
			for (var i=0; i<objectBlocks.length;i++){
				if(((objectBlocks[i].pos.y + parseInt(objectBlocks[i].div.style.height)) < this.pos.y) && (objectBlocks[i].pos.x <= this.pos.x+20) && (objectBlocks[i].pos.x + parseInt(objectBlocks[i].div.style.width)>= this.pos.x+20)&& (closest==null ||((objectBlocks[i].pos.y +parseInt(objectBlocks[i].div.style.height))- this.pos.y > closest))&&(objectBlocks[i].type=='water')){
					closest=(objectBlocks[i].pos.y +parseInt(objectBlocks[i].div.style.height))- this.pos.y+5;
				}
			}
			axis='y';
		} 
		else if (this.angle==180){
			for (var i=0; i<objectBlocks.length;i++){
				if((objectBlocks[i].pos.y  > (this.pos.y+parseInt(this.div.style.height))) && (objectBlocks[i].pos.x <= this.pos.x+20) && (objectBlocks[i].pos.x + parseInt(objectBlocks[i].div.style.width)>= this.pos.x+20)&& (closest==null ||(objectBlocks[i].pos.y- (this.pos.y +parseInt(this.div.style.height)) < closest))&&(objectBlocks[i].type=='water')){
					closest=objectBlocks[i].pos.y - (this.pos.y +parseInt(this.div.style.height))+5;
				}
			}
			axis='y';
		}
		else if (this.angle==90){
			for (var i=0; i<objectBlocks.length;i++){
				if((objectBlocks[i].pos.x  > (this.pos.x+parseInt(this.div.style.width))) && (objectBlocks[i].pos.y <= this.pos.y+20) && (objectBlocks[i].pos.y + parseInt(objectBlocks[i].div.style.height)>= this.pos.y+20)&& (closest==null ||(objectBlocks[i].pos.x- (this.pos.x +parseInt(this.div.style.width)) < closest))&&(objectBlocks[i].type=='water')){
					closest=objectBlocks[i].pos.x - (this.pos.x +parseInt(this.div.style.width))+5;
				}
			}
			axis='x';
		}
		else if (this.angle==270){
			for (var i=0; i<objectBlocks.length;i++){
				if(((objectBlocks[i].pos.x + parseInt(objectBlocks[i].div.style.width))  < this.pos.x) && (objectBlocks[i].pos.y <= this.pos.y+20) && (objectBlocks[i].pos.y + parseInt(objectBlocks[i].div.style.height)>= this.pos.y+20)&& (closest==null ||((objectBlocks[i].pos.x +parseInt(objectBlocks[i].div.style.width))- this.pos.x > closest))&&(objectBlocks[i].type=='water')){
					closest=objectBlocks[i].pos.x +parseInt(objectBlocks[i].div.style.width)- this.pos.x +5;
				}
			}
			axis='x';
		} 
		
 
		var position = 0;
		var move=0;
		var id = setInterval(frame, 5);
		var obj = document.getElementById(this.id);
		function frame() {
			if (position == closest) {
				clearInterval(id);
				obj.remove();
			} 
			else if(position<closest){
				position++;
				move=1;
			}
			else if(position>closest){
				position--;
				move=-1;
				}
			if(axis=='y'){obj.style.top = (parseInt(obj.style.top)+move) + 'px'; } 
			else{obj.style.left = (parseInt(obj.style.left)+move) + 'px'; }
		}
	}
	
	
		
	this.div                = document.createElement("div"); 
	this.div.id             = this.id;
	this.div.className      = "block";
	this.div.style.width    = clientWidth;
	this.div.style.height   = clientHeight;
	this.div.style.position = "absolute";
	this.div.pos     = {x:xx,  y:yy};
	this.div.style.left     = this.pos.x + "px";
	this.div.style.top      = this.pos.y + "px";
	this.div.style.zIndex   = -5;
	this.div.style.backgroundImage = "url('"+img+"')";
	this.div.style.transform = "rotate("+this.angle+"deg)";
	document.body.appendChild(this.div);
	
	this.dimensions = {x: this.div.style.offsetWidth, y: this.div.style.offsetHeight };
	
	this.update();
}
////////END NEW CODE///////









var newId = 0;	//variable to hold the next new ID number
function MyObject (xx, yy, clientWidth, clientHeight, img, type) {
	this.id      = 'ids' + newId;	
	this.pos     = {x:xx,  y:yy};
	this.prevPos = {x:xx,  y:yy};	
	this.type	 = type;
	newId += 1;	//increment bulletId by 1 to next id number

	this.update = function()
	{
		this.div.style.left = this.pos.x + 'px';
		this.div.style.top  = this.pos.y + 'px';
	}
	
	//START OF ADDED CODE
	
	
	this.detectOverlap = function(id1,type)
	{
		
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
			
		var xDiff = ((object1Left+(object1Width/2)) - (object2Left+(object2Width/2)));
		var yDiff = ((object1Top+(object1Height/2)) - (object2Top+(object2Height/2)));
			
		var xSize = (object1Width+object2Width)/2;
		var ySize = (object1Height+object2Height)/2;
			
			
		if ( Math.abs(yDiff) < Math.abs(ySize)  && Math.abs(xDiff) < Math.abs(xSize) )
		{
			if (this.type=='water' && type!='water'){
				return true; // Collision detected
			}
					
			return false;
			}//*/
			return false; // No collision
		}
		
		//END OF ADDED CODE
	
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

objectBlocks.push( new MyObject(-20,   -15, clientWidth+70, 50, './imgs/tWater.png','water') ); //top water
objectBlocks.push( new MyObject(-20, clientHeight-29, clientWidth+70, 50, './imgs/bwater.png','water') ); // bottom water
objectBlocks.push( new MyObject(-50,   27, 100,    clientHeight-47, './imgs/water.png','water') ); // left water
objectBlocks.push( new MyObject(clientWidth-30,   27, 70,    clientHeight-47, './imgs/water.png','water') ); // right water
objectBlocks.push( new MyObject(200,   200, 143,    clientHeight-440, './imgs/wall.png','water') );	//wall 
objectBlocks.push( new MyObject(800,   27, 95,    clientHeight-500, './imgs/water.png','water') );// Tmiddle water
objectBlocks.push( new MyObject(800,   500, 95,    clientHeight-520, './imgs/water.png','water') );// Bmiddle water

for (var i=0; i<3; ++i){
	objectBlocks.push( new MyObject(getRandomIntInclusive(50, document.body.clientWidth-50),   getRandomIntInclusive(50, document.body.clientHeight-50 ), 48, 48, './imgs/Cheese.png','med') );
}
for (var i=0; i<5; ++i){
	objectBlocks.push( new MyObject(getRandomIntInclusive(50, document.body.clientWidth-50),   getRandomIntInclusive(50, document.body.clientHeight-50 ), 54, 48, './imgs/coin.png','coin') ); //36 /32
}






