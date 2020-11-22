var app = require('express')();
var http = require('http').createServer(app);
require('child_process').fork('MySQL.js');

app.get('/', (req, res) => {
	res.sendFile('game.html', { root: '.' });
});

app.get('/script.js', (req, res) => {
	res.sendFile('script.js', { root: '.'});
})

http.listen(3000, () => {
	console.log("Listening on port: 3000!");
});