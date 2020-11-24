var express = require('express');
var app = express();
var path = require('path');
//const sql_server = require("./MySQL.js");
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static('client'));

io.on('connection', function(socket){
	socket.on('chat message', function(msg){
	  io.emit('chat message', msg);
	});

	socket.on('up_key', function(usr){

	});

	socket.on('down_key', function(usr){

	});

	socket.on('right_key', function(usr){

	});

	socket.on('left_key', function(usr){

	});
  });

http.listen(3000, function() {
	console.log("Listening on port: 3000!");
});