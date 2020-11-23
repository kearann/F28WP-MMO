const express = require('express');
const app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
require('child_process').fork('MySQL.js');

app.use(express.static('client'));

io.on('connection', function(socket){
	socket.on('chat message', function(msg){
	  io.emit('chat message', msg);
	});
  });
const sql_server = require("./MySQL.js")
app.use(express.static('client'));

var player = {
	prev_X:700, 
	prev_Y: 300,
	pos_X: 700,
	pos_Y: 300,
	direction: 90,
	points: 101,
	health: 100,
	username: "Jeff",
	IPAddress: "localhost"
};

sql_server.SetUserAll(player);




app.listen(3000, function() {
	console.log("Listening on port: 3000!");
});