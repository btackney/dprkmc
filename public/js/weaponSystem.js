$(document).ready(function() {
    var socket = io.connect("https://dprkmc.com:8443");
    socket.emit('connection', function(result){
        console.log("connect" + result);
    })
});