type Matrix4x4 = Float32Array;
type Vector3 = number[];

export function transpose(a: Matrix4x4, outMatrix?: Matrix4x4): Matrix4x4 {
    outMatrix ??= new Float32Array(16);

    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            outMatrix[i * 4 + j] = a[j * 4 + i];
        }
    }

    return outMatrix;
}

export function matrixMult(a: Matrix4x4, b: Matrix4x4, outMatrix?: Matrix4x4): Matrix4x4 {
    outMatrix ??= new Float32Array(16);

    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            const index = i * 4 + j;
            outMatrix[index] = 0;
            for (let k = 0; k < 4; k++) {
                outMatrix[index] += a[i * 4 + k] * b[k * 4 + j];
            }
        }
    }

    return outMatrix;
}

export function createTranslationMatrix(translation: Vector3): Matrix4x4 {
    return new Float32Array([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        translation[0], translation[1], translation[2], 1
    ]);
}

export function matrixRotationX(radians: number, outMatrix?: Matrix4x4): Matrix4x4 {
    outMatrix ??= new Float32Array(16);
    
    const cosRad = Math.cos(radians);
    const sinRad = Math.sin(radians);
    outMatrix.set([
        1, 0, 0, 0,
        0, cosRad, -sinRad, 0,
        0, sinRad, cosRad, 0,
        0, 0, 0, 1
    ]);

    return outMatrix;
}

export function matrixRotationY(radians: number, outMatrix?: Matrix4x4): Matrix4x4 {
    outMatrix ??= new Float32Array(16);

    const cosRad = Math.cos(radians);
    const sinRad = Math.sin(radians);
    outMatrix.set([
        cosRad, 0, sinRad, 0,
        0, 1, 0, 0,
        -sinRad, 0, cosRad, 0,
        0, 0, 0, 1
    ]);

    return outMatrix;
}

export function createScaleMatrix(scale: Vector3): Matrix4x4 {
    return new Float32Array([
        scale[0], 0, 0, 0,
        0, scale[1], 0, 0,
        0, 0, scale[2], 0,
        0, 0, 0, 1
    ]);
}

export function createPerspectiveMatrix(fovRadians: number, aspect: number, znear: number): Matrix4x4 {
    return new Float32Array([
        fovRadians / aspect, 0, 0, 0,
        0, fovRadians, 0, 0,
        0, 0, -1, -2 * znear,
        0, 0, -1, 0
    ]);
}