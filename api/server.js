const express = require('express');
const https = require('https');
const fs = require('fs');
const privateKey  = fs.readFileSync('/etc/letsencrypt/live/dprkmc.com/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/dprkmc.com/fullchain.pem', 'utf8');
const credentials = {key: privateKey, cert: certificate};

/**
 * Controllers (route handlers).
 */
const socketController = require('./controllers/socketController');

/**
 * Create Express server.
 */
const app = express();
let httpsServer = https.createServer(credentials, app);
let io = require('socket.io')(httpsServer);

let globalBattlefieldSocket = null;
let socketArray = [];

io.on('connect', (socket) => {

    socket.name="";
    socket.type="";
    socket.city="";
    socket.game="";

    socketArray.push(socket);

    socket.on('disconnect', () => {
        socketArray.splice(socketArray.indexOf(socket), 1);
    });

    socket.on('identify', (data) => {
        socket.name=data.name;
        socket.type=data.type;
        socket.city=data.city;
        socket.game=data.game;

        if (socket.type=="battlefield") {
            globalBattlefieldSocket=socket;
        }

        if (globalBattlefieldSocket && socket.type === "weaponSystem") {
            globalBattlefieldSocket.emit("joined", socket.id);
        }
    });

    socket.on('move_crosshair', (data) => {
        globalBattlefieldSocket.emit('battlefield_move_crosshair', {'socket':socket.id, 'data': data } );
    });

    socket.on('launch_rocket', (data) => {
        globalBattlefieldSocket.emit('battlefield_launch_rocket', {'socket':socket.id, 'data': data } );
    });

    socket.on('missile_positions', (data) => {
        //console.log(data);
        socket.broadcast.emit('battlefield_missile_positions', data);
    });

    //socket.join('dprkmc');
    socket.broadcast.emit('weaponSystemInfo', 'hi');
    console.log(socket.id + " joined ");
});

httpsServer.listen(8443, () => {
    console.log('https server running. ')
});

module.exports = app;