var app = new PIXI.Application(1920, 1080, {backgroundColor : 0x000000});
function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
var battlefield = {

    rockets:[],
    missiles:[],
    animations:[],

    viewerSocket: null,

    init: function() {
        document.body.appendChild(app.view);
    },

    addRocket: function(sx,sy,destx,desty) {

        var dx=(destx-sx)/100;
        var dy=(desty-sy)/100;

        var bunny = PIXI.Sprite.fromImage('img/rocket.png');

        bunny.anchor.set(0.5);

        bunny.x = sx;
        bunny.y = sy;
        bunny.dx = dx;
        bunny.dy = dy;
        bunny.rotation = 0.0;

        battlefield.rockets.push(bunny);

        app.stage.addChild(bunny);

    },

    addMissile: function() {

    },

    moveRockets: function() {

        for (var i=0;i<battlefield.rockets.length;i++){
            var obj=battlefield.rockets[i];
            obj.x+=obj.dx;
            obj.y+=obj.dy;
        }

    },

    moveMissiles: function() {

    },

    render: function() {

    },

    startGame: function() {
        // Listen for animate update
        app.ticker.add(function(delta) {
            battlefield.moveRockets();
        });
    }

};

$( document ).ready(function() {
    var battlefieldWidth = window.innerWidth;
    var battlefieldHeight = window.innerHeight;
    $(window).resize(function(){
        battlefieldWidth = window.innerWidth;
        battlefieldHeight = window.innerHeight;
    });
    battlefield.init();

    battlefield.startGame();
    var clientInfo = {
        name: Date.now()+Math.floor(Math.random()),
        type: 'battlefield',
        city: 'battlefield',
        game: getParameterByName('game')
    };
    var socket = io.connect("https://" + "dprkmc.com" + ":8443");

    socket.on('connect', function () {

        console.log("connected...");

        socket.emit('identify', clientInfo);

        socket.on('joined', function(data){
            console.log(JSON.stringify(data))
        });

        socket.on('disconnect', function (data) {
            battlefield.viewerSocket = null;
        });

        socket.on('info', function (data) {
            console.log("info:" + JSON.stringify(data));
        });

        socket.on('battlefield_move_crosshair', function(data){
            console.log(JSON.stringify(data));
        });

        socket.on('battlefield_launch_rocket', function(data){
            var px = data.data.x / data.data.w;
            var py = data.data.y / data.data.h;
            battlefield.addRocket(1920/2, 1050, px*battlefieldWidth, py*battlefieldHeight);
            console.log(JSON.stringify(data));
        });

    });

});