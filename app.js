const express = require('express');
const app = express();
var path = require('path');
const sql_server = require("/MySQL.js")
app.use(express.static('client'));




app.listen(3000, () => {
	console.log("Listening on port: 3000!");
});