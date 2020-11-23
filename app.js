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

app.listen(3000, function() {
	console.log("Listening on port: 3000!");
});