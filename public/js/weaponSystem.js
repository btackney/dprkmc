var mySocketSaved=null;
var globalMouseIsDown=false;

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}



$(document).ready(function() {

    var clientInfo = {
        name: Date.now()+Math.floor(Math.random()),
        type: 'weaponSystem',
        city: getParameterByName('city'),
        game: getParameterByName('game')
    };

    var socket = io.connect("https://dprkmc.com:8443");
    socket.on('connect', function(){

        mySocketSaved=socket;

        socket.emit('identify', clientInfo);

    });

    window.onmousemove = function(e) {

        var obj = {};
        obj.x = e.clientX;
        obj.y = e.clientY;

        console.log(e.button);

        if (globalMouseIsDown) {
            if (mySocketSaved) {
                console.log('emitted move crosshair ' + obj);
                mySocketSaved.emit("move_crosshair", obj);
            }
        }

    }

    window.onmousedown = function(e){
        globalMouseIsDown=true;
    };

    window.onmouseup = function(e){
        globalMouseIsDown=false;
        var obj = {};
        obj.x = e.clientX;
        obj.y = e.clientY;
        if (mySocketSaved) {
            mySocketSaved.emit("launch_rocket", obj);
        }
    };

});