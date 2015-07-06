/// <reference path="all.d.ts" />
// https://github.com/tamaspiros/advanced-chat/blob/master/room.js
'use strict';

import * as express from 'express';
import {SocketEvents} from 'controllers/socket/socket-events';
import {StaticDispatcher} from 'controllers/static/static-dispatcher';

var PORT = 3333;

var app: any = express();
var server: any = app.listen(PORT);
var socket: SocketIO.Socket = require('socket.io').listen(server);

StaticDispatcher.init(app);
SocketEvents.init(socket);

console.log('listening on *:' + PORT);
