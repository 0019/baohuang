var exports;

var numOfPlayers = 0;
var players = {};
var playerOrder;
var firstToPick;

exports.addPlayer = (id) => {
	if (numOfPlayers == 5) {
		return;
	}
	if (players[id] == null) {
		players[id] = new Player();
		numOfPlayers++;
		console.log(id);
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
	for (var i = 168, j = firstToPick; i > 0; i--, j++) {
		var rad = Math.floor(Math.random() * i);
		var card = cards[rad] == undefined ? rad : cards[rad];
		players[playerOrder[j % numOfPlayers]].addCard(card);
		cards[rad] = cards[i - 1] ? cards[i - 1] : i - 1;
	}
}

function sendCards(io) {
	for (var playerid in players) {
		io.to(playerid).emit('cards', players[playerid].cards);
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
	if (realValue < 11) {
		return realValue;
	} else {
		switch (realValue) {
			case 11: return 'J';
			case 12: return 'Q';
			case 13: return 'K';
			case 14: return 'A';
			case 15: return '2';
			case 16: if (value == 163) return '保'; else return '小王'; // Guard, Black Joker
			case 17: if (value == 167) return '皇'; else return '大王'; // Emperor, Red Joker
		}
	}
}

function Player() {
	this.cards = {};
	this.emperor = false;
	this.guard = false;
	var addCard = (value) => {
		var card = new Card(value);
		if (card.name == '皇') this.emperor = true;
		if (card.name == '保') this.guard = true;
		this.cards[card.name] = this.cards[card.name] ? this.cards[card.name] + 1 : 1;
	};
	this.addCard = addCard;
	this.ready = false;
}

function Card(value) {
	this.value = getCardValue(value);
	this.name = getCardName(value, this.value);
}

module.exports = exports;
