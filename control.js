var exports;

var numOfPlayers = 0;
var players = {};
var playerOrder;
var firstToGo;

exports.addPlayer = (id) => {
	if (numOfPlayers == 5) {
		return;
	}
	if (players[id] == null) {
		players[id] = new Player();
		numOfPlayers++;
		console.log(players);
	}
}

exports.deletePlayer = (id) => {
	if (players[id] != null) {
		delete players[id];
		numOfPlayers--;
	}
}

exports.control = (io, socket, msg) => {
	if (msg == 'ready') {
		players[socket.id].ready = true;
		startGame(io);
	}
}

function startGame(io) {
	var start = true;
	for (var playerid in players) {
		start &= players[playerid].ready;
	}
	if (start) {
		initiate();
		distributeCards();
		sendCards(io);
		firstMove();
	}
}

function initiate() {
	if (firstToGo == null) {
		playerOrder = Object.keys(players);
		firstToGo = 0;
	}
}

function distributeCards() {
	var numOfCards = Math.floor(168 / numOfPlayers);
	var remainder = 168 % numOfPlayers;
	for (var i = 0; i < 168 - remainder; i++) {
		var index = Math.floor(Math.random() * 4);
		var player = players[playerOrder[index]];
		if (player.cards.length >= numOfCards) {
			i--;
			continue;
		}
		player.addCard(i);
	}
	for (var i = 168 - remainder, j = firstToGo; i < 168; i++, j++) {
		players[j % numOfPlayers].addCard(i);
	}
}

function getCardValue(value) {
	return Math.floor(value / 4) + 6;
}

function getCardName(value, realValue) {
	if (realValue < 11) {
		return realValue;
	} else {
		switch (realValue) {
			case 11: return 'J';
			case 12: return 'Q';
			case 13: return 'K';
			case 14: return 'A';
			case 15: return '2';
			case 16: if (value == 163) return 'G'; else return 'B'; // Guard, Black Joker
			case 17: if (value == 167) return 'E'; else return 'R'; // Emperor, Red Joker
		}
	}
}

function Player() {
	this.cards = [];
	this.emperor = false;
	this.guard = false;
	var addCard = (value) => {
		var card = new Card(value);
		cards.push(card);
		if (card.name == 'E') this.emperor = true;
		if (card.name == 'G') this.guard = true;
	};
}

function Card(value) {
	this.value = getCardValue(value);
	this.name = getCardName(value, this.value);
}

module.exports = exports;
