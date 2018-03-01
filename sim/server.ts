/// <reference path="../types.d.ts" />

namespace pxsim.server {
    export let port = 3074;
    let ws: WebSocket;

    export function close() {
        if (ws) ws.close();
        ws = undefined;
    }

    function handleMessage(ev: MessageEvent) {
        const b = board();
        if (!b) return;
        const msg = JSON.parse(ev.data) as j5.Response;
        b.handleResponse(msg);
    }

    export function initSocketAsync(): Promise<WebSocket> {
        if (ws) return Promise.resolve<WebSocket>(ws);

        // If we are in local serve mode, open traditional socket
        if (!/^(?:http:\/\/)?(?:localhost|127(?:\.[0-9]+){0,2}\.[0-9]+|(?:0*\:)*?:?0*1)/.test(document.referrer))
            return undefined; // TODO

        ws = new WebSocket(`ws://127.0.0.1:${port}`);
        ws.addEventListener('message', handleMessage, false)
        ws.addEventListener('close', ev => close(), false);
        ws.addEventListener('error', ev => close(), false);

        return new Promise<WebSocket>((resolve, reject) => {
            ws.addEventListener('open', () => {
                console.log('socket opened...')
                resolve(ws);
            }, false);
        })
    }
}
