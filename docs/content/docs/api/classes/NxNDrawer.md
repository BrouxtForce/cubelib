---
title: NxNDrawer
---

[API Reference](/docs/api/) • Docs

***

[API Reference](/docs/api/) / NxNDrawer

# Class: NxNDrawer

## Constructors

### new NxNDrawer()

> **new NxNDrawer**(`canvas`, `layerCount`): [`NxNDrawer`](/docs/api/classes/NxNDrawer)

#### Parameters

• **canvas**: `HTMLCanvasElement`

• **layerCount**: `number`

#### Returns

[`NxNDrawer`](/docs/api/classes/NxNDrawer)

#### Source

[graphics/webgpu/nxn-drawer.ts:24](https://github.com/BrouxtForce/cubelib/blob/46235e0efd69874517537607aff50e6e913dc207/src/graphics/webgpu/nxn-drawer.ts#L24)

## Properties

### layerCount

> `readonly` **layerCount**: `number`

#### Source

[graphics/webgpu/nxn-drawer.ts:9](https://github.com/BrouxtForce/cubelib/blob/46235e0efd69874517537607aff50e6e913dc207/src/graphics/webgpu/nxn-drawer.ts#L9)

## Methods

### animateMove()

> **animateMove**(`move`, `t`): `void`

#### Parameters

• **move**: [`Move`](/docs/api/classes/Move)

• **t**: `number`

#### Returns

`void`

#### Source

[graphics/webgpu/nxn-drawer.ts:117](https://github.com/BrouxtForce/cubelib/blob/46235e0efd69874517537607aff50e6e913dc207/src/graphics/webgpu/nxn-drawer.ts#L117)

***

### clearAnimation()

> **clearAnimation**(): `void`

#### Returns

`void`

#### Source

[graphics/webgpu/nxn-drawer.ts:142](https://github.com/BrouxtForce/cubelib/blob/46235e0efd69874517537607aff50e6e913dc207/src/graphics/webgpu/nxn-drawer.ts#L142)

***

### destroy()

> **destroy**(): `void`

#### Returns

`void`

#### Source

[graphics/webgpu/nxn-drawer.ts:149](https://github.com/BrouxtForce/cubelib/blob/46235e0efd69874517537607aff50e6e913dc207/src/graphics/webgpu/nxn-drawer.ts#L149)

***

### render()

> **render**(): `void`

#### Returns

`void`

#### Source

[graphics/webgpu/nxn-drawer.ts:46](https://github.com/BrouxtForce/cubelib/blob/46235e0efd69874517537607aff50e6e913dc207/src/graphics/webgpu/nxn-drawer.ts#L46)

***

### reset()

> **reset**(): `void`

#### Returns

`void`

#### Source

[graphics/webgpu/nxn-drawer.ts:63](https://github.com/BrouxtForce/cubelib/blob/46235e0efd69874517537607aff50e6e913dc207/src/graphics/webgpu/nxn-drawer.ts#L63)

***

### resize()

> **resize**(`width`, `height`): `void`

#### Parameters

• **width**: `number`

• **height**: `number`

#### Returns

`void`

#### Source

[graphics/webgpu/nxn-drawer.ts:156](https://github.com/BrouxtForce/cubelib/blob/46235e0efd69874517537607aff50e6e913dc207/src/graphics/webgpu/nxn-drawer.ts#L156)

***

### set()

> **set**(`cube`): `void`

#### Parameters

• **cube**: [`Cube`](/docs/api/classes/Cube)

#### Returns

`void`

#### Source

[graphics/webgpu/nxn-drawer.ts:90](https://github.com/BrouxtForce/cubelib/blob/46235e0efd69874517537607aff50e6e913dc207/src/graphics/webgpu/nxn-drawer.ts#L90)

***

### setCameraTransform()

> **setCameraTransform**(`position`, `rotationX`, `rotationY`): `void`

#### Parameters

• **position**: `number`[]

• **rotationX**: `number`

• **rotationY**: `number`

#### Returns

`void`

#### Source

[graphics/webgpu/nxn-drawer.ts:77](https://github.com/BrouxtForce/cubelib/blob/46235e0efd69874517537607aff50e6e913dc207/src/graphics/webgpu/nxn-drawer.ts#L77)
