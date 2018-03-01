// Auto-generated from simulator. Do not edit.
declare namespace outputs {
    /**
     * Blinks an LED for a given duration
     * @param pin the pin, eg: 13
     * @param duration the duration, eg: 500
     */
    //% weight=90 promise
    //% blockId=j5blink block="blink %pin for %duration millis"
    //% shim=outputs::blinkAsync promise
    function blink(pin: number, duration: number): void;

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
