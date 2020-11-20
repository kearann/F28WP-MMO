const mysql = require('mysql');

var con = mysql.createConnection({ // local server setup on localhost via XAMPP
	host: "localhost",
	user: "F28WP2020",
	password: "F28WP2020",
});

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
	var sql = "CREATE TABLE player (username varchar(255), prev_X int, prev_Y int, pos_X int, pos_Y int, direction int, points int, health int, IPAddress varchar(255))";
	con.query(sql, function(err, result){
		if(err) throw err;
		console.log("Player table created.")
	});
});