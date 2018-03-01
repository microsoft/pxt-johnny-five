/// <reference path="../node_modules/pxt-core/built/pxtsim.d.ts"/>
/// <reference path="../types.d.ts" />

namespace pxsim {
    /**
     * This function gets called each time the program restarts
     */
    initCurrentRuntime = () => {
        runtime.board = new Board();
    };

    /**
     * Gets the current 'board', eg. program state.
     */
    export function board(): Board {
        return runtime.board as Board;
    }

    interface SocketRequest {
        req: j5.Request;
        resolve: (resp?: j5.Response) => void;
        time: number;
        initiated?: boolean;
    }

    /**
     * Represents the entire state of the executing program.
     * Do not store state anywhere else!
     */
    export class Board extends pxsim.BaseBoard {
        public id: string;
        public bus: EventBus;
        private nextId = 0;
        private requests: Map<SocketRequest> = {};

        constructor() {
            super();
            this.id = "" + Math_.randomRange(0, 2147483646);
            this.bus = new EventBus(runtime);
        }

        initAsync(msg: pxsim.SimulatorRunMessage): Promise<void> {
            return Promise.resolve();
        }

        queueRequestAsync(req: j5.Request): Promise<any> {
            const id = this.nextId++; // `${runtime.id}-${}`;
            req.id = id + "";
            return server.initSocketAsync()
                .then(ws => {
                    if (ws) return new Promise((resolve, reject) => {
                        const r: SocketRequest = {
                            req,
                            resolve,
                            time: new Date().getTime()
                        };
                        this.requests[id] = r;
                        ws.send(req);
                    })
                    else return undefined;
                });
        }

        handleResponse(resp: j5.Response) {
            const id = resp.req.id;
            const req = this.requests[id];
            if (req) {
                req.resolve(resp);
                delete this.requests[id];
            }
        }

        kill() {
            super.kill()
            this.requests = {}; // ignore future requests
        }

        updateView() {
        }
    }
}