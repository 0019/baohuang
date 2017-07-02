var socket = io();

$('#ready').click(function() {
	socket.emit('control', 'ready');
});

socket.on('cards', function(cards) {
	console.log(cards);
});
