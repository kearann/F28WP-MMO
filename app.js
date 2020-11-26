var express = require('express');
var app = express();
var path = require('path');
//const sql_server = require("./MySQL.js");
var http = require('http').Server(app);
var io = require('socket.io')(http);
var leaderboard=[];
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
			stopped: "moving",
		};
		io.emit('new_player', players[socket.id]);
	});
	////////////////////////////////////////////////////////////////////////////
	socket.on('chat message', function (msg) {
		if (msg.name && msg.message) {
			io.emit('chat message', msg.name + ": " + msg.message);
		}
	});
	///////////////////////////////////////////////////////////////////////////
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
	
		players[socket.id].stopped = usr.stopped;
		//io.emit('input info', players[socket.id]);
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
	
	
	
	socket.on('arrow', function(angle){
		var arrow={};
		arrow.x = players[socket.id].x;
		arrow.y = players[socket.id].y;
		arrow.angle = angle;
		arrow.id = socket.id;
		io.emit('fire', arrow);
	})
	
	socket.on('getId', function(){
		if (players[socket.id]){
			socket.emit('returnId',players[socket.id].id);
	}})

	socket.on('hit', function(){
		if (players[socket.id]){
			players[socket.id].health -= 25;
			if (players[socket.id].health <= 0){
				io.emit('dead',players[socket.id]);
				delete players[socket.id];
			}
		
	}})
	/////////////////////////////////////////////////////////////
	socket.on('update', function () {
		io.emit('updated', players);
	});
	
	socket.on('hit block', function (collidePlayer) {
		if (players[socket.id]) {
			players[socket.id].x = collidePlayer.x;
			players[socket.id].y = collidePlayer.y;
		}
	});
	
	socket.on('dead', function(){
		io.emit('user disconnected', players[socket.id]);
		delete players[socket.id];
	})
	
	socket.on('searchLeaderboard', function(){
		for ( var i=0; i<leaderboard.length; i++){
			if (leaderboard[i].id == socket.id){
				var user = {};
				user.rank =i+1;
				user.name =leaderboard[i].username;
				user.points = leaderboard[i].points;
				socket.emit('leadPos', user);
			}
		}})
	
	setInterval(function(){
		leaderboard=[];
		for (var id in players) {
			leaderboard.push(players[id]);
			} 
		leaderboard.sort(function (a, b) {
			return b.points - a.points;
		});
		io.emit('leaderboard',leaderboard.slice(0,4));
	},1000/5)
});

http.listen(3000, function () {
	console.log("Listening on port: 3000!");
});