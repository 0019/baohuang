var control = require('./control');
var playerToGo;
var lastHand;

function game(io, socket, msg) {
	if (socket.id != control.playerOrder[playerToGo]) {
		socket.emit('invalid');
		return;
	} 
	if (msg == 'pass') {
		nextPlayer();
	} else if (msg == 'gone') {
	} else if (isValidHand(msg) && isViableHand(msg, socket.id) && isGreaterThanLastHand(msg)) {
		processTurn(msg, socket.id);
		socket.broadcast.emit('play', JSON.stringify(msg));
	} else {
		socket.emit('invalid');
	}
}

function processTurn(hand, id) {
	var cards = control.players[id].cardsConcise;
	cards[17] -= hand.r;
	cards[16] -= hand.b;
	cards[hand.v] -= hand.length - hand.r - hand.b;
	nextPlayer(hand);
}

function nextPlayer(hand) {
	lastHand = hand;
	playerToGo = (playerToGo + 1) % control.numOfPlayers;
}

function isValidHand(hand) {
	for (var index in hand) {
		if (index != 'r' && index != 'b' && index != 'v' && index != 'length') return false;
	}
	if (hand.v != null && isNaN(parseInt(hand.v))) return false;
	return true;
}

function isViableHand(hand, id) {
	var cards = control.players[id].cardsConcise;
	var enoughCards = (hand.r <= cards[17]) && (hand.b <= cards[16]) && (hand.length - hand.r - hand.b <= cards[hand.v]);
	if (hand.v == 6) {
		return playerOnlyHasSix(id) && enoughCards;
	}
	return enoughCards;
}

function playerOnlyHasSix(id) {
	for (var i = 7; i < 18; i++) {
		if (control.players[id].cardsConcise[i] != 0) return false;
	}
	return true;
}

function isGreaterThanLastHand(hand) {
	if (lastHand == null) return true;
	if (hand.length != lastHand.length) return false;
	if (lastHand.r > 0) return false;
	if (hand.v != null) {
		if (lastHand.v == null || lastHand.v >= hand.v) return false;
	}
	if (hand.r >= lastHand.b) return true;
	if (hand.b > 0 && lastHand.b == 0) return true;
}

function hand(cards) {
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
