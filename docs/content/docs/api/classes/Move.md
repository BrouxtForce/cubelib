---
title: Move
---

[API Reference](/docs/api/) • Docs

***

[API Reference](/docs/api/) / Move

# Class: Move

## Implements

- `IAlgMoveNode`

## Constructors

### new Move()

> **new Move**(`face`, `shallow`, `deep`, `amount`): [`Move`](/docs/api/classes/Move)

#### Parameters

• **face**: `string`

• **shallow**: `number`

• **deep**: `number`

• **amount**: `number`

#### Returns

[`Move`](/docs/api/classes/Move)

#### Source

[alg/move.ts:16](https://github.com/BrouxtForce/cubelib/blob/72117884834c9a330d7870c13642ec7c97dbc128/src/alg/move.ts#L16)

## Properties

### amount

> **amount**: `number`

#### Implementation of

`IAlgMoveNode.amount`

#### Source

[alg/move.ts:12](https://github.com/BrouxtForce/cubelib/blob/72117884834c9a330d7870c13642ec7c97dbc128/src/alg/move.ts#L12)

***

### deep

> **deep**: `number` = `1`

#### Source

[alg/move.ts:11](https://github.com/BrouxtForce/cubelib/blob/72117884834c9a330d7870c13642ec7c97dbc128/src/alg/move.ts#L11)

***

### face

> **face**: `string`

#### Source

[alg/move.ts:9](https://github.com/BrouxtForce/cubelib/blob/72117884834c9a330d7870c13642ec7c97dbc128/src/alg/move.ts#L9)

***

### length

> `readonly` **length**: `number` = `1`

#### Implementation of

`IAlgMoveNode.length`

#### Source

[alg/move.ts:14](https://github.com/BrouxtForce/cubelib/blob/72117884834c9a330d7870c13642ec7c97dbc128/src/alg/move.ts#L14)

***

### shallow

> **shallow**: `number` = `1`

#### Source

[alg/move.ts:10](https://github.com/BrouxtForce/cubelib/blob/72117884834c9a330d7870c13642ec7c97dbc128/src/alg/move.ts#L10)

***

### type

> `readonly` **type**: `"Move"`

#### Implementation of

`IAlgMoveNode.type`

#### Source

[alg/move.ts:7](https://github.com/BrouxtForce/cubelib/blob/72117884834c9a330d7870c13642ec7c97dbc128/src/alg/move.ts#L7)

## Methods

### `[iterator]`()

> **[iterator]**(): `MoveIterator`

#### Returns

`MoveIterator`

#### Implementation of

`IAlgMoveNode.[iterator]`

#### Source

[alg/move.ts:189](https://github.com/BrouxtForce/cubelib/blob/72117884834c9a330d7870c13642ec7c97dbc128/src/alg/move.ts#L189)

***

### copy()

> **copy**(): [`Move`](/docs/api/classes/Move)

#### Returns

[`Move`](/docs/api/classes/Move)

#### Implementation of

`IAlgMoveNode.copy`

#### Source

[alg/move.ts:104](https://github.com/BrouxtForce/cubelib/blob/72117884834c9a330d7870c13642ec7c97dbc128/src/alg/move.ts#L104)

***

### equal()

> **equal**(`move`): `boolean`

#### Parameters

• **move**: [`Move`](/docs/api/classes/Move)

#### Returns

`boolean`

#### Source

[alg/move.ts:176](https://github.com/BrouxtForce/cubelib/blob/72117884834c9a330d7870c13642ec7c97dbc128/src/alg/move.ts#L176)

***

### expanded()

> **expanded**(): [`Move`](/docs/api/classes/Move)[]

#### Returns

[`Move`](/docs/api/classes/Move)[]

#### Implementation of

`IAlgMoveNode.expanded`

#### Source

[alg/move.ts:108](https://github.com/BrouxtForce/cubelib/blob/72117884834c9a330d7870c13642ec7c97dbc128/src/alg/move.ts#L108)

***

### expandedMoves()

> **expandedMoves**(): [`Move`](/docs/api/classes/Move)[]

#### Returns

[`Move`](/docs/api/classes/Move)[]

#### Implementation of

`IAlgMoveNode.expandedMoves`

#### Source

[alg/move.ts:112](https://github.com/BrouxtForce/cubelib/blob/72117884834c9a330d7870c13642ec7c97dbc128/src/alg/move.ts#L112)

***

### forward()

> **forward**(): `object`

#### Returns

`object`

##### [iterator]()

> **[iterator]**: () => `MoveIterator`

###### Returns

`MoveIterator`

#### Implementation of

`IAlgMoveNode.forward`

#### Source

[alg/move.ts:183](https://github.com/BrouxtForce/cubelib/blob/72117884834c9a330d7870c13642ec7c97dbc128/src/alg/move.ts#L183)

***

### invert()

> **invert**(): [`Move`](/docs/api/classes/Move)

#### Returns

[`Move`](/docs/api/classes/Move)

#### Implementation of

`IAlgMoveNode.invert`

#### Source

[alg/move.ts:116](https://github.com/BrouxtForce/cubelib/blob/72117884834c9a330d7870c13642ec7c97dbc128/src/alg/move.ts#L116)

***

### reverse()

> **reverse**(): `object`

#### Returns

`object`

##### [iterator]()

> **[iterator]**: () => `MoveIterator`

###### Returns

`MoveIterator`

#### Implementation of

`IAlgMoveNode.reverse`

#### Source

[alg/move.ts:186](https://github.com/BrouxtForce/cubelib/blob/72117884834c9a330d7870c13642ec7c97dbc128/src/alg/move.ts#L186)

***

### simplify()

> **simplify**(): `IAlgMoveNode`

#### Returns

`IAlgMoveNode`

#### Implementation of

`IAlgMoveNode.simplify`

#### Source

[alg/move.ts:166](https://github.com/BrouxtForce/cubelib/blob/72117884834c9a330d7870c13642ec7c97dbc128/src/alg/move.ts#L166)

***

### toString()

> **toString**(): `string`

#### Returns

`string`

#### Implementation of

`IAlgMoveNode.toString`

#### Source

[alg/move.ts:121](https://github.com/BrouxtForce/cubelib/blob/72117884834c9a330d7870c13642ec7c97dbc128/src/alg/move.ts#L121)

***

### fromString()

> `static` **fromString**(`moveString`): [`Move`](/docs/api/classes/Move)

#### Parameters

• **moveString**: `string`

#### Returns

[`Move`](/docs/api/classes/Move)

#### Source

[alg/move.ts:25](https://github.com/BrouxtForce/cubelib/blob/72117884834c9a330d7870c13642ec7c97dbc128/src/alg/move.ts#L25)
