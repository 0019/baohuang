var socket = io();
var players = [];
var started = false;
var ready = false;
var mycards = [];
var myturn = false;

var activeHand = new Hand([]);

function Hand(cards) {
	var r = 0, b = 0, v = null;
	for (var index in cards) {
		if (cards[index] < 16) {
			v = cards[index];
		} else if (cards[index] == 16) {
			b++;
		} else {
			r++;
		}
	}
	this.r = r;
	this.b = b;
	this.v = v;
	this.length = cards.length;
}
//cards.playCard = null; // removing the default Card.JS method

$(document).on('click', 'img.card', function() {
	var value = $(this).attr('value');
	if ($(this).hasClass('chosen')) {
		if (value < 16) {
			activeHand.length--;
			if (activeHand.length == 0) activeHand.v = null;
		} else if (value == 16) {
			activeHand.length--;
			activeHand.b--;
		} else {
			activeHand.length--;
			activeHand.r--;
		}
		$(this).removeClass('chosen');
	} else {
		if (value < 16) {
			if (activeHand.v == null) {
				activeHand.v = $(this).attr('value');
				activeHand.length++;
			} else if (value != activeHand.v) {
				activeHand = new Hand([value]);
				$('.chosen').removeClass('chosen');
			} else {
				activeHand.length++;
			}
		} else if (value == 16) {
			activeHand.b++;
			activeHand.length++;
		} else {
			activeHand.r++;
			activeHand.length++;
		}
		$(this).addClass('chosen');
	}
	console.log(activeHand);
});

$('#play').click(function() {
	var str = JSON.stringify(activeHand);
	console.log(str);
	socket.emit('game', str);
});

$('#pass').click(function() {
	socket.emit('game', 'pass');
});

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

socket.on('yourturn', function() {
	startTurn();
});

socket.on('cards', function(cards) {
	console.log(cards);
	displayCards(JSON.parse(cards));
});

socket.on('play', function(cards) {
	if (myturn) {
		endTurn();
	} else {

	}
});

function startTurn() {

	myturn = true;
}

function endTurn() {

	myturn = false;
}

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
	document.getElementById('pass').style.display = '';
	document.getElementById('play').style.display = '';
	cards.sort(function(a, b) {
		return b.identifier - a.identifier;
	});
	for (var index in cards) {
		card = cards[index];
		if (card.identifier < 160) {
			$('#mycards').append("<img class='card " + card.value + "' value='" + card.value + "' src='/public/res/cardsJS/cards/" + card.name + ".svg'>");
		} else {
			$('#mycards').append("<img class='card " + card.value + "' value='" + card.value + "' src='/public/res/cardsJS/cards/" + card.name + ".png'>");
		}
	}
}
