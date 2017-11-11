const express = require('express');
const https = require('https');
const fs = require('fs');
const privateKey  = fs.readFileSync('/etc/letsencrypt/live/dprkmc.com/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/dprkmc.com/fullchain.pem', 'utf8');
const credentials = {key: privateKey, cert: certificate};
/**
 * Create Express server.
 */
const app = express();
// let httpServer = http.createServer(app);
let httpsServer = https.createServer(credentials, app);
let io = require('socket.io')(httpsServer);

io.on('connection', function(socket){
    console.log('a user connected' + socket.id);
});


httpsServer.listen(8443, () => {
    console.log('https server running. ')
});

module.exports = app;