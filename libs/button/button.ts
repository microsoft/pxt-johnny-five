enum ButtonEvent {
    //% block="hold"
    Hold,
    //% block="down"
    Down,
    //% block="up"
    Up
}


namespace button {
    const eventNames = [
        "hold",
        "down",
        "up"
    ];

    /**
     * A Button
     */
    //% fixedInstances
    export class Button {
        pin: number;
        constructor(pin: number) {
            this.pin = pin;
        }

        /**
         * Registers a callback for a given event
         * @param event 
         * @param handler 
         */
        //% blockId=buttonon block="on %this %event"
        on(event: ButtonEvent, handler: () => void) {
            control.rpcOnEvent("Button", [this.pin], eventNames[event], handler);
        }
    }

    //% fixedInstance block="button 2"
    export const button2 = new Button(2);
    //% fixedInstance block="button 3"
    export const button3 = new Button(3);
    //% fixedInstance block="button 4"
    export const button4 = new Button(4);
    //% fixedInstance block="button 5"
    export const button5 = new Button(5);
}