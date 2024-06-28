---
title: Conjugate
---

[API Reference](/docs/api/) • Docs

***

[API Reference](/docs/api/) / Conjugate

# Class: Conjugate

## Implements

- `IAlgMoveNode`

## Constructors

### new Conjugate()

> **new Conjugate**(`algA`, `algB`, `amount`, `isGrouping`): [`Conjugate`](/docs/api/classes/Conjugate)

#### Parameters

• **algA**: [`Alg`](/docs/api/classes/Alg)

• **algB**: [`Alg`](/docs/api/classes/Alg)

• **amount**: `number`= `1`

• **isGrouping**: `boolean`= `true`

#### Returns

[`Conjugate`](/docs/api/classes/Conjugate)

#### Source

[alg/conjugate.ts:18](https://github.com/BrouxtForce/cubelib/blob/46235e0efd69874517537607aff50e6e913dc207/src/alg/conjugate.ts#L18)

## Properties

### algA

> **algA**: [`Alg`](/docs/api/classes/Alg)

#### Source

[alg/conjugate.ts:9](https://github.com/BrouxtForce/cubelib/blob/46235e0efd69874517537607aff50e6e913dc207/src/alg/conjugate.ts#L9)

***

### algB

> **algB**: [`Alg`](/docs/api/classes/Alg)

#### Source

[alg/conjugate.ts:10](https://github.com/BrouxtForce/cubelib/blob/46235e0efd69874517537607aff50e6e913dc207/src/alg/conjugate.ts#L10)

***

### amount

> **amount**: `number`

#### Implementation of

`IAlgMoveNode.amount`

#### Source

[alg/conjugate.ts:14](https://github.com/BrouxtForce/cubelib/blob/46235e0efd69874517537607aff50e6e913dc207/src/alg/conjugate.ts#L14)

***

### isGrouping

> **isGrouping**: `boolean`

#### Source

[alg/conjugate.ts:12](https://github.com/BrouxtForce/cubelib/blob/46235e0efd69874517537607aff50e6e913dc207/src/alg/conjugate.ts#L12)

***

### length

> `readonly` **length**: `number`

#### Implementation of

`IAlgMoveNode.length`

#### Source

[alg/conjugate.ts:16](https://github.com/BrouxtForce/cubelib/blob/46235e0efd69874517537607aff50e6e913dc207/src/alg/conjugate.ts#L16)

***

### type

> `readonly` **type**: `"Conjugate"`

#### Implementation of

`IAlgMoveNode.type`

#### Source

[alg/conjugate.ts:7](https://github.com/BrouxtForce/cubelib/blob/46235e0efd69874517537607aff50e6e913dc207/src/alg/conjugate.ts#L7)

## Methods

### `[iterator]`()

> **[iterator]**(): `ConjugateIterator`

#### Returns

`ConjugateIterator`

#### Implementation of

`IAlgMoveNode.[iterator]`

#### Source

[alg/conjugate.ts:136](https://github.com/BrouxtForce/cubelib/blob/46235e0efd69874517537607aff50e6e913dc207/src/alg/conjugate.ts#L136)

***

### copy()

> **copy**(): [`Conjugate`](/docs/api/classes/Conjugate)

#### Returns

[`Conjugate`](/docs/api/classes/Conjugate)

#### Implementation of

`IAlgMoveNode.copy`

#### Source

[alg/conjugate.ts:26](https://github.com/BrouxtForce/cubelib/blob/46235e0efd69874517537607aff50e6e913dc207/src/alg/conjugate.ts#L26)

***

### expanded()

> **expanded**(): ([`Move`](/docs/api/classes/Move) \| `AlgNonMoveNode`)[]

#### Returns

([`Move`](/docs/api/classes/Move) \| `AlgNonMoveNode`)[]

#### Implementation of

`IAlgMoveNode.expanded`

#### Source

[alg/conjugate.ts:30](https://github.com/BrouxtForce/cubelib/blob/46235e0efd69874517537607aff50e6e913dc207/src/alg/conjugate.ts#L30)

***

### expandedMoves()

> **expandedMoves**(): [`Move`](/docs/api/classes/Move)[]

#### Returns

[`Move`](/docs/api/classes/Move)[]

#### Implementation of

`IAlgMoveNode.expandedMoves`

#### Source

[alg/conjugate.ts:68](https://github.com/BrouxtForce/cubelib/blob/46235e0efd69874517537607aff50e6e913dc207/src/alg/conjugate.ts#L68)

***

### forward()

> **forward**(): `object`

#### Returns

`object`

##### [iterator]()

> **[iterator]**: () => `ConjugateIterator`

###### Returns

`ConjugateIterator`

#### Implementation of

`IAlgMoveNode.forward`

#### Source

[alg/conjugate.ts:130](https://github.com/BrouxtForce/cubelib/blob/46235e0efd69874517537607aff50e6e913dc207/src/alg/conjugate.ts#L130)

***

### invert()

> **invert**(): [`Conjugate`](/docs/api/classes/Conjugate)

#### Returns

[`Conjugate`](/docs/api/classes/Conjugate)

#### Implementation of

`IAlgMoveNode.invert`

#### Source

[alg/conjugate.ts:101](https://github.com/BrouxtForce/cubelib/blob/46235e0efd69874517537607aff50e6e913dc207/src/alg/conjugate.ts#L101)

***

### reverse()

> **reverse**(): `object`

#### Returns

`object`

##### [iterator]()

> **[iterator]**: () => `ConjugateIterator`

###### Returns

`ConjugateIterator`

#### Implementation of

`IAlgMoveNode.reverse`

#### Source

[alg/conjugate.ts:133](https://github.com/BrouxtForce/cubelib/blob/46235e0efd69874517537607aff50e6e913dc207/src/alg/conjugate.ts#L133)

***

### simplify()

> **simplify**(): [`Conjugate`](/docs/api/classes/Conjugate)

#### Returns

[`Conjugate`](/docs/api/classes/Conjugate)

#### Implementation of

`IAlgMoveNode.simplify`

#### Source

[alg/conjugate.ts:117](https://github.com/BrouxtForce/cubelib/blob/46235e0efd69874517537607aff50e6e913dc207/src/alg/conjugate.ts#L117)

***

### toString()

> **toString**(): `string`

#### Returns

`string`

#### Implementation of

`IAlgMoveNode.toString`

#### Source

[alg/conjugate.ts:106](https://github.com/BrouxtForce/cubelib/blob/46235e0efd69874517537607aff50e6e913dc207/src/alg/conjugate.ts#L106)
