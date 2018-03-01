/// <reference path="faye-websocket.d.ts"/>
/// <reference path="../types.d.ts" />

import * as http from 'http';
import * as fs from 'fs';
import * as path from 'path';
import childProcess = require('child_process');

/*******************
 * 
 * Johnny Five RPC wrapper
 * 
 */
const five = require('johnny-five')

/**
 * A wrapper for a five.Board instance
 */
class J5Board {
    private components: pxt.Map<any>;

    constructor(private board: any) {

    }

    component(name: string, args: any[]): J5Component {
        const id = JSON.stringify({ name, args });
        let component = this.components[id];
        if (!component)
            component = this.components[id] = new J5Component(new five[id]());
        return component;
    }
}

/**
 * A wrapper for a five component like an LED
 */
class J5Component {
    constructor(private component: any) {

    }

    call(name: string, args: any): any {
        return this.component.bind(name).invoke(args);
    }
}

let boards: pxt.Map<Promise<J5Board>> = {}; // five.Board

function sendResponse(resp: j5.Response) {
    editors.forEach(editor => editor.send(resp));
}

/**
 * connects to a given board
 * @param id board identitifer
 */
function boardAsync(id: string): Promise<J5Board> {
    let board = boards[id];
    if (!board) {
        console.log(`j5: connecting board ${id}`)
        // need to connect
        board = boards[id] = new Promise((resolve, reject) => {
            const b = new five.Board();
            b.on("ready", () => resolve(new J5Board(b)))
            b.on("error", () => reject(new Error("Board not found")));
        });
    }
    return board;
}

function handleError(req: j5.Request, error: any) {
    sendResponse(<j5.ErrorResponse>{
        req,
        status: 500,
        error
    })
}

function handleConnect(req: j5.ConnectRequest) {
    console.log(`j5: connecting...`)
    boardAsync(req.board)
        .then(() => {
            sendResponse({
                req,
                status: 200
            })
        })
        .catch(e => handleError(req, e));
}

function handleRpc(req: j5.RPCRequest) {
    boardAsync(req.board)
        .then(b => b.component(req.component, req.componentArgs))
        .then(c => c.call(req.function, req.functionArgs))
        .then(resp => sendResponse(<j5.RPCResponse>{
            req,
            status: 200,
            resp
        }))
        .catch(e => handleError(req, e));
}

function handleRequest(req: j5.Request) {
    console.log(`j5: req ${req.type}`)
    switch (req.type) {
        case "connect":
            handleConnect(req as j5.ConnectRequest);
            break;
        case "rpc":
            handleRpc(req as j5.RPCRequest);
            break;
    }
}


// web socket connection to editor(s)
const WebSocket = <any>require('faye-websocket');
const wsserver = http.createServer();
const editors: WebSocket[] = [];
function startws(request: any, socket: any, body: any) {
    console.log(`j5: connecting client...`);
    let ws = new WebSocket(request, socket, body);
    editors.push(ws);
    ws.on('message', function (event: any) {
        console.log(event)
        handleRequest(JSON.parse(event.data) as j5.Request);
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

console.log('j5: starting...')
wsserver.on('upgrade', function (request: any, socket: any, body: any) {
    if (WebSocket.isWebSocket(request))
        startws(request, socket, body)
});

const port = 3074;
const address = "localhost";
wsserver.listen(port);
console.log(`j5: web socket server from ${address}:${port}/`);
