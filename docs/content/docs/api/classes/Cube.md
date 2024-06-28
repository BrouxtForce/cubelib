---
title: Cube
---

[API Reference](/docs/api/) • Docs

***

[API Reference](/docs/api/) / Cube

# Class: Cube

## Constructors

### new Cube()

> **new Cube**(`layerCount`): [`Cube`](/docs/api/classes/Cube)

#### Parameters

• **layerCount**: `number`

#### Returns

[`Cube`](/docs/api/classes/Cube)

#### Source

[cube/cube.ts:72](https://github.com/BrouxtForce/cubelib/blob/46235e0efd69874517537607aff50e6e913dc207/src/cube/cube.ts#L72)

## Properties

### stickers

> **stickers**: `Face`[][]

#### Source

[cube/cube.ts:70](https://github.com/BrouxtForce/cubelib/blob/46235e0efd69874517537607aff50e6e913dc207/src/cube/cube.ts#L70)

## Methods

### execute()

> **execute**(`alg`): `void`

#### Parameters

• **alg**: `AlgMoveNode`

#### Returns

`void`

#### Source

[cube/cube.ts:806](https://github.com/BrouxtForce/cubelib/blob/46235e0efd69874517537607aff50e6e913dc207/src/cube/cube.ts#L806)

***

### executeUntil()

> **executeUntil**(`alg`, `numMoves`): `null` \| [`Move`](/docs/api/classes/Move)

#### Parameters

• **alg**: `AlgMoveNode`

• **numMoves**: `number`

#### Returns

`null` \| [`Move`](/docs/api/classes/Move)

#### Source

[cube/cube.ts:827](https://github.com/BrouxtForce/cubelib/blob/46235e0efd69874517537607aff50e6e913dc207/src/cube/cube.ts#L827)

***

### getLayerCount()

> **getLayerCount**(): `number`

#### Returns

`number`

#### Source

[cube/cube.ts:106](https://github.com/BrouxtForce/cubelib/blob/46235e0efd69874517537607aff50e6e913dc207/src/cube/cube.ts#L106)

***

### html()

> **html**(`node`): `void`

#### Parameters

• **node**: `HTMLElement`

#### Returns

`void`

#### Source

[cube/cube.ts:603](https://github.com/BrouxtForce/cubelib/blob/46235e0efd69874517537607aff50e6e913dc207/src/cube/cube.ts#L603)

***

### memoCenters()

> **memoCenters**(`centerIndex`, `buffer`, `cycleBreakOrder`): `number`[]

#### Parameters

• **centerIndex**: `number`

• **buffer**: `number`

• **cycleBreakOrder**: `number`[]

#### Returns

`number`[]

#### Source

[cube/cube.ts:365](https://github.com/BrouxtForce/cubelib/blob/46235e0efd69874517537607aff50e6e913dc207/src/cube/cube.ts#L365)

***

### memoCorners()

> **memoCorners**(`buffer`, `cycleBreakOrder`): `number`[]

#### Parameters

• **buffer**: `number`

• **cycleBreakOrder**: `number`[]

#### Returns

`number`[]

#### Source

[cube/cube.ts:308](https://github.com/BrouxtForce/cubelib/blob/46235e0efd69874517537607aff50e6e913dc207/src/cube/cube.ts#L308)

***

### memoEdges()

> **memoEdges**(`buffer`, `cycleBreakOrder`): `number`[]

#### Parameters

• **buffer**: `number`

• **cycleBreakOrder**: `number`[]

#### Returns

`number`[]

#### Source

[cube/cube.ts:192](https://github.com/BrouxtForce/cubelib/blob/46235e0efd69874517537607aff50e6e913dc207/src/cube/cube.ts#L192)

***

### memoWings()

> **memoWings**(`wingIndex`, `buffer`, `cycleBreakOrder`): `number`[]

#### Parameters

• **wingIndex**: `number`

• **buffer**: `number`

• **cycleBreakOrder**: `number`[]

#### Returns

`number`[]

#### Source

[cube/cube.ts:248](https://github.com/BrouxtForce/cubelib/blob/46235e0efd69874517537607aff50e6e913dc207/src/cube/cube.ts#L248)

***

### move()

> **move**(`face`, `amount`, `shallow`, `deep`): `void`

#### Parameters

• **face**: `Face`

• **amount**: `number`

• **shallow**: `number`= `1`

• **deep**: `number`= `1`

#### Returns

`void`

#### Source

[cube/cube.ts:767](https://github.com/BrouxtForce/cubelib/blob/46235e0efd69874517537607aff50e6e913dc207/src/cube/cube.ts#L767)

***

### reset()

> **reset**(): `void`

#### Returns

`void`

#### Source

[cube/cube.ts:760](https://github.com/BrouxtForce/cubelib/blob/46235e0efd69874517537607aff50e6e913dc207/src/cube/cube.ts#L760)

***

### solve()

> **solve**(): `void`

#### Returns

`void`

#### Source

[cube/cube.ts:109](https://github.com/BrouxtForce/cubelib/blob/46235e0efd69874517537607aff50e6e913dc207/src/cube/cube.ts#L109)

***

### solved()

> **solved**(): `boolean`

#### Returns

`boolean`

#### Source

[cube/cube.ts:117](https://github.com/BrouxtForce/cubelib/blob/46235e0efd69874517537607aff50e6e913dc207/src/cube/cube.ts#L117)

***

### toString()

> **toString**(): `string`

#### Returns

`string`

#### Source

[cube/cube.ts:96](https://github.com/BrouxtForce/cubelib/blob/46235e0efd69874517537607aff50e6e913dc207/src/cube/cube.ts#L96)

***

### fromString()

> `static` **fromString**(`state`): [`Cube`](/docs/api/classes/Cube)

#### Parameters

• **state**: `string`

#### Returns

[`Cube`](/docs/api/classes/Cube)

#### Source

[cube/cube.ts:85](https://github.com/BrouxtForce/cubelib/blob/46235e0efd69874517537607aff50e6e913dc207/src/cube/cube.ts#L85)
