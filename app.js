var express = require('express');
var app = express();
var path = require('path');
//const sql_server = require("./MySQL.js");
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static('client'));


let players = {};

io.on('connection', function (socket) {
	////////////////////////////////////////////////////////////////////////////
	socket.on('new_players', function (usr) {
		players[socket.id] = {
			id: socket.id,
			username: usr,
			x: 700,
			y: 300,
			direction: "facingRight",
			health: 100,
			points: 0,
		};
		io.emit('new_player', players[socket.id]);
	});
	////////////////////////////////////////////////////////////////////////////
	socket.on('chat message', function (msg) {
		if (msg.name && msg.message) {
			io.emit('chat message', msg.name + " : " + msg.message);
		}
	});
	///////////////////////////////////////////////////////////////////////////
	socket.on('input info', function (usr) {
		if (players[socket.id]) {
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
		}

		//io.emit('input info', players[socket.id]);
	});

	socket.on('hit block', function (collidePlayer) {
		if (players[socket.id]) {
			players[socket.id].x = collidePlayer.x;
			players[socket.id].y = collidePlayer.y;
		}
	});
	///////////////////////////////////////////////////////////////////////////
	socket.on('disconnect', function () {
		io.emit('user disconnected', players[socket.id]);
		delete players[socket.id];

	});


	socket.on('med', function () {
		if (players[socket.id]) {
			players[socket.id].health += 25;
			if (players[socket.id].health > 100) {
				players[socket.id].health = 100;
			}
		}
	});

	socket.on('point', function () {
		if (players[socket.id]) {
			players[socket.id].points += 10;
		}
	})

	/////////////////////////////////////////////////////////////
	socket.on('update', function () {
		io.emit('updated', players);
	});
});

http.listen(3000, function () {
	console.log("Listening on port: 3000!");
});