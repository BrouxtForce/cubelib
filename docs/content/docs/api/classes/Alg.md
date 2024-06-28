---
title: Alg
---

[API Reference](/docs/api/) • Docs

***

[API Reference](/docs/api/) / Alg

# Class: Alg

## Implements

- `IAlgMoveNode`

## Constructors

### new Alg()

> **new Alg**(`nodes`, `amount`, `isGrouping`): [`Alg`](/docs/api/classes/Alg)

#### Parameters

• **nodes**: `AlgNode`[]

• **amount**: `number`= `1`

• **isGrouping**: `boolean`= `false`

#### Returns

[`Alg`](/docs/api/classes/Alg)

#### Source

[alg/alg.ts:51](https://github.com/BrouxtForce/cubelib/blob/46235e0efd69874517537607aff50e6e913dc207/src/alg/alg.ts#L51)

## Properties

### amount

> **amount**: `number`

#### Implementation of

`IAlgMoveNode.amount`

#### Source

[alg/alg.ts:49](https://github.com/BrouxtForce/cubelib/blob/46235e0efd69874517537607aff50e6e913dc207/src/alg/alg.ts#L49)

***

### isGrouping

> **isGrouping**: `boolean`

#### Source

[alg/alg.ts:47](https://github.com/BrouxtForce/cubelib/blob/46235e0efd69874517537607aff50e6e913dc207/src/alg/alg.ts#L47)

***

### length

> `readonly` **length**: `number`

#### Implementation of

`IAlgMoveNode.length`

#### Source

[alg/alg.ts:45](https://github.com/BrouxtForce/cubelib/blob/46235e0efd69874517537607aff50e6e913dc207/src/alg/alg.ts#L45)

***

### moveNodes

> `readonly` **moveNodes**: `AlgMoveNode`[]

#### Source

[alg/alg.ts:44](https://github.com/BrouxtForce/cubelib/blob/46235e0efd69874517537607aff50e6e913dc207/src/alg/alg.ts#L44)

***

### nodes

> `readonly` **nodes**: `AlgNode`[]

#### Source

[alg/alg.ts:43](https://github.com/BrouxtForce/cubelib/blob/46235e0efd69874517537607aff50e6e913dc207/src/alg/alg.ts#L43)

***

### type

> `readonly` **type**: `"Alg"`

#### Implementation of

`IAlgMoveNode.type`

#### Source

[alg/alg.ts:41](https://github.com/BrouxtForce/cubelib/blob/46235e0efd69874517537607aff50e6e913dc207/src/alg/alg.ts#L41)

## Methods

### `[iterator]`()

> **[iterator]**(): `AlgIterator`

#### Returns

`AlgIterator`

#### Implementation of

`IAlgMoveNode.[iterator]`

#### Source

[alg/alg.ts:238](https://github.com/BrouxtForce/cubelib/blob/46235e0efd69874517537607aff50e6e913dc207/src/alg/alg.ts#L238)

***

### copy()

> **copy**(): [`Alg`](/docs/api/classes/Alg)

#### Returns

[`Alg`](/docs/api/classes/Alg)

#### Implementation of

`IAlgMoveNode.copy`

#### Source

[alg/alg.ts:83](https://github.com/BrouxtForce/cubelib/blob/46235e0efd69874517537607aff50e6e913dc207/src/alg/alg.ts#L83)

***

### expanded()

> **expanded**(): ([`Move`](/docs/api/classes/Move) \| `AlgNonMoveNode`)[]

#### Returns

([`Move`](/docs/api/classes/Move) \| `AlgNonMoveNode`)[]

#### Implementation of

`IAlgMoveNode.expanded`

#### Source

[alg/alg.ts:91](https://github.com/BrouxtForce/cubelib/blob/46235e0efd69874517537607aff50e6e913dc207/src/alg/alg.ts#L91)

***

### expandedMoves()

> **expandedMoves**(): [`Move`](/docs/api/classes/Move)[]

#### Returns

[`Move`](/docs/api/classes/Move)[]

#### Implementation of

`IAlgMoveNode.expandedMoves`

#### Source

[alg/alg.ts:124](https://github.com/BrouxtForce/cubelib/blob/46235e0efd69874517537607aff50e6e913dc207/src/alg/alg.ts#L124)

***

### forward()

> **forward**(): `object`

#### Returns

`object`

##### [iterator]()

> **[iterator]**: () => `AlgIterator`

###### Returns

`AlgIterator`

#### Implementation of

`IAlgMoveNode.forward`

#### Source

[alg/alg.ts:232](https://github.com/BrouxtForce/cubelib/blob/46235e0efd69874517537607aff50e6e913dc207/src/alg/alg.ts#L232)

***

### invert()

> **invert**(): [`Alg`](/docs/api/classes/Alg)

#### Returns

[`Alg`](/docs/api/classes/Alg)

#### Implementation of

`IAlgMoveNode.invert`

#### Source

[alg/alg.ts:152](https://github.com/BrouxtForce/cubelib/blob/46235e0efd69874517537607aff50e6e913dc207/src/alg/alg.ts#L152)

***

### reverse()

> **reverse**(): `object`

#### Returns

`object`

##### [iterator]()

> **[iterator]**: () => `AlgIterator`

###### Returns

`AlgIterator`

#### Implementation of

`IAlgMoveNode.reverse`

#### Source

[alg/alg.ts:235](https://github.com/BrouxtForce/cubelib/blob/46235e0efd69874517537607aff50e6e913dc207/src/alg/alg.ts#L235)

***

### simplify()

> **simplify**(): [`Alg`](/docs/api/classes/Alg)

#### Returns

[`Alg`](/docs/api/classes/Alg)

#### Implementation of

`IAlgMoveNode.simplify`

#### Source

[alg/alg.ts:184](https://github.com/BrouxtForce/cubelib/blob/46235e0efd69874517537607aff50e6e913dc207/src/alg/alg.ts#L184)

***

### toString()

> **toString**(): `string`

#### Returns

`string`

#### Implementation of

`IAlgMoveNode.toString`

#### Source

[alg/alg.ts:162](https://github.com/BrouxtForce/cubelib/blob/46235e0efd69874517537607aff50e6e913dc207/src/alg/alg.ts#L162)

***

### fromString()

> `static` **fromString**(`moveString`): [`Alg`](/docs/api/classes/Alg)

#### Parameters

• **moveString**: `string`

#### Returns

[`Alg`](/docs/api/classes/Alg)

#### Source

[alg/alg.ts:71](https://github.com/BrouxtForce/cubelib/blob/46235e0efd69874517537607aff50e6e913dc207/src/alg/alg.ts#L71)
