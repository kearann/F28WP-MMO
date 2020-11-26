//import modules that we for the game
var express = require('express');
var app = express();
var path = require('path');
//const sql_server = require("./MySQL.js");
var http = require('http').Server(app);
var io = require('socket.io')(http);
var leaderboard=[];
app.use(express.static('client'));

// players dictionary to allow us to store user data
let players = {};


//establish a new connection with io, any passing functions are now known as socket.
io.on('connection', function (socket) {
	////////////////////////////////////////////////////////////////////////////
	// When a player enters their username, it is sent and passed here; this allows us to create and store the players new data.
	socket.on('new_players', function (usr) {
		players[socket.id] = {
			id: socket.id,
			username: usr,
			x: 700,
			y: 300,
			direction: "facingRight",
			health: 100,
			points: 0,
			stopped: "moving",
		};
		io.emit('new_player', players[socket.id]);
	});
	////////////////////////////////////////////////////////////////////////////
	// This is the socket we used to allow for chat messages to be senft to the server and emitted back to all clients.
	// We had an issue with this: If we tried players[socket.id].username it would return undefined. As far as I know
	// it was within scope.
	socket.on('chat message', function (msg) {
		if (msg.name && msg.message) { // has user defined their name & is there even a message?
			io.emit('chat message', msg.name + ": " + msg.message); // emit message to all connected clients
		}
	});
	///////////////////////////////////////////////////////////////////////////
	// This socket processes the users inputs and changes their x,y server-sided
	socket.on('input info', function (usr) {

		if (usr.playerDir == "right") { // x +=
			players[socket.id].x += 5;
			players[socket.id].direction = "facingRight";
		} else if (usr.playerDir == "down") { //y +=
			players[socket.id].y += 5;
			players[socket.id].direction = "facingDown";
		} else if (usr.playerDir == "left") { // x -=
			players[socket.id].x -= 5;
			players[socket.id].direction = "facingLeft";
		} else if (usr.playerDir == "up") { // y -=
			players[socket.id].y -= 5;
			players[socket.id].direction = "facingUp";
		}
		if(players[socket.id]){
		players[socket.id].stopped = usr.stopped;
	}
	});
	///////////////////////////////////////////////////////////////////////////
	// When a user disconnects from the game this socket is called. We used this to delete
	// their data from our players dictionary.
	socket.on('disconnect', function () {
		io.emit('user disconnected', players[socket.id]); 
		delete players[socket.id]; // We delete the users data object here

	});

	socket.on('med', function () { // called when a client touches a bit of cheese (health regen)
		if (players[socket.id]) { // does the player have a data entry? 
			players[socket.id].health += 25; // if so, increase health
			if (players[socket.id].health > 100) { // is their health already above 100?
				players[socket.id].health = 100; // we set it to 100.
			}
		}
	});

	socket.on('point', function () { // called when a user gets coins
		if (players[socket.id]) { // does the player have a data entry? 
			players[socket.id].points += 10; // if so, increase points by 10.
		}
	})
	
	
	
	socket.on('arrow', function(angle){ // called when the arrow event is triggered.
		var arrow={}; // arrow object
		arrow.x = players[socket.id].x; // we set arrow.x to the users.x
		arrow.y = players[socket.id].y; // we set arrow.y to the users.y
		arrow.angle = angle; 
		arrow.id = socket.id; // we can now define users arrows by their socket id
		io.emit('fire', arrow); // sent a response back to the client.
	})
	
	socket.on('getId', function(){ // Returns the users player socket id (UID)
		if (players[socket.id]){
			socket.emit('returnId',players[socket.id].id);
	}})

	socket.on('hit', function(){ // socket hit is used to see if an arrow hits a user
		if (players[socket.id]){ // check if user data exists
			players[socket.id].health -= 25; // remove 25 per hit
			if (players[socket.id].health <= 0){ 
				io.emit('dead',players[socket.id]); // emit to clients user is dead
				delete players[socket.id]; // delete user data
			}
		
	}})
	/////////////////////////////////////////////////////////////
	socket.on('update', function () { // socket to update users client-side
		io.emit('updated', players); // triggers updated emit to clients with player dictionary
	});
	
	socket.on('hit block', function (collidePlayer) { // check if user hits a block
		if (players[socket.id]) { // check if user data exists
			players[socket.id].x = collidePlayer.x; // set player x to collidePlayer object
			players[socket.id].y = collidePlayer.y; // set player y to collidePlayer object
		}
	});
	
	socket.on('dead', function(){ // socket to check if user is dead/disconnected
		io.emit('user disconnected', players[socket.id]); // remove user and emit to all clients
		delete players[socket.id]; // delete locally from our dictionary
	})
	
	socket.on('searchLeaderboard', function(){ // leaderboard socket to update it
		for ( var i=0; i<leaderboard.length; i++){ // loop to update leaderboard
			if (leaderboard[i].id == socket.id){ 
				var user = {};
				user.rank =i+1;
				user.name =leaderboard[i].username; 
				user.points = leaderboard[i].points; // set user object to leaderboard object
				socket.emit('leadPos', user); // emit to clients new user object
			}
		}})
	
	setInterval(function(){ // loop to update leaderboard
		leaderboard=[]; // create leaderboard object
		for (var id in players) { // loop to push initial players into leadboard
			leaderboard.push(players[id]); // push players
			} 
		leaderboard.sort(function (a, b) { // sort points
			return b.points - a.points; // comparison to sort points
		});
		io.emit('leaderboard',leaderboard.slice(0,4)); // edit the leaderboard object
	},1000/5) // loop to same as game tick
});

http.listen(3000, function () { // listen on port 3000
	console.log("Listening on port: 3000!");
});
