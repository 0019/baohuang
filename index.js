var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

var control = require('./control');

var __dirname = '/Users/Qin_ShiHuang/baohuang';

app.use('/public', express.static(__dirname + '/public'));

app.get('/', function(req, res){
	res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', function(socket) {
	control.addPlayer(socket.id);
	socket.on('disconnect', function() {
		control.deletePlayer(socket.id);
	});
	socket.on('control', function(msg) {
		console.log(socket.id + ' ' + msg);
	});
});

server.listen(3000, function(){
	console.log('alive: 3000');
});

