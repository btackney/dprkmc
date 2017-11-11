var mySocketSaved=null;
var globalMouseIsDown=false;

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

$(document).ready(function() {
    var clientWidth = window.innerWidth;
    var clientHeight = window.innerHeight;
    $(window).resize(function(){
        clientWidth = window.innerWidth;
        clientHeight = window.innerHeight;
    });
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

    window.onmousedown = function(e){
        globalMouseIsDown=true;
    };
    window.onmousemove = function(e) {
        var obj = {};
        obj.x = e.clientX;
        obj.y = e.clientY;
        if (globalMouseIsDown) {
            if (mySocketSaved) {
                console.log('emitted move crosshair ' + obj);
                mySocketSaved.emit("move_crosshair", obj);
            }
        }

    };
    window.onmouseup = function(e){
        globalMouseIsDown=false;
        var obj = {};
        obj.x = e.clientX;
        obj.y = e.clientY;
        obj.w = clientWidth;
        obj.h = clientHeight;
        if (mySocketSaved) {
            mySocketSaved.emit("launch_rocket", obj);
        }
    };
    window.ontouchstart = function(e) {
        globalMouseIsDown=true;
        var pageX =  e.targetTouches[0].pageX ;//: e.pageX,
        var pageY = e.targetTouches[0].pageY ;//: e.pageY;
        var obj = {};
        obj.x = pageX;
        obj.y = pageY;
        if (globalMouseIsDown) {
            if (mySocketSaved) {
                console.log('emitted move crosshair ' + obj);
                mySocketSaved.emit("move_crosshair", obj);
            }
        }

    };
    window.ontouchmove = function(e) {
        var pageX =  e.targetTouches[0].pageX ;
        var pageY = e.targetTouches[0].pageY ;
        var obj = {};
        obj.x = pageX;
        obj.y = pageY;
        if (globalMouseIsDown) {
            if (mySocketSaved) {
                console.log('emitted move crosshair ' + obj);
                mySocketSaved.emit("move_crosshair", obj);
            }
        }
    };
    window.ontouchend  = function(e) {
        var pageX =  e.changedTouches[0].pageX;
        var pageY = e.changedTouches[0].pageY ;
        var obj = {};
        obj.x = pageX;
        obj.y = pageY;
        obj.w = clientWidth;
        obj.h = clientHeight;
        if (mySocketSaved) {
            mySocketSaved.emit("launch_rocket", obj);
        }
    }
});