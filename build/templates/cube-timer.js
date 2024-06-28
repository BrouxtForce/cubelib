export class CubeTimer extends HTMLElement {
    multiphase = 1;
    useMilliseconds = false;
    inspectionTime = 15;
    timerUpdate = 0;
    triggerKey = " ";
    #idleTimerValue = 0;
    set value(value) {
        this.#idleTimerValue = value * 1000;
        this.#timerDisplay.textContent = this.display(this.#idleTimerValue, false);
    }
    display;
    #timerDisplay;
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
        this.display = (milliseconds, isInspection) => {
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
            const MILLIS_PER_HOUR = 3600000;
            const MILLIS_PER_MINUTE = 60000;
            const MILLIS_PER_SECOND = 1000;
            const hours = Math.floor(milliseconds / MILLIS_PER_HOUR);
            milliseconds -= hours * MILLIS_PER_HOUR;
            const minutes = Math.floor(milliseconds / MILLIS_PER_MINUTE);
            milliseconds -= minutes * MILLIS_PER_MINUTE;
            let seconds = Math.floor(milliseconds / MILLIS_PER_SECOND);
            milliseconds -= seconds * MILLIS_PER_SECOND;
            if (isInspection && milliseconds > 0 && signString !== "-") {
                seconds++;
            }
            let decimals;
            if (isInspection) {
                decimals = "";
            }
            else {
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
    static get observedAttributes() {
        return ["inspection-time", "multiphase", "timer-update", "trigger-key", "use-milliseconds", "value"];
    }
    attributeChangedCallback(name, oldValue, newValue) {
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
    #inspectionStartTime = 0;
    startInspection() {
        this.#inspectionStartTime = performance.now();
        this.#timerDisplay.classList.add("inspection");
        this.#shouldKeepUpdating = true;
        this.update();
    }
    #inspectionTime = 0;
    stopInspection() {
        this.#inspectionTime = performance.now() - this.#inspectionStartTime;
        this.#timerDisplay.classList.remove("inspection");
        this.#shouldKeepUpdating = false;
    }
    #startTimeMs = 0;
    #stopTimesMs = [];
    start() {
        this.#startTimeMs = performance.now();
        this.#stopTimesMs.length = 0;
        this.#shouldKeepUpdating = true;
        this.update();
    }
    stop() {
        const timeMs = performance.now() - this.#startTimeMs;
        this.#stopTimesMs.push(timeMs);
        if (this.#stopTimesMs.length >= this.multiphase) {
            const phaseTimes = [];
            let prevStopTime = 0;
            for (const stopTime of this.#stopTimesMs) {
                phaseTimes.push(Math.floor(stopTime - prevStopTime) / 1000);
                prevStopTime = stopTime;
            }
            const detail = {
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
    #shouldKeepUpdating = false;
    update = () => {
        let displayTime;
        if (this.#isInInspection) {
            displayTime = this.inspectionTime * 1000 - performance.now() + this.#inspectionStartTime;
        }
        else if (this.#isIdle) {
            displayTime = this.#idleTimerValue;
        }
        else {
            displayTime = performance.now() - this.#startTimeMs;
        }
        this.#timerDisplay.textContent = this.display(displayTime, this.#isInInspection);
        if (this.#shouldKeepUpdating) {
            window.requestAnimationFrame(this.update);
        }
    };
    #isIdle = true;
    #isInInspection = false;
    #onTriggerDown() {
        if (!this.#isIdle) {
            if (this.stop()) {
                this.#disableNextTriggerUp = true;
                this.#isIdle = true;
            }
        }
        this.#timerDisplay.classList.add("down");
    }
    #disableNextTriggerUp = false;
    #onTriggerUp() {
        if (this.#isIdle && !this.#disableNextTriggerUp) {
            if (this.#isInInspection) {
                this.#isInInspection = false;
                this.stopInspection();
                this.start();
                this.#isIdle = false;
            }
            else if (this.inspectionTime > 0) {
                this.#isInInspection = true;
                this.startInspection();
            }
            else {
                this.start();
                this.#isIdle = false;
            }
        }
        this.#disableNextTriggerUp = false;
        this.#timerDisplay.classList.remove("down");
    }
}
customElements.define("cube-timer", CubeTimer);
