const express = require('express');
const app = express();
var path = require('path');
require('child_process').fork('MySQL.js');
app.use(express.static('public'));

app.get('/', (req, res) => {
	res.sendFile('game.html', { root: '.' });
});

app.get('/script.js', (req, res) => {
	res.sendFile('script.js', { root: '.'});
});

app.get('/style.css', (req, res) => {
	res.sendFile('style.css', {root: '.'});
});

app.listen(3000, () => {
	console.log("Listening on port: 3000!");
});