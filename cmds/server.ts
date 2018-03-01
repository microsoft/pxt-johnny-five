/// <reference path="faye-websocket.d.ts"/>
/// <reference path="../types.d.ts" />

import * as http from 'http';
import * as fs from 'fs';
import * as path from 'path';
import childProcess = require('child_process');

const log = console.log;
const debug = console.log;

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
    private components: pxt.Map<any> = {};

    constructor(private board: any) { }

    component(name: string, args: any[]): J5Component {
        const id = JSON.stringify({ name, args });
        let component = this.components[id];
        if (!component) {
            debug(`j5: new ${name}(${args.map(a => a + "").join(',')})`)
            component = this.components[id] = new J5Component(this, new five[name](args));
        }
        return component;
    }
}

/**
 * A wrapper for a five component like an LED
 */
class J5Component {
    events: pxt.Map<boolean> = {};
    constructor(private board: J5Board, private component: any) {

    }

    on(id: string, name: string) {
        const eid = id + '.' + name;
        if (this.events[eid]) return;

        const cb = function () {
            sendResponse(<j5.Event>{
                type: "event",
                status: 200,
                board: this.board.id,
                eventId: id,
                eventName: name
            });
        }
        this.call("on", [name, cb]);

        this.events[eid] = true;
    }

    call(name: string, args: any[]): any {
        debug(`j5: call ${name}(${args.map(a => a + "").join(',')})`)
        const proto = Object.getPrototypeOf(this.component);
        const fn = proto[name];
        return fn.apply(this.component, args);
    }
}

let boards: pxt.Map<Promise<J5Board>> = {}; // five.Board

function sendResponse(resp: j5.Response) {
    const msg = JSON.stringify(resp);
    editors.forEach(editor => editor.send(msg));
}

/**
 * connects to a given board
 * @param id board identitifer
 */
function boardAsync(id: string): Promise<J5Board> {
    let board = boards[id];
    if (!board) {
        log(`j5: connecting board ${id}`)
        // need to connect
        board = boards[id] = new Promise((resolve, reject) => {
            const b = new five.Board();
            b.on("ready", () => {
                debug(`j5: board ${id} connected`)
                resolve(new J5Board(b));
            })
            b.on("error", () => {
                delete boards[id];
                reject(new Error(`board ${id} not found`))
            });
        });
    }
    return board;
}

function handleError(req: j5.Request, error: any) {
    log(error);
    sendResponse(<j5.ErrorResponse>{
        id: req.id,
        status: 500,
        error
    })
}

function handleConnect(req: j5.ConnectRequest) {
    boardAsync(req.board)
        .then(() => {
            sendResponse(<j5.Response>{
                id: req.id,
                status: 200
            })
        })
        .catch(e => handleError(req, e));
}

function handleCall(req: j5.CallRequest) {
    boardAsync(req.board)
        .then(b => b.component(req.component, req.componentArgs || []))
        .then(c => {
            const resp = c.call(req.function, req.functionArgs || []);
            sendResponse(<j5.CallResponse>{
                id: req.id,
                status: 200,
                resp: undefined
            })
        })
        .catch(e => handleError(req, e));
}

function handleListenEvent(req: j5.ListenEventRequest) {
    boardAsync(req.board)
        .then(b => b.component(req.component, req.componentArgs || []))
        .then(c => {
            c.on(req.eventId, req.eventName);
            sendResponse(<j5.Response>{
                id: req.id,
                status: 200
            });
        })
        .catch(e => handleError(req, e));
}

function handleRequest(req: j5.Request) {
    switch (req.type) {
        case "connect": handleConnect(req as j5.ConnectRequest); break;
        case "call": handleCall(req as j5.CallRequest); break;
        case "listenevent": handleListenEvent(req as j5.ListenEventRequest); break;
    }
}


// web socket connection to editor(s)
const WebSocket = <any>require('faye-websocket');
const wsserver = http.createServer();
const editors: WebSocket[] = [];
function startws(request: any, socket: any, body: any) {
    log(`j5: connecting client...`);
    let ws = new WebSocket(request, socket, body);
    editors.push(ws);
    ws.on('message', function (event: any) {
        handleRequest(JSON.parse(event.data) as j5.Request);
    });
    ws.on('close', function (event: any) {
        log('j5: connection closed')
        editors.splice(editors.indexOf(ws), 1)
        ws = null;
    });
    ws.on('error', function () {
        log('j5: connection closed')
        editors.splice(editors.indexOf(ws), 1)
        ws = null;
    })
}

log('j5: starting...')
wsserver.on('upgrade', function (request: any, socket: any, body: any) {
    if (WebSocket.isWebSocket(request))
        startws(request, socket, body)
});

const port = 3074;
const address = "localhost";
wsserver.listen(port);
log(`j5: web socket server from ${address}:${port}/`);
