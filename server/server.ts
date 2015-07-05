/// <reference path="all.d.ts" />

'use strict';

var PORT = 3333;

import * as express from 'express';
import {SocketEvents} from './commons/socket/socket-events';
import {StaticDispatcher} from './commons/static/static-dispatcher';

var app = express();
var http = app.listen(PORT);
var io = require('socket.io').listen(http);

StaticDispatcher.init(app, express);
SocketEvents.init(io);

console.log('listening on *:' + PORT);