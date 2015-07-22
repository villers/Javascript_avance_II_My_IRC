/// <reference path="all.d.ts" />

'use strict';
import {SocketEvents} from './controllers/socket/socket-events';
import {StaticDispatcher} from './controllers/static/static-dispatcher';

var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var PORT = 3333;
server.listen(PORT);

StaticDispatcher.init(app);
SocketEvents.init(io);

console.log('listening on *:' + PORT);
