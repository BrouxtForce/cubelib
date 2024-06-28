export interface TimerEventDetail {
    time: number;
    phaseTimes: number[];
    inspectionTime: number;
}

/**
 * `CubeTimer` is a custom HTML element that implements a basic timer, fit with useful
 * features that are expected in a modern speedcubing timer.
 * 
 * ## Construction
 * 
 * To use `CubeTimer`, simply add the following to the desired HTML file:
 * ```html
 * <cube-timer></cube-timer>
 * ```
 * 
 * The following attributes can be set (these are all set as strings, but represent the following data types):
 * - `"inspection-time"`: `number`
 * - `"multiphase"`: `integer`
 * - `"timer-update"`: `number`
 * - `"trigger-key"`: `string` ([key](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key))
 * - `"use-milliseconds"`: `"true"` or `"false"`
 * - `"value"`: `number`
 * 
 * For example:
 * ```html
 * <cube-timer inspection-time="0" use-milliseconds="true" multiphase="2"></cube-timer>
 * ```
 * 
 * This is equivalent to:
 * ```ts
 * const cubeTimer = new CubeTimer();
 * 
 * // Using the inherited setAttribute member function
 * cubeTimer.setAttribute("inspection-time", "0");
 * cubeTimer.setAttribute("use-milliseconds", "true");
 * cubeTimer.setAttribute("multiphase", "2");
 * 
 * // Setting the member variables directly (this time, with type safety)
 * cubeTimer.inspectionTime = 0;
 * cubeTimer.useMilliseconds = true;
 * cubeTimer.multiphase = 2;
 * ```
 * 
 * More in-detail information on each of these properties can be found in the descriptions on the actual
 * member properties of `CubeTimer`.
 * 
 * ## Event Listeners
 * 
 * Using `addEventListener`, it is easy to be notified when the timer stops as well as how long each phase,
 * inspection, and the entire timing (not including inspection).
 * 
 * ```ts
 * cubeTimer.addEventListener("timer-stop", event => {
 *     const time: number = event.detail.time;
 *     const phaseTimes: number[] = event.detail.phaseTimes;
 *     const inspectionTime: number = event.detail.inspectionTime;
 *     console.log("time:", time);
 *     console.log("phase times:", ...phaseTimes);
 *     console.log("inspection time:", inspectionTime);
 * });
 * ```
 * 
 * Note: any timing value returned by this function is in seconds, but is rounded down to the nearest millisecond.
 * This makes it easier for the end user to convert these numbers directly to a nice string, and looks much
 * cleaner in the console. Because of this, the sum of all `phaseTimes` will not necessarily sum to `time`.
 * 
 * ## CSS
 * 
 * CubeTimer does not come with any CSS. However, custom CSS can easily be written. CubeTimer applies
 * the following classes at certain times to its internal `div` element:
 * 
 * - `.down`: The timer trigger is currently being pressed
 * - `.inspection`: The timer is in inspection phase
 */
export class CubeTimer extends HTMLElement {
    /**
     * The number of phases that the timer goes through before it finally stops. By default,
     * `multiphase` is `1`, which behaves like a normal timer. For every additional phase,
     * the timer must be triggered an additional time to stop it.
     */
    public multiphase: number = 1;

    /**
     * `true` if the timer should display with millisecond precision (`0.000`), and
     * `false` if the timer should display with centisecond precision (`0.00`).
     */
    public useMilliseconds: boolean = false;

    /**
     * The time inspection lasts, in seconds.
     * 
     * If `inspectionTime` is `0`, the inspection phase will be skipped.
     */
    public inspectionTime: number = 15;

    /**
     * The display of the timer will be a multiple of `timerUpdate` less than or equal to
     * the actual current time. However, the specified precision (centiseconds or milliseconds)
     * will be shown regardless if it is necessary or not.
     * 
     * If `timerUpdate` is `0`, this property has no effect.
     */
    public timerUpdate = 0;

    /**
     * The key that triggers the starting and stopping of the timer.
     * It is case-insensitive, and by default, the spacebar will trigger the timer. See
     * [KeyboardEvent's key property](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key)
     * for possible values of `triggerKey`.
     */
    public triggerKey: string = " ";

    #idleTimerValue: number = 0;
    /**
     * Set the value of the timer display, in seconds. This only has an
     * effect if the timer is idle (i.e. the timer is not running).
     */
    set value(value: number) {
        this.#idleTimerValue = value * 1000;
        this.#timerDisplay.textContent = this.display(this.#idleTimerValue, false);
    }

    /**
     * The function that `CubeTimer` uses to convert a time in milliseconds to
     * a string that is shown on the screen. This function can be overwritten to
     * grant custom behavior. When this function is called by `CubeTimer`, the
     * `this` value will be the `CubeTimer` instance that calls it, as long as the
     * custom function **is not an arrow function**. This is due to regular functions
     * handling `this` differently than arrow functions.
     * 
     * @example
     * cubeTimer.display = function(milliseconds: number, isInspection: boolean): string {
     *     if (isInspection) {
     *         // Avoid showing decimal points during inspection
     *         return Math.ceil(milliseconds / 1000).toString();
     *     }
     *     if (this.useMilliseconds) {
     *         // This function is responsible for obeying the useMilliseconds property
     *         // (also the timerUpdate property, but this won't be shown here)
     *         return (milliseconds / 1000).toFixed(3);
     *     }
     *     // Four digits after the decimal point, because why not?
     *     return (milliseconds / 1000).toFixed(4);
     * }
     * 
     * // Update the display of cubeTimer to match the above function
     * // This is necessary if cubeTimer is idle, since it isn't constantly updating
     * cubeTimer.update();
     */
    public display: (milliseconds: number, isInspection: boolean) => string;

    readonly #timerDisplay: HTMLDivElement;

    /**
     * Constructs a new `CubeTimer()`.
     * 
     * @example
     * // Create a new CubeTimer object
     * const cubeTimer = new CubeTimer();
     * 
     * // Insert it into the DOM
     * document.body.appendChild(cubeTimer);
     */
    constructor() {
        super();

        this.#timerDisplay = document.createElement("div");
        this.appendChild(this.#timerDisplay);

        this.tabIndex = 0;
        this.addEventListener("keydown", event => {
            if (event.key.toLowerCase() === this.triggerKey.toLowerCase()) {
                this.#onTriggerDown();
            }
        });
        this.addEventListener("keyup", event => {
            if (event.key.toLowerCase() === this.triggerKey.toLowerCase()) {
                this.#onTriggerUp();
            }
        });

        this.display = (milliseconds: number, isInspection: boolean): string => {
            if (isInspection && milliseconds <= 0) {
                if (milliseconds < -2000) {
                    return "DNF";
                }
                return "+2";
            }

            const signString = (milliseconds < 0) ? "-" : "";
            milliseconds = Math.floor(Math.abs(milliseconds));
            if (this.timerUpdate !== 0) {
                milliseconds -= milliseconds % Math.floor(this.timerUpdate * 1000);
            }

            const MILLIS_PER_HOUR = 3_600_000;
            const MILLIS_PER_MINUTE = 60_000;
            const MILLIS_PER_SECOND = 1_000;

            const hours = Math.floor(milliseconds / MILLIS_PER_HOUR);
            milliseconds -= hours * MILLIS_PER_HOUR;

            const minutes = Math.floor(milliseconds / MILLIS_PER_MINUTE);
            milliseconds -= minutes * MILLIS_PER_MINUTE;

            let seconds = Math.floor(milliseconds / MILLIS_PER_SECOND);
            milliseconds -= seconds * MILLIS_PER_SECOND;

            // Round up seconds during inspection
            if (isInspection && milliseconds > 0 && signString !== "-") {
                seconds++;
            }

            let decimals: string;
            if (isInspection) {
                decimals = "";
            } else {
                decimals = "." + milliseconds.toString().padStart(3, "0").slice(0, this.useMilliseconds ? 3 : 2);
            }

            if (hours > 0) {
                return `${signString}${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}${decimals}`;
            }
            if (minutes > 0) {
                return `${signString}${minutes}:${seconds.toString().padStart(2, "0")}${decimals}`;
            }
            return `${signString}${seconds}${decimals}`;
        };

        this.#timerDisplay.textContent = this.display(0, false);
    }

    /** @internal */
    static get observedAttributes(): string[] {
        return ["inspection-time", "multiphase", "timer-update", "trigger-key", "use-milliseconds", "value"];
    }

    /** @internal */
    attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
        switch (name) {
            case "inspection-time":
                this.inspectionTime = Number(newValue);
                this.update();
                break;
            case "multiphase":
                this.multiphase = Number(newValue);
                break;
            case "timer-update":
                this.timerUpdate = Number(newValue);
                this.update();
                break;
            case "trigger-key":
                this.triggerKey = newValue;
                break;
            case "use-milliseconds":
                this.useMilliseconds = (Boolean(newValue) && newValue !== "false" && newValue !== "0");
                this.update();
                break;
            case "value":
                this.value = Number(newValue);
                break;
            default:
                console.error(`Unknown attribute '${name}'`);
        }
    }

    #inspectionStartTime: number = 0;
    /**
     * Starts the inspection timer. By default, CubeTimer calls this function automatically.
     */
    startInspection(): void {
        this.#inspectionStartTime = performance.now();
        this.#timerDisplay.classList.add("inspection");
        this.#shouldKeepUpdating = true;
        this.update();
    }

    #inspectionTime: number = 0;
    /**
     * Stops the inspection timer. By default, CubeTimer calls this function automatically.
     */
    stopInspection(): void {
        this.#inspectionTime = performance.now() - this.#inspectionStartTime;
        this.#timerDisplay.classList.remove("inspection");
        this.#shouldKeepUpdating = false;
    }

    #startTimeMs: number = 0;
    #stopTimesMs: number[] = [];
    /**
     * Starts the solve timer. By default, CubeTimer calls this function automatically.
     */
    start(): void {
        this.#startTimeMs = performance.now();
        this.#stopTimesMs.length = 0;
        this.#shouldKeepUpdating = true;
        this.update();
    }

    /**
     * Stops the current phase timer, or stops the entire timer. By default,
     * CubeTimer calls this function automatically.
     * 
     * @returns `true` if all phases have stopped, otherwise `false`.
     */
    stop(): boolean {
        const timeMs = performance.now() - this.#startTimeMs;
        this.#stopTimesMs.push(timeMs);

        if (this.#stopTimesMs.length >= this.multiphase) {
            const phaseTimes: number[] = [];
            let prevStopTime = 0;
            for (const stopTime of this.#stopTimesMs) {
                phaseTimes.push(Math.floor(stopTime - prevStopTime) / 1000);
                prevStopTime = stopTime;
            }

            const detail: TimerEventDetail = {
                time: Math.floor(timeMs) / 1000,
                phaseTimes,
                inspectionTime: Math.floor(this.#inspectionTime) / 1000
            };
            this.dispatchEvent(new CustomEvent("timer-stop", { detail }));

            this.#idleTimerValue = timeMs;
            this.#shouldKeepUpdating = false;

            return true;
        }

        return false;
    }

    #shouldKeepUpdating: boolean = false;
    /**
     * Update the display to match the current running time or the idle timer value
     */
    update = (): void => {
        let displayTime: number;
        if (this.#isInInspection) {
            displayTime = this.inspectionTime * 1000 - performance.now() + this.#inspectionStartTime;
        } else if (this.#isIdle) {
            displayTime = this.#idleTimerValue;
        } else {
            displayTime = performance.now() - this.#startTimeMs;
        }
        this.#timerDisplay.textContent = this.display(displayTime, this.#isInInspection);

        if (this.#shouldKeepUpdating) {
            window.requestAnimationFrame(this.update);
        }
    }

    #isIdle: boolean = true;
    #isInInspection: boolean = false;
    #onTriggerDown(): void {
        if (!this.#isIdle) {
            if (this.stop()) {
                this.#disableNextTriggerUp = true;
                this.#isIdle = true;
            }
        }

        this.#timerDisplay.classList.add("down");
    }

    #disableNextTriggerUp: boolean = false;
    #onTriggerUp(): void {
        if (this.#isIdle && !this.#disableNextTriggerUp) {
            if (this.#isInInspection) {
                this.#isInInspection = false;
                this.stopInspection();
                this.start();
                this.#isIdle = false;
            } else if (this.inspectionTime > 0) {
                this.#isInInspection = true;
                this.startInspection();
            } else {
                this.start();
                this.#isIdle = false;
            }
        }
        this.#disableNextTriggerUp = false;

        this.#timerDisplay.classList.remove("down");
    }
}

declare global {
    interface GlobalEventHandlersEventMap {
        "timer-stop": CustomEvent<TimerEventDetail>;
    }
}

customElements.define("cube-timer", CubeTimer);
