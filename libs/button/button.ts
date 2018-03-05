enum ButtonEvent {
    //% block="hold"
    Hold,
    //% block="down"
    Down,
    //% block="up"
    Up
}


namespace button {
    interface ButtonOptions extends Options {
        pin: number;
        invert?: boolean;
        isPullUp?: boolean;
        isPullDown?: boolean;
        holdtime?: number;
    }

    const eventNames = [
        "hold",
        "down",
        "up"
    ];

    /**
     * A Button
     */
    //% fixedInstances
    export class Button extends five.Component {
        /**
         * Creates a new button instance
         * @param options 
         */
        constructor(options: ButtonOptions) {
            super(options);
        }

        /**
         * Registers a callback for a given event
         * @param event 
         * @param handler 
         */
        //% blockId=buttonon block="on %this %event"
        on(event: ButtonEvent, handler: () => void) {
            five.rpcOnEvent("Button", this.options, eventNames[event], handler);
        }
    }

    //% fixedInstance block="button 2"
    export const button2 = new Button({ pin: 2 });
    //% fixedInstance block="button 3"
    export const button3 = new Button({ pin: 3 });
    //% fixedInstance block="button 4"
    export const button4 = new Button({ pin: 4 });
    //% fixedInstance block="button 5"
    export const button5 = new Button({ pin: 5 });
}