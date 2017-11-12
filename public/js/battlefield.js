var app = new PIXI.Application(1920,1080);
// create a new background sprite
var background = new PIXI.Sprite.fromImage('img/sky2.png');
background.width = 1920;
background.height = 1080;
app.stage.addChild(background);


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
            cities[prop].y = battlefield.battlefieldHeight - 107;
            bunny.x = cities[prop].x;
            bunny.y = cities[prop].y;
            cities[prop].bunnyRef = bunny;
            app.stage.addChild(bunny);
        }
    },
    addRocket: function(sx,sy,destx,desty) {

        var mx = (destx-sx);
        var my = (desty-sy);
        //var dist = Math.sqrt(mx * mx + my * my);
        var angle = (( (Math.atan2( my, mx ) * 180 )  )/ Math.PI) ;//+ (90/Math.PI);
        angle=angle+90;

        var dx=(destx-sx)/75;
        var dy=(desty-sy)/75;

        angle=angle * (Math.PI/180);

        var aa=angle;
        aa=aa*(180/Math.PI)-90;
        var bunny = PIXI.Sprite.fromImage('img/rocket.png');
        bunny.anchor.set(0.5);
        bunny.x = sx;
        bunny.y = sy;
        bunny.destX=destx;
        bunny.destY=desty;
        bunny.dx = dx;
        bunny.dy = dy;
        bunny.life=Date.now();
        bunny.rotation = angle;
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
        bunny.life=Date.now();
        battlefield.missiles.push(bunny);
        app.stage.addChild(bunny);
    },
    destroyMissiles: function(x,y,obj2){
        for (var i=0;i<battlefield.missiles.length;i++){
            var obj = battlefield.missiles[i];
            if(distance(x, y, obj.x,obj.y) < 8){
                obj.y = battlefield.battlefieldHeight+100;
                obj.life=0;
                obj2.y=-1000;
                battlefield.explosion(x,y);
            }
        }
    },
    explosion: function(x,y){
        // play sound
        ion.sound.play("e");

        for (var i=0;i<15;i++) {
            var bunny = PIXI.Sprite.fromImage('img/explosion.png');
            bunny.x = x;
            bunny.y = y;
            bunny.width=10;
            bunny.height=10;
            bunny.anchor.set(0.5);
            bunny.dx = 8 - Math.floor(Math.random() * 16);
            bunny.dy = 8 - Math.floor(Math.random() * 16);
            bunny.life = Date.now();
            battlefield.animations.push(bunny);
            app.stage.addChild(bunny);
        }
    },
    moveExplosion: function() {
        for (var i=0;i<battlefield.animations.length;i++){
            var obj=battlefield.animations[i];
             obj.x+=obj.dx;
             obj.y+=obj.dy;
         obj.y+=.01*(Date.now()-obj.life);
        }
    },
    removeCrossHair: function(){
      for(var i =0;i< battlefield.hairs.length;i++){
          var obj = battlefield.hairs[i];
          obj.x = battlefield.battlefieldWidth+3000;
      }
    },
    removeDeadFromStageM: function() {
        var missileLifeSpan=15000;
        var nn=Date.now();
        for (var i=battlefield.missiles.length-1;i>=0 ; i--){
            var obj=battlefield.missiles[i];
            if (nn-obj.life>missileLifeSpan) {
                //console.log("dead " );
                for (var j = app.stage.children.length - 1; j >= 0; j--) {
                    if (app.stage.children[j].life) {
                        if ((nn - app.stage.children[j].life) > missileLifeSpan) {
                            app.stage.removeChild(app.stage.children[j]);
                        }
                    }
                };
                battlefield.missiles.splice(i,1);
            }
        }
    },
    removeDeadFromStageE: function() {
        var animationsLifeSpan=2000;
        var nn=Date.now();
        for (var i=battlefield.animations.length-1;i>=0 ; i--){
            var obj=battlefield.animations[i];
            if (nn-obj.life>animationsLifeSpan) {
                //console.log("dead " );
                for (var j = app.stage.children.length - 1; j >= 0; j--) {
                    if (app.stage.children[j].life) {
                        if ((nn - app.stage.children[j].life) > animationsLifeSpan) {
                            app.stage.removeChild(app.stage.children[j]);
                        }
                    }
                };
                battlefield.animations.splice(i,1);
            }
        }
    },
    removeDeadFromStage: function() {
        var rocketlifespan=22222;
        var nn=Date.now();
        for (var i=battlefield.rockets.length-1;i>=0 ; i--){
            var obj=battlefield.rockets[i];
            if (nn-obj.life>rocketlifespan) {
                //console.log("dead " );
                for (var j = app.stage.children.length - 1; j >= 0; j--) {
                    if (app.stage.children[j].life) {
                        if ((nn - app.stage.children[j].life) > rocketlifespan) {
                            app.stage.removeChild(app.stage.children[j]);
                        }
                    }
                };
                battlefield.rockets.splice(i,1);
            }
        }
    },
    moveRockets: function() {
        for (var i=0;i<battlefield.rockets.length;i++){
            var obj=battlefield.rockets[i];
            obj.x+=obj.dx;
            obj.y+=obj.dy;
            battlefield.destroyMissiles(obj.x, obj.y,obj);
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
                        cities[prop].bunnyRef.y += 50;
                        cities[prop].y += 50;
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
        setInterval(function(){ battlefield.addMissile() }, 500);
        setInterval(function(){ battlefield.removeCrossHair() }, 5000);
        // Listen for animate update
        app.ticker.add(function(delta) {
            battlefield.moveRockets();
            battlefield.moveExplosion();
            battlefield.moveMissiles();
            battlefield.removeDeadFromStage();
            battlefield.removeDeadFromStageM();
            battlefield.removeDeadFromStageE();
        });
    }
};

$( document ).ready(function() {

    $(window).resize(function(){
        battlefield.battlefieldWidth = window.innerWidth;
        battlefield.battlefieldHeight = window.innerHeight;
    });
    battlefield.init();

  //  battlefield.startGame();

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
            battlefield.startGame();
            battlefield.addCrosshair(socketid,-999,-999);
        });
        socket.on('disconnect', function (data) {
            battlefield.viewerSocket = null;
        });
        socket.on('info', function (data) {
            console.log("info:" + JSON.stringify(data));
        });
        socket.on('battlefield_move_crosshair', function(data){
            for (var i=0;i<battlefield.hairs.length;i++){
                var obj=battlefield.hairs[i];
                console.log(obj.socketid + " data " + data.data.socketid);
                if (obj.socketid === data.data.socketid){
                    var px = data.data.x / data.data.w;
                    var py = data.data.y / data.data.h;
                    obj.x = battlefield.battlefieldWidth * px;
                    obj.y = battlefield.battlefieldHeight * py;
                }
            }
        });
        socket.on('battlefield_launch_rocket', function(data){
            var px = data.data.x / data.data.w;
            var py = data.data.y / data.data.h;
            var startx = battlefield.battlefieldWidth/2;
            for(var prop in cities){
                if(prop === data.data.city){
                    if(!(cities[prop].y > battlefield.battlefieldHeight)){
                        startx = cities[prop].x + 90;
                        battlefield.addRocket(startx, battlefield.battlefieldHeight-50, px*battlefield.battlefieldWidth, py*battlefield.battlefieldHeight);
                    }
                    else{
                        socket.emit('city_destroyed', {socket: data.socket});
                    }
                }
            }
        });
        setInterval(function(){
            var missilePositions = [];
            for(var i=0;i< battlefield.missiles.length; i++){
                if(battlefield.missiles[i].y > 0 && battlefield.missiles[i].y < 1080){
                    var currentMissile = {
                        x: battlefield.missiles[i].x,
                        y: battlefield.missiles[i].y
                    }
                    missilePositions.push(currentMissile);
                }
            }
            socket.emit('missile_positions', missilePositions)
        }, 500);
    });
});