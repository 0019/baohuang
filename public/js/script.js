var socket = io();

$('#ready').click(function() {
	socket.emit('control', 'ready');
});
