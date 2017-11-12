var mySocketSaved=null;
var globalMouseIsDown=false;

var roundRobin=0;

// init bunch of sounds
ion.sound({
    sounds: [
        {name: "beer_can_opening"},
        {name: "bell_ring"},
        {name: "branch_break"},
        {name: "button_click"},
        {name: "e"}
    ],

    // main config
    path: "sounds/",
    preload: true,
    multiplay: true,
    volume: 0.9
});

function isFullScreen() {
    return (document.fullScreenElement && document.fullScreenElement !== null) || document.mozFullScreen || document.webkitIsFullScreen;
}

function requestFullScreen(element) {
    if (element.requestFullscreen)
        element.requestFullscreen();
    else if (element.msRequestFullscreen)
        element.msRequestFullscreen();
    else if (element.mozRequestFullScreen)
        element.mozRequestFullScreen();
    else if (element.webkitRequestFullscreen)
        element.webkitRequestFullscreen();
}

function exitFullScreen() {
    if (document.exitFullscreen)
        document.exitFullscreen();
    else if (document.msExitFullscreen)
        document.msExitFullscreen();
    else if (document.mozCancelFullScreen)
        document.mozCancelFullScreen();
    else if (document.webkitExitFullscreen)
        document.webkitExitFullscreen();
}

function toggleFullScreen(element) {
    if (isFullScreen()) {
        exitFullScreen();
    } else {
        requestFullScreen(element || document.documentElement);
    }
}

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

var weaponSystem = {
    missilePositions: function(data){
       // console.log(data);
    }
}
var clientWidth = window.innerWidth;
var clientHeight = window.innerHeight;
$(document).ready(function() {
     clientWidth = window.innerWidth;
     clientHeight = window.innerHeight;

    $(window).resize(function(){
        clientWidth = window.innerWidth;
        clientHeight = window.innerHeight;
    });

    var socket = io.connect("https://dprkmc.com:8443");
    socket.on('connect', function(){
        var clientInfo = {
            name: Date.now()+Math.floor(Math.random()),
            type: 'weaponSystem',
            city: getParameterByName('city'),
            game: getParameterByName('game')
        };
        mySocketSaved=socket;
        socket.emit('identify', clientInfo);
        socket.on('battlefield_missile_positions', function(data){
            //console.log('battlefield missiles positions'+ data.length);
            $('#display').empty();
            for(var i=0;i<data.length;i++){
                var d="<div style='position:absolute;left:{{left}};top:{{top}};background-color:red;color:blue;'>XXX</div>";
                d=d.replace("{{left}}",( Math.floor(data[i].x)/1920)*clientWidth + "px");
                d=d.replace("{{top}}",( Math.floor(data[i].y)/1080)*clientHeight + "px");
              //  console.log(d);
                $('#display').append(d);
            }
            //console.log(JSON.stringify(data))
        })
        socket.on('city_destroyed_over', function(data) {
            window.location = 'youlose.html';
        })
    });
    // window.onmousedown = function(e){
    //     globalMouseIsDown=true;
    // };
    // window.onmousemove = function(e) {
    //     var obj = {};
    //     obj.x = e.clientX;
    //     obj.y = e.clientY;
    //     obj.w = clientWidth;
    //     obj.h = clientHeight;
    //     obj.socketid=mySocketSaved.id;
    //     if (globalMouseIsDown) {
    //         if (mySocketSaved) {
    //             console.log('emitted move crosshair ' + obj);
    //             mySocketSaved.emit("move_crosshair", obj);
    //         }
    //     }
    // };

    // window.onmouseup = function(e){
    //     globalMouseIsDown=false;
    //     var obj = {};
    //     obj.x = e.clientX;
    //     obj.y = e.clientY;
    //     obj.w = clientWidth;
    //     obj.h = clientHeight;
    //     obj.socketid=mySocketSaved.id;
    //     obj.city = getParameterByName('city');
    //     if (mySocketSaved) {
    //         mySocketSaved.emit("launch_rocket", obj);
    //         ion.sound.play("e");
    //     }
    // };

    window.ontouchstart = function(e) {
        globalMouseIsDown=true;
        var pageX =  e.targetTouches[0].pageX ;//: e.pageX,
        var pageY = e.targetTouches[0].pageY ;//: e.pageY;
        var obj = {};
        obj.x = pageX;
        obj.y = pageY;
        obj.w = clientWidth;
        obj.h = clientHeight;
        obj.socketid=mySocketSaved.id;
        if (globalMouseIsDown) {
            if (mySocketSaved) {
                console.log('emitted move crosshair ' + obj);
                mySocketSaved.emit("move_crosshair", obj);
            }
        }
    };
    window.ontouchmove = function(e) {
        roundRobin++;
        if (roundRobin>5) roundRobin=0;

        var pageX =  e.targetTouches[0].pageX ;
        var pageY = e.targetTouches[0].pageY ;
        var obj = {};
        obj.x = pageX;
        obj.y = pageY;
        obj.w = clientWidth;
        obj.h = clientHeight;
        obj.socketid=mySocketSaved.id;
        if (globalMouseIsDown) {
            if (mySocketSaved) {
                console.log('emitted move crosshair ' + obj);
               if (roundRobin==0) mySocketSaved.emit("move_crosshair", obj);
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
        obj.city = getParameterByName('city');
        if (mySocketSaved) {
            mySocketSaved.emit("launch_rocket", obj);
            ion.sound.play("e");
        }
    }
});