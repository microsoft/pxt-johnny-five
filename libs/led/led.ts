/**
 * LED control
 */
//% weight=100 color=#661141 icon="\uf0eb"
namespace led {
    interface LedOptions extends Options {
        pin: number;
        controller?: string;
    }
    
    /**
     * An LED
     */
    //% fixedInstances
    export class Led extends five.Component {
        constructor(options: LedOptions) {
            super(options)
        }

        /**
         * Turn the LED on or off
         */
        //% blockId=ledOn block="set %this %on"
        //% on.fieldEditor=toggleonoff
        set(on: boolean) {
            if (on) five.rpcCall("Led", this.options, "on", []);
            else five.rpcCall("Led", this.options, "off", [])
        }

        /**
         * Strobe/Blink the Led on/off in phases over ms
         * @param ms the duration, eg: 100
         */
        //% blockId=ledstrobe block="strobe %this for %ms ms"
        strobe(ms: number) {
            five.rpcCall("Led", this.options, "strobe", [ms]);
        }

        /** 
         * Stops animations
         * 
        */
        //% blockId=ledStop block="stop %this"
        stop() {
            five.rpcCall("Led", this.options, "stop", []);
        }
    }

    //% fixedInstance block="led 13"
    export const led13 = new Led({ pin: 13 });
}