var socket = io();
var players = [];
var started = false;
var ready = false;
var mycards = [];

$('#ready').click(function() {
	if (!ready) {
		$(this).css('background-color', 'green');
		$(this).css('color', 'yellow');
		socket.emit('control', 'ready');
	} else {
		$(this).css('background-color', '');
		$(this).css('color', '');
		socket.emit('control', 'notready');
	}
	ready = !ready;
});

socket.on('playersinfo', function(data) {
	players = data;
	displayPlayers();
});

socket.on('cards', function(cards) {
	console.log(cards);
	displayCards(JSON.parse(cards));
});

function displayPlayers() {
	var i = 0;
	for (i; i < players.length; i++) {
		if (players[i].ready == true) {
			$('#p' + i + ' .playername').css('background-color', '#36ff33');
		} else {
			$('#p' + i + ' .playername').css('background-color', 'white');
		}
	}
	for (i; i < 4; i++) {
		$('#p' + i + ' .playername').css('background-color', '');
	}
}

function displayCards(cards) {
	$('#ready').hide();
	var str = '', card;
	for (var index in cards) {
		card = cards[index];
		str += "<img class='card' src='/public/res/cardsJS/cards/" + card.name + ".svg'>";
	}
	$('#mycards').html(str);
}
