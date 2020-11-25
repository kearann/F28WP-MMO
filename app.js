var express = require('express');
var app = express();
var path = require('path');
//const sql_server = require("./MySQL.js");
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static('client'));


var players = [];

io.on('connection', function(socket){

	socket.on('new_player', function(usr){
		players[socket.id] = {
			username: usr,
			x: 700,
			y: 300,
			health: 100,
			points: 0,
		};

	io.emit('new_player', players[socket.id]);
	});

	socket.on('chat message', function(msg){
		var username = players[socket.id].username;
	  io.emit('chat message', username + ": " + msg);
	});

	socket.on('input info', function(usr){

		if(usr.playerDir == "right"){ // x +=
			players[socket.id].x += 5;
		} else if(usr.playerDir == "down"){ //y +=
			players[socket.id].y += 5;
		} else if(usr.playerDir == "left"){ // x -=
			players[socket.id].x -= 5;
		} else if(usr.up == "up"){ // y -=
			players[socket.id].y -= 5;
		}
	});

	socket.on('disconnect', function(){
		delete players[socket.id];
		io.emit('disconnect', players[socket.id]);
	});
  });

http.listen(3000, function() {
	console.log("Listening on port: 3000!");
});