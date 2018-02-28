/// <reference path="faye-websocket.d.ts"/>

import * as http from 'http';
import * as fs from 'fs';
import * as path from 'path';
import childProcess = require('child_process');
const WebSocket = <any>require('faye-websocket');
const wsserver = http.createServer();
const editors: WebSocket[] = [];

function startws(request: any, socket: any, body: any) {
    let ws = new WebSocket(request, socket, body);
    editors.push(ws);
    ws.on('message', function (event: any) {
        // handle message
    });
    ws.on('close', function (event: any) {
        console.log('j5: connection closed')
        editors.splice(editors.indexOf(ws), 1)
        ws = null;
    });
    ws.on('error', function () {
        console.log('j5: connection closed')
        editors.splice(editors.indexOf(ws), 1)
        ws = null;
    })
}

console.log('j5: starting proxy...')
wsserver.on('upgrade', function (request: any, socket: any, body: any) {
    if (WebSocket.isWebSocket(request))
        startws(request, socket, body)
});

const port = 3074;
const address = "localhost";
wsserver.listen(port);
console.log(`mc: web socket server from ${address}:${port}/`);
