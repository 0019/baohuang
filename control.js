var game = require('./game');
var exports;

var numOfPlayers = 0;
var players = {};
var playerOrder;
var firstToPick;

exports.addPlayer = (io, socket) => {
	if (numOfPlayers == 5) {
		return;
	}
	if (players[socket.id] == null) {
		players[socket.id] = new Player();
		numOfPlayers++;
		console.log(socket.id);
	}
	syncPlayersinfo(io);
}

function syncPlayersinfo(io) {
	for (var player in players) {
		io.to(player).emit('playersinfo', getPlayersinfo(player));
	}
}

function getPlayersinfo(id) {
	var data = [];
	for (var player in players) {
		if (player != id) {
			data.push(players[player]);
		}
	}
	return data;
}

exports.deletePlayer = (io, socket) => {
	if (players[socket.id] != null) {
		delete players[socket.id];
		numOfPlayers--;
	}
	syncPlayersinfo(io);
}

exports.control = (io, socket, msg) => {
	switch (msg) {
		case 'ready':
			players[socket.id].ready = true;
			syncPlayersinfo(io);
			startGame(io);
			return;
		case 'notready':
			players[socket.id].ready = false;
			syncPlayersinfo(io);
			return;
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
		//firstMove();
	}
}

function initiate() {
	if (firstToPick == null) {
		playerOrder = Object.keys(players);
		firstToPick = 0;
	}
	for (var playerid in players) {
		players[playerid].ready = false;
	}
}

function distributeCards() {
	var cards = [];
	var rad, card, index;
	for (var i = 168, j = firstToPick; i > 0; i--, j++) {
		rad = Math.floor(Math.random() * i);
		card = cards[rad] == undefined ? rad : cards[rad];
		index = j % numOfPlayers;
		players[playerOrder[index]].addCard(card);
		cards[rad] = cards[i - 1] ? cards[i - 1] : i - 1;
		if (card == 167) {
			game.playerToGo = index;
		}
	}
}

function sendCards(io) {
	for (var playerid in players) {
		io.to(playerid).emit('cards', JSON.stringify(players[playerid].cards));
	}
}

function getCardValue(value) {
	if (value < 160) {
		return Math.floor(value / 16) + 6;
	} else if (value < 164) {
		return 16;
	} else {
		return 17;
	}
}

function getCardName(value, realValue) {
	var shape = '', name = '';
	if (value < 160) {
		switch (value % 4) {
			case 0: shape = 'D'; break;
			case 1: shape = 'C'; break;
			case 2: shape = 'H'; break;
			case 3: shape = 'S'; break;
		}
	} else if (value == 163) {
		shape = 'G';
	} else if (value == 167) {
		shape = 'E';
	}
	if (realValue < 11) {
		name = realValue.toString();
	} else {
		switch (realValue) {
			case 11: name = 'J'; break;
			case 12: name = 'Q'; break;
			case 13: name = 'K'; break;
			case 14: name = 'A'; break;
			case 15: name = '2'; break;
			case 16: name = 'B'; break;
			case 17: name = 'R'; break;
		}
	}
	return name + shape;
}

function Player() {
	this.cards = [];
	this.cardsConcise = {};
	//this.emperor = false;
	//this.guard = false;
	var addCard = (value) => {
		var card = new Card(value);
		if (card.name == 'RE') this.emperor = true;
		if (card.name == 'BG') this.guard = true;
		this.cards.push(card);
		if (this.cardsConcise[card.value] != undefined) {
			this.cardsConcise[card.value] = this.cardsConcise[card.value] + 1;
		} else {
			this.cardsConcise[card.value] = 1;
		}
	};
	this.addCard = addCard;
	this.ready = false;
}

function Card(value) {
	this.identifier = value;
	this.value = getCardValue(value);
	this.name = getCardName(value, this.value);
}

module.exports = exports;
