---
title: Commutator
---

[API Reference](/docs/api/) • Docs

***

[API Reference](/docs/api/) / Commutator

# Class: Commutator

## Implements

- `IAlgMoveNode`

## Constructors

### new Commutator()

> **new Commutator**(`algA`, `algB`, `amount`, `isGrouping`): [`Commutator`](/docs/api/classes/Commutator)

#### Parameters

• **algA**: [`Alg`](/docs/api/classes/Alg)

• **algB**: [`Alg`](/docs/api/classes/Alg)

• **amount**: `number`= `1`

• **isGrouping**: `boolean`= `true`

#### Returns

[`Commutator`](/docs/api/classes/Commutator)

#### Source

[alg/commutator.ts:18](https://github.com/BrouxtForce/cubelib/blob/72117884834c9a330d7870c13642ec7c97dbc128/src/alg/commutator.ts#L18)

## Properties

### algA

> **algA**: [`Alg`](/docs/api/classes/Alg)

#### Source

[alg/commutator.ts:9](https://github.com/BrouxtForce/cubelib/blob/72117884834c9a330d7870c13642ec7c97dbc128/src/alg/commutator.ts#L9)

***

### algB

> **algB**: [`Alg`](/docs/api/classes/Alg)

#### Source

[alg/commutator.ts:10](https://github.com/BrouxtForce/cubelib/blob/72117884834c9a330d7870c13642ec7c97dbc128/src/alg/commutator.ts#L10)

***

### amount

> **amount**: `number`

#### Implementation of

`IAlgMoveNode.amount`

#### Source

[alg/commutator.ts:14](https://github.com/BrouxtForce/cubelib/blob/72117884834c9a330d7870c13642ec7c97dbc128/src/alg/commutator.ts#L14)

***

### isGrouping

> **isGrouping**: `boolean`

#### Source

[alg/commutator.ts:12](https://github.com/BrouxtForce/cubelib/blob/72117884834c9a330d7870c13642ec7c97dbc128/src/alg/commutator.ts#L12)

***

### length

> `readonly` **length**: `number`

#### Implementation of

`IAlgMoveNode.length`

#### Source

[alg/commutator.ts:16](https://github.com/BrouxtForce/cubelib/blob/72117884834c9a330d7870c13642ec7c97dbc128/src/alg/commutator.ts#L16)

***

### type

> `readonly` **type**: `"Commutator"`

#### Implementation of

`IAlgMoveNode.type`

#### Source

[alg/commutator.ts:7](https://github.com/BrouxtForce/cubelib/blob/72117884834c9a330d7870c13642ec7c97dbc128/src/alg/commutator.ts#L7)

## Methods

### `[iterator]`()

> **[iterator]**(): `CommutatorIterator`

#### Returns

`CommutatorIterator`

#### Implementation of

`IAlgMoveNode.[iterator]`

#### Source

[alg/commutator.ts:152](https://github.com/BrouxtForce/cubelib/blob/72117884834c9a330d7870c13642ec7c97dbc128/src/alg/commutator.ts#L152)

***

### copy()

> **copy**(): [`Commutator`](/docs/api/classes/Commutator)

#### Returns

[`Commutator`](/docs/api/classes/Commutator)

#### Implementation of

`IAlgMoveNode.copy`

#### Source

[alg/commutator.ts:26](https://github.com/BrouxtForce/cubelib/blob/72117884834c9a330d7870c13642ec7c97dbc128/src/alg/commutator.ts#L26)

***

### expanded()

> **expanded**(): ([`Move`](/docs/api/classes/Move) \| `AlgNonMoveNode`)[]

#### Returns

([`Move`](/docs/api/classes/Move) \| `AlgNonMoveNode`)[]

#### Implementation of

`IAlgMoveNode.expanded`

#### Source

[alg/commutator.ts:30](https://github.com/BrouxtForce/cubelib/blob/72117884834c9a330d7870c13642ec7c97dbc128/src/alg/commutator.ts#L30)

***

### expandedMoves()

> **expandedMoves**(): [`Move`](/docs/api/classes/Move)[]

#### Returns

[`Move`](/docs/api/classes/Move)[]

#### Implementation of

`IAlgMoveNode.expandedMoves`

#### Source

[alg/commutator.ts:75](https://github.com/BrouxtForce/cubelib/blob/72117884834c9a330d7870c13642ec7c97dbc128/src/alg/commutator.ts#L75)

***

### forward()

> **forward**(): `object`

#### Returns

`object`

##### [iterator]()

> **[iterator]**: () => `CommutatorIterator`

###### Returns

`CommutatorIterator`

#### Implementation of

`IAlgMoveNode.forward`

#### Source

[alg/commutator.ts:146](https://github.com/BrouxtForce/cubelib/blob/72117884834c9a330d7870c13642ec7c97dbc128/src/alg/commutator.ts#L146)

***

### invert()

> **invert**(): [`Commutator`](/docs/api/classes/Commutator)

#### Returns

[`Commutator`](/docs/api/classes/Commutator)

#### Implementation of

`IAlgMoveNode.invert`

#### Source

[alg/commutator.ts:110](https://github.com/BrouxtForce/cubelib/blob/72117884834c9a330d7870c13642ec7c97dbc128/src/alg/commutator.ts#L110)

***

### reverse()

> **reverse**(): `object`

#### Returns

`object`

##### [iterator]()

> **[iterator]**: () => `CommutatorIterator`

###### Returns

`CommutatorIterator`

#### Implementation of

`IAlgMoveNode.reverse`

#### Source

[alg/commutator.ts:149](https://github.com/BrouxtForce/cubelib/blob/72117884834c9a330d7870c13642ec7c97dbc128/src/alg/commutator.ts#L149)

***

### simplify()

> **simplify**(): [`Commutator`](/docs/api/classes/Commutator)

#### Returns

[`Commutator`](/docs/api/classes/Commutator)

#### Implementation of

`IAlgMoveNode.simplify`

#### Source

[alg/commutator.ts:129](https://github.com/BrouxtForce/cubelib/blob/72117884834c9a330d7870c13642ec7c97dbc128/src/alg/commutator.ts#L129)

***

### toString()

> **toString**(): `string`

#### Returns

`string`

#### Implementation of

`IAlgMoveNode.toString`

#### Source

[alg/commutator.ts:118](https://github.com/BrouxtForce/cubelib/blob/72117884834c9a330d7870c13642ec7c97dbc128/src/alg/commutator.ts#L118)
