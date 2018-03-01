/// <reference path="../libs/core/enums.d.ts"/>

namespace pxsim.control {
    /**
     * Executes an RPC call into Johnny Five
     * @param component 
     * @param componentArgs 
     */
    //%
    export function rpcAsync(component: string, componentArgs: number[], fn: string, fnArgs: number[]): Promise<void> {
        const cArgs = (<any>componentArgs).data;
        const fArgs = (<any>fnArgs).data;
        return board().queueRequestAsync(<j5.RPCRequest>{
            type: "rpc",
            board: "0",
            component: component,
            componentArgs: cArgs,
            function: fn,
            functionArgs: fArgs
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
