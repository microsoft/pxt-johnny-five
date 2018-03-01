/// <reference path="../libs/core/enums.d.ts"/>

namespace pxsim.outputs {
    /**
     * Blinks an LED for a given duration
     */
    //% weight=90 promise
    //% blockId=j5blink block="blink %pin for %duration millis"
    export function blinkAsync(pin: number, duration: number): Promise<void> {
        return board().queueRequestAsync(<j5.RPCRequest>{
            type: "rpc",
            board: "0",
            component: "Led",
            componentArgs: [pin >> 0],
            function: "blink",
            functionArgs: [duration]
        }).then();
    }

}

namespace pxsim {

    /**
     * Repeats the code forever in the background. On each iteration, allows other code to run.
     * @param body the code to repeat
     */
    //% help=functions/forever weight=55 blockGap=8
    //% blockId=device_forever block="forever" 
    //% blockNamespace="loops"
    export function forever(body: RefAction): void {
        thread.forever(body)
    }

    /**
     * Pause for the specified time in milliseconds
     * @param ms how long to pause for, eg: 100, 200, 500, 1000, 2000
     */
    //% help=functions/pause weight=54
    //% block="pause (ms) %pause" blockId=device_pause
    //% blockNamespace="pause"
    export function pauseAsync(ms: number) {
        return Promise.delay(ms)
    }
}
