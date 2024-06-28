---
title: CubeTimer
---

[API Reference](/docs/api/) • Docs

***

[API Reference](/docs/api/) / CubeTimer

# Class: CubeTimer

`CubeTimer` is a custom HTML element that implements a basic timer, fit with useful
features that are expected in a modern speedcubing timer.

## Construction

To use `CubeTimer`, simply add the following to the desired HTML file:
```html
<cube-timer></cube-timer>
```

The following attributes can be set (these are all set as strings, but represent the following data types):
- `"inspection-time"`: `number`
- `"multiphase"`: `integer`
- `"timer-update"`: `number`
- `"trigger-key"`: `string` ([key](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key))
- `"use-milliseconds"`: `"true"` or `"false"`
- `"value"`: `number`

For example:
```html
<cube-timer inspection-time="0" use-milliseconds="true" multiphase="2"></cube-timer>
```

This is equivalent to:
```ts
const cubeTimer = new CubeTimer();

// Using the inherited setAttribute member function
cubeTimer.setAttribute("inspection-time", "0");
cubeTimer.setAttribute("use-milliseconds", "true");
cubeTimer.setAttribute("multiphase", "2");

// Setting the member variables directly (this time, with type safety)
cubeTimer.inspectionTime = 0;
cubeTimer.useMilliseconds = true;
cubeTimer.multiphase = 2;
```

More in-detail information on each of these properties can be found in the descriptions on the actual
member properties of `CubeTimer`.

## Event Listeners

Using `addEventListener`, it is easy to be notified when the timer stops as well as how long each phase,
inspection, and the entire timing (not including inspection).

```ts
cubeTimer.addEventListener("timer-stop", event => {
    const time: number = event.detail.time;
    const phaseTimes: number[] = event.detail.phaseTimes;
    const inspectionTime: number = event.detail.inspectionTime;
    console.log("time:", time);
    console.log("phase times:", ...phaseTimes);
    console.log("inspection time:", inspectionTime);
});
```

Note: any timing value returned by this function is in seconds, but is rounded down to the nearest millisecond.
This makes it easier for the end user to convert these numbers directly to a nice string, and looks much
cleaner in the console. Because of this, the sum of all `phaseTimes` will not necessarily sum to `time`.

## CSS

CubeTimer does not come with any CSS. However, custom CSS can easily be written. CubeTimer applies
the following classes at certain times to its internal `div` element:

- `.down`: The timer trigger is currently being pressed
- `.inspection`: The timer is in inspection phase

## Extends

- `HTMLElement`

## Constructors

### new CubeTimer()

> **new CubeTimer**(): [`CubeTimer`](/docs/api/classes/CubeTimer)

Constructs a new `CubeTimer()`.

#### Returns

[`CubeTimer`](/docs/api/classes/CubeTimer)

#### Overrides

`HTMLElement.constructor`

#### Example

```ts
// Create a new CubeTimer object
const cubeTimer = new CubeTimer();

// Insert it into the DOM
document.body.appendChild(cubeTimer);
```

#### Source

[templates/cube-timer.ts:166](https://github.com/BrouxtForce/cubelib/blob/46235e0efd69874517537607aff50e6e913dc207/src/templates/cube-timer.ts#L166)

## Properties

### display()

> **display**: (`milliseconds`, `isInspection`) => `string`

The function that `CubeTimer` uses to convert a time in milliseconds to
a string that is shown on the screen. This function can be overwritten to
grant custom behavior. When this function is called by `CubeTimer`, the
`this` value will be the `CubeTimer` instance that calls it, as long as the
custom function **is not an arrow function**. This is due to regular functions
handling `this` differently than arrow functions.

#### Example

```ts
cubeTimer.display = function(milliseconds: number, isInspection: boolean): string {
    if (isInspection) {
        // Avoid showing decimal points during inspection
        return Math.ceil(milliseconds / 1000).toString();
    }
    if (this.useMilliseconds) {
        // This function is responsible for obeying the useMilliseconds property
        // (also the timerUpdate property, but this won't be shown here)
        return (milliseconds / 1000).toFixed(3);
    }
    // Four digits after the decimal point, because why not?
    return (milliseconds / 1000).toFixed(4);
}

// Update the display of cubeTimer to match the above function
// This is necessary if cubeTimer is idle, since it isn't constantly updating
cubeTimer.update();
```

#### Parameters

• **milliseconds**: `number`

• **isInspection**: `boolean`

#### Returns

`string`

#### Source

[templates/cube-timer.ts:152](https://github.com/BrouxtForce/cubelib/blob/46235e0efd69874517537607aff50e6e913dc207/src/templates/cube-timer.ts#L152)

***

### inspectionTime

> **inspectionTime**: `number` = `15`

The time inspection lasts, in seconds.

If `inspectionTime` is `0`, the inspection phase will be skipped.

#### Source

[templates/cube-timer.ts:96](https://github.com/BrouxtForce/cubelib/blob/46235e0efd69874517537607aff50e6e913dc207/src/templates/cube-timer.ts#L96)

***

### multiphase

> **multiphase**: `number` = `1`

The number of phases that the timer goes through before it finally stops. By default,
`multiphase` is `1`, which behaves like a normal timer. For every additional phase,
the timer must be triggered an additional time to stop it.

#### Source

[templates/cube-timer.ts:83](https://github.com/BrouxtForce/cubelib/blob/46235e0efd69874517537607aff50e6e913dc207/src/templates/cube-timer.ts#L83)

***

### timerUpdate

> **timerUpdate**: `number` = `0`

The display of the timer will be a multiple of `timerUpdate` less than or equal to
the actual current time. However, the specified precision (centiseconds or milliseconds)
will be shown regardless if it is necessary or not.

If `timerUpdate` is `0`, this property has no effect.

#### Source

[templates/cube-timer.ts:105](https://github.com/BrouxtForce/cubelib/blob/46235e0efd69874517537607aff50e6e913dc207/src/templates/cube-timer.ts#L105)

***

### triggerKey

> **triggerKey**: `string` = `" "`

The key that triggers the starting and stopping of the timer.
It is case-insensitive, and by default, the spacebar will trigger the timer. See
[KeyboardEvent's key property](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key)
for possible values of `triggerKey`.

#### Source

[templates/cube-timer.ts:113](https://github.com/BrouxtForce/cubelib/blob/46235e0efd69874517537607aff50e6e913dc207/src/templates/cube-timer.ts#L113)

***

### useMilliseconds

> **useMilliseconds**: `boolean` = `false`

`true` if the timer should display with millisecond precision (`0.000`), and
`false` if the timer should display with centisecond precision (`0.00`).

#### Source

[templates/cube-timer.ts:89](https://github.com/BrouxtForce/cubelib/blob/46235e0efd69874517537607aff50e6e913dc207/src/templates/cube-timer.ts#L89)

## Accessors

### value

> `set` **value**(`value`): `void`

Set the value of the timer display, in seconds. This only has an
effect if the timer is idle (i.e. the timer is not running).

#### Parameters

• **value**: `number`

#### Source

[templates/cube-timer.ts:120](https://github.com/BrouxtForce/cubelib/blob/46235e0efd69874517537607aff50e6e913dc207/src/templates/cube-timer.ts#L120)

## Methods

### start()

> **start**(): `void`

Starts the solve timer. By default, CubeTimer calls this function automatically.

#### Returns

`void`

#### Source

[templates/cube-timer.ts:295](https://github.com/BrouxtForce/cubelib/blob/46235e0efd69874517537607aff50e6e913dc207/src/templates/cube-timer.ts#L295)

***

### startInspection()

> **startInspection**(): `void`

Starts the inspection timer. By default, CubeTimer calls this function automatically.

#### Returns

`void`

#### Source

[templates/cube-timer.ts:273](https://github.com/BrouxtForce/cubelib/blob/46235e0efd69874517537607aff50e6e913dc207/src/templates/cube-timer.ts#L273)

***

### stop()

> **stop**(): `boolean`

Stops the current phase timer, or stops the entire timer. By default,
CubeTimer calls this function automatically.

#### Returns

`boolean`

`true` if all phases have stopped, otherwise `false`.

#### Source

[templates/cube-timer.ts:308](https://github.com/BrouxtForce/cubelib/blob/46235e0efd69874517537607aff50e6e913dc207/src/templates/cube-timer.ts#L308)

***

### stopInspection()

> **stopInspection**(): `void`

Stops the inspection timer. By default, CubeTimer calls this function automatically.

#### Returns

`void`

#### Source

[templates/cube-timer.ts:284](https://github.com/BrouxtForce/cubelib/blob/46235e0efd69874517537607aff50e6e913dc207/src/templates/cube-timer.ts#L284)

***

### update()

> **update**(): `void`

Update the display to match the current running time or the idle timer value

#### Returns

`void`

#### Source

[templates/cube-timer.ts:340](https://github.com/BrouxtForce/cubelib/blob/46235e0efd69874517537607aff50e6e913dc207/src/templates/cube-timer.ts#L340)
