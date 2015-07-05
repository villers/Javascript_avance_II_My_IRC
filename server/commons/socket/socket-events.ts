/// <reference path="../../all.d.ts" />

"use strict";

export class SocketEvents
{
    static init(io: any): void
    {
        io.on('connection', function(client: any)
        {
          client.on('users:online', function()
          {
            io.emit('users:online', 1);
          });
        });
    }
}
