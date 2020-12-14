// Auto-generated from simulator. Do not edit.
declare namespace five {
    /**
     * Executes an RPC call into Johnny Five
     * @param component 
     * @param componentArgs 
     */
    //% promise
    //% shim=five::rpcCallAsync promise
    function rpcCall(component: string, componentArgs: Options, fn: string, fnArgs: {}): void;

    /**
     * Executes an RPC call into Johnny Five
     * @param component 
     * @param componentArgs 
     */
    //% promise
    //% shim=five::rpcOnEventAsync promise
    function rpcOnEvent(component: string, componentArgs: Options, event: string, handler: () => void): void;

}
declare namespace loops {
    /**
     * Repeats the code forever in the background. On each iteration, allows other code to run.
     * @param body the code to repeat
     */
    //% help=functions/forever weight=55 blockGap=8
    //% blockId=device_forever block="forever"
    //% shim=loops::forever
    function forever(body: () => void): void;

    /**
     * Pause for the specified time in milliseconds
     * @param ms how long to pause for, eg: 100, 200, 500, 1000, 2000
     */
    //% help=functions/pause weight=54
    //% block="pause (ms) %pause" blockId=device_pause
    //% shim=loops::pauseAsync promise
    function pause(ms: number): void;

}

// Auto-generated. Do not edit. Really.
