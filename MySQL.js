const mysql = require('mysql');

var con = mysql.createConnection({ // local server setup on localhost via XAMPP
	host: "localhost",
	user: "F28WP2020",
	password: "F28WP2020",
});

var first = false;

var init = function(){

	if(first){
		return;
	};
first = true;
con.connect(function(err){
	if(err) throw err; 
	console.log("Connected!")

	con.query("CREATE DATABASE IF NOT EXISTS users", function(err, result){
		if(err) throw err;
		console.log("User DB created!")
	});

	var sql = "USE users"
	con.query(sql, function(err, result){
		if(err) throw err;
		console.log("USE users.")
	});
	var sql = "CREATE TABLE IF NOT EXISTS player (username varchar(255), prev_X int, prev_Y int, pos_X int, pos_Y int, direction int, points int, health int, IPAddress varchar(255))";
	con.query(sql, function(err, result){
		if(err) throw err;
		console.log("Player table created.")
	});
});
};

exports.SetUser = function(usr){ // Insert a full player object into player table
	init();
	var sql = "INSERT INTO player(username, prev_X, prev_Y, pos_X, pos_Y, direction, points, health, IPAddress)"
	var values = "VALUES('" + usr.username + "'" + ",'" + usr.prev_X + "','" + usr.prev_Y + "','" + usr.pos_X + "','" + usr.pos_Y + "','" + usr.direction + "','" + usr.points + "','" + usr.health + "','" + usr.IPAddress + "')"
	var total_sql = sql + " " + values
		con.query("USE users;", function(e,r){if(e) throw e});
		con.query(total_sql, function(e,r){
			if(e) throw e;
			console.log(usr.username + " added to SQL.");
		});
};

exports.UpdateUser = function(usr){ // We should only be updating prev_X, prev_Y, pos_X, pos_Y, direction, points, health.
	init();
	var sql = "UPDATE player SET prev_X='" + usr.prev_X + "', prex_Y='" + usr.prev_Y + "', pos_X='" + usr.pos_X + "', pos_Y='" + usr.pos_Y + "', direction='" + usr.direction + "', points='" + usr.points + "', health='" + usr.health + "'";
	var where = "WHERE username='" + usr.username + "';";
	var total_sql = sql + " " + where;
	console.log(total_sql);
		con.query(total_sql, function(e,r){
			console.log("Updated user: " + usr.username);
		});

}