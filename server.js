'use strict';

const app = require('./src/config/app');
var http = require('http'),
socketio = require('socket.io');


var server = http.createServer(app);
var io = socketio.listen(server);
app.set('socketio', io);
app.set('server', server);

server.listen(3000, function () {
    console.log('Start server');
    console.log('Service is running');
});

// app.listen(3000, function () {
//     console.log('Start server');
//     console.log('Service is running');
// });