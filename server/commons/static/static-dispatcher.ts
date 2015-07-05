/// <reference path="../../all.d.ts" />

"use strict";

export class StaticDispatcher
{
    static init(app, express):void
    {
		app.use('/', express.static(process.cwd() + '/client/'));
		app.get('/', (req, res) => {
			res.sendfile(__dirname + '/client/index.html');
		});
    }
}
