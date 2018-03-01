/// <reference path="../node_modules/pxt-core/built/pxtsim.d.ts"/>
/// <reference path="../types.d.ts" />

import lf = pxsim.localization.lf;

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

    export interface IChatView {
        clear(): void;
        append(msg: string): void;
    }

    class ConsoleChatView implements IChatView {
        clear(): void {
            console.clear();
        }
        append(txt: string): void {
            console.log(txt);
        }
    }

    class DomChatView implements IChatView {
        private element: HTMLDivElement;
        constructor() {
            this.element = document.createElement("div") as HTMLDivElement;
            this.element.className = 'sim-log';
        }

        clear(): void {
            document.body.innerHTML = '';
            this.element.innerHTML = '';
            this.element.className = "sim-log";
            this.element.onclick = undefined;
            this.element.title = undefined;
            document.body.appendChild(this.element);
        }

        append(txt: string): void {
            const msg = document.createElement('div') as HTMLDivElement;
            msg.innerText = txt;
            while (this.element.childElementCount > 8) this.element.removeChild(this.element.firstElementChild);
            this.element.appendChild(msg);
        }
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
        private chat: IChatView;

        constructor() {
            super();
            this.id = "" + Math_.randomRange(0, 2147483646);
            this.bus = new EventBus(runtime);
            this.chat = typeof document == "undefined" ? new ConsoleChatView() : new DomChatView();
        }

        initAsync(msg: pxsim.SimulatorRunMessage): Promise<void> {
            this.chat.clear();
            return this.queueRequestAsync(<j5.ConnectRequest>{
                type: "connect",
                board: "0"
            }).then(() => {
                this.chat.append(lf("board connected..."));
            })
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
                        ws.send(JSON.stringify(req));
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