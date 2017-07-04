var socket = io();
var players = [];
var started = false;

$('#ready').click(function() {
	$(this).css('background-color', 'green');
	$(this).css('color', 'yellow');
	socket.emit('control', 'ready');
});

socket.on('playersinfo', function(data) {
	players = data;
	displayPlayers();
});

socket.on('cards', function(cards) {
	console.log(cards);
});

function displayPlayers() {
	var i = 0;
	for (i; i < players.length; i++) {
		$('#p' + i + ' .playername').css('background-color', 'white');
		console.log(players);
		console.log(players[i].ready);
		if (players[i].ready == true) {
			$('#p' + i + ' .playercard').css('background-color', 'black');
		} else {
			$('#p' + i + ' .playercard').css('background-color', '');
		}
	}
	for (i; i < 4; i++) {
		$('#p' + i + ' .playername').css('background-color', '');
		$('#p' + i + ' .playercard').css('background-color', '');
	}
}
