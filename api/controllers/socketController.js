let socketArray = [];

exports.connected = (socket) => {
    console.log('new connection socket id:' + socket.id);

    socketArray.push(socket);
    socket.emit('connected', socket.id);
};

exports.broadCastInfo = () => {

};