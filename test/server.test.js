'use strict';

const request = require('supertest');
const app = require('../src/config/express');
var http = require('http'),
socketio = require('socket.io');
var server = http.createServer(app);
var io = socketio.listen(server);
app.set('socketio', io);

describe('Server', function () {

    it('should be start server', function (done) {
        request(app)
            .get('/')
            .expect(200)
            .end(done);

    });

});