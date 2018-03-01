namespace led {
    /**
     * An LED
     */
    //% fixedInstances
    export class Led {
        pin: number;
        constructor(pin: number) {
            this.pin = pin;
        }

        /**
         * Turn the LED on or off
         */
        //% blockId=ledOn block="set %this %on"
        //% on.fieldEditor=toggleonoff
        set(on: boolean) {
            if (on) control.rpc("Led", [this.pin], "on", []);
            else control.rpc("Led", [this.pin], "off", [])
        }

        /**
         * Strobe/Blink the Led on/off in phases over ms
         * @param ms the duration, eg: 100
         */
        //% blockId=ledstrobe block="strobe %this"
        strobe(ms: number) {
            control.rpc("Led", [this.pin], "strobe", [ms]);
        }

        /** 
         * Stops animations
         * 
        */
        //% blockId=ledStop block="stop %this"
        stop() {
            control.rpc("Led", [this.pin], "stop", []);            
        }
    }

    //% fixedInstance block="led 13"
    export const led13 = new Led(13);
}