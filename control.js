var exports;

var numOfPlayers = 0;
var players = {};

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

function Player() {
}

module.exports = exports;
