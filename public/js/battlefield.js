var app = new PIXI.Application(1920, 1080, {backgroundColor : 0x000000});

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function distance(a, b, c, d) {
    var resultValue = Math.sqrt((Math.abs(a - c) ^ 2) + (Math.abs(b - d) ^ 2));
    return resultValue;
}


var cities = {
    seoul: {
        flag: 'img/seoul.png',
        x: 50,
        y: 1050
    },
    losangeles:{
        flag: 'img/losangeles.png',
        x: 50,
        y: 1050
    },
    tokyo:{
        flag: 'img/tokyo.png',
        x: 50,
        y: 1050
    },
    dc:{
        flag: 'img/dc.png',
        x: 50,
        y: 1050
    },
    daytonabeach:{
        flag: 'img/daytonabeach.png',
        x: 50,
        y: 1050
    },
};

var battlefield = {
    level: [1,2,3],
    rockets:[],
    missiles:[],
    animations:[],
    hairs:[],
    battlefieldWidth: window.innerWidth,
    battlefieldHeight: window.innerHeight,
    viewerSocket: null,
    init: function() {
        document.body.appendChild(app.view);
        cities.seoul.x = (battlefield.battlefieldWidth/5) * 0 + (battlefield.battlefieldWidth/5)/4;
        cities.tokyo.x = (battlefield.battlefieldWidth/5) * 1 + (battlefield.battlefieldWidth/5)/4;
        cities.losangeles.x = (battlefield.battlefieldWidth/5) * 2 + (battlefield.battlefieldWidth/5)/4;
        cities.dc.x = (battlefield.battlefieldWidth/5) * 3 + (battlefield.battlefieldWidth/5)/4;
        cities.daytonabeach.x = (battlefield.battlefieldWidth/5) * 4 + (battlefield.battlefieldWidth/5)/4;
        battlefield.addCities();
    },
    addCities: function(){
        for(var prop in cities){
            console.log(cities[prop].flag);
            var bunny = PIXI.Sprite.fromImage(cities[prop].flag);
            cities[prop].y = battlefield.battlefieldHeight -107;
            bunny.x = cities[prop].x;
            bunny.y = cities[prop].y;
            cities[prop].bunnyRef = bunny;
            app.stage.addChild(bunny);
        }
    },
    addRocket: function(sx,sy,destx,desty) {

        var dx=(destx-sx)/100;
        var dy=(desty-sy)/100;

        var bunny = PIXI.Sprite.fromImage('img/rocket.png');

        bunny.anchor.set(0.5);

        bunny.x = sx;
        bunny.y = sy;
        bunny.destX=destx;
        bunny.destY=desty;
        bunny.dx = dx;
        bunny.dy = dy;
        bunny.rotation = 0.0;
        battlefield.rockets.push(bunny);
        app.stage.addChild(bunny);

    },
    addMissile: function() {
        var bunny = PIXI.Sprite.fromImage('img/missile.png');
        var randomCity = Math.floor(Math.random() * 5);
        bunny.x = Math.random() * battlefield.battlefieldWidth;
        bunny.y = -100;
        bunny.destX=Math.random() * battlefield.battlefieldWidth;
        bunny.destY= 1080;
        bunny.dx = (bunny.destX-bunny.x)/(500+Math.random()*250);
        bunny.dy = (bunny.destY-bunny.y)/(500+Math.random()*250);
        battlefield.missiles.push(bunny);
        app.stage.addChild(bunny);
    },
    destroyMissles: function(x,y){
        for (var i=0;i<battlefield.missiles.length;i++){
            var obj = battlefield.missiles[i];
            if(distance(x, y, obj.x,obj.y) < 5){
                obj.y = battlefield.battlefieldHeight;
            }
        }
    },
    explosion: function(x,y){

    },
    moveRockets: function() {
        for (var i=0;i<battlefield.rockets.length;i++){
            var obj=battlefield.rockets[i];
            obj.x+=obj.dx;
            obj.y+=obj.dy;
            if (distance(obj.x,obj.y,obj.destX,obj.destY)<5) {
                battlefield.destroyMissles(obj.x, obj.y);
                obj.y=-100;
                console.log("boom"); // todo actually remove items from stage
            }
        }
    },
    moveMissiles: function() {
        for (var i=0;i<battlefield.missiles.length;i++){
            var obj = battlefield.missiles[i];
            obj.x+=obj.dx;
            obj.y+=obj.dy;
            if(obj.y > (battlefield.battlefieldHeight-100) && obj.y < (battlefield.battlefieldHeight + 100) ){
                for(var prop in cities){
                    if((obj.x > cities[prop].x) && (obj.x < (cities[prop].x + 180))){
                        console.log("booom");
                        cities[prop].bunnyRef.y += 50;
                        obj.y = battlefield.battlefieldHeight+500;
                    }
                }
            }
        }
    },
    addCrosshair: function(socketid, x, y){
        var bunny = PIXI.Sprite.fromImage('img/cross.png');
        bunny.x = x;
        bunny.y = y;
        bunny.socketid = socketid;
        battlefield.hairs.push(bunny);
        app.stage.addChild(bunny);
    },
    startGame: function() {
        setInterval(function(){ battlefield.addMissile() }, 1000);
        // Listen for animate update
        app.ticker.add(function(delta) {
            battlefield.moveRockets();
            battlefield.moveMissiles();
        });
    }
};

$( document ).ready(function() {

    $(window).resize(function(){
        battlefield.battlefieldWidth = window.innerWidth;
        battlefield.battlefieldHeight = window.innerHeight;
    });
    battlefield.init();

    battlefield.startGame();
    var clientInfo = {
        name: Date.now()+Math.floor(Math.random()),
        type: 'battlefield',
        city: 'battlefield',
        game: getParameterByName('game')
    };
    var socket = io.connect("https://dprkmc.com:8443");

    socket.on('connect', function () {

        console.log("connected...");

        socket.emit('identify', clientInfo);

        socket.on('joined', function(socketid){
            console.log('were u at' + socketid);
            battlefield.addCrosshair(socketid,500,400);
        });

        socket.on('disconnect', function (data) {
            battlefield.viewerSocket = null;
        });

        socket.on('info', function (data) {
            console.log("info:" + JSON.stringify(data));
        });

        socket.on('battlefield_move_crosshair', function(data){
            console.log('crosshair update ' +  battlefield.hairs.length);
            for (var i=0;i<battlefield.hairs.length;i++){
                var obj=battlefield.hairs[i];
                console.log(obj.socketid + " data " + data.data.socketid);
                if (obj.socketid == data.data.socketid){
                    console.log("boom found " + JSON.stringify(data));
                    obj.x = 0+data.data.x;
                    obj.y = 0+data.data.y;
                }
            }
        });

        socket.on('battlefield_launch_rocket', function(data){
            var px = data.data.x / data.data.w;
            var py = data.data.y / data.data.h;
            battlefield.addRocket(battlefield.battlefieldWidth/2, battlefield.battlefieldHeight-50, px*battlefield.battlefieldWidth, py*battlefield.battlefieldHeight);
        });

    });

});