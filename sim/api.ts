/// <reference path="../libs/core/enums.d.ts"/>

namespace pxsim.five {
    /**
     * Executes an RPC call into Johnny Five
     * @param component 
     * @param componentArgs 
     */
    //% promise
    export function rpcCallAsync(component: string, componentArgs: Options, fn: string, fnArgs: number[]): Promise<void> {
        const cArgs = (<any>componentArgs).toAny() as Options;
        const fArgs = (<any>fnArgs).toAny() as number[];
        const boardId = cArgs.board;
        const b = board();        
        return b.queueRequestAsync(<j5.CallRequest>{
            type: "call",
            board: boardId || "0",
            component,
            componentArgs: cArgs,
            function: fn,
            functionArgs: fArgs
        }).then();
    }

    /**
     * Executes an RPC call into Johnny Five
     * @param component 
     * @param componentArgs 
     */
    //% promise
    export function rpcOnEventAsync(component: string, componentArgs: Options, event: string, handler: RefAction): Promise<void> {
        const cArgs = (<any>componentArgs).toAny() as Options;
        const boardId = "";
        const b = board();        
        const evid = JSON.stringify({component, cArgs });
        b.bus.listen(evid, event, handler);
        return b.queueRequestAsync(<j5.ListenEventRequest>{
            type: "listenevent",
            board: boardId || "0",
            component,
            componentArgs: cArgs,
            eventId: evid,
            eventName: event
        }).then();
    }
}

namespace pxsim.loops {

    /**
     * Repeats the code forever in the background. On each iteration, allows other code to run.
     * @param body the code to repeat
     */
    //% help=functions/forever weight=55 blockGap=8
    //% blockId=device_forever block="forever" 
    export function forever(body: RefAction): void {
        thread.forever(body)
    }

    /**
     * Pause for the specified time in milliseconds
     * @param ms how long to pause for, eg: 100, 200, 500, 1000, 2000
     */
    //% help=functions/pause weight=54
    //% block="pause (ms) %pause" blockId=device_pause
    export function pauseAsync(ms: number) {
        return Promise.delay(ms)
    }
}
