var control = require('./control');
var playerToGo;
var lastHand;

function game(io, socket, msg) {
	if (socket.id != control.playerOrder[playerToGo]) {
		socket.emit('wrongturn');
		return;
	} 
	if (msg == 'pass') {
	} else if (msg == 'gone') {
	} else {
	}
}
