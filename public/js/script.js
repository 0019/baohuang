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
//	$('.playerready').hide();
	for (var i = 0; i < players.length; i++) {
//		$('#p' + i + ' .playerready').show();
		console.log(players);
		console.log(players[i].ready);
		if (players[i].ready == true) {
			$('#p' + i + ' .playerready').css('background-color', 'green');
			$('#p' + i + ' .playerready').css('color', 'yellow');
		} else {
			$('#p' + i + ' .playerready').css('background-color', '');
			$('#p' + i + ' .playerready').css('color', '');
		}
	}
}
