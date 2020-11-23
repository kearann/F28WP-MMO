const express = require('express');
const app = express();
var path = require('path');
const sql_server = require("./MySQL.js");
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

sql_server.SetUser(player);

player.prev_Y = 111;
player.prev_X = 222;
player.pos_Y = 333;
player.pos_X = 444;
direction = 180;

sql_server.UpdateUser(player);




app.listen(3000, () => {
	console.log("Listening on port: 3000!");
});