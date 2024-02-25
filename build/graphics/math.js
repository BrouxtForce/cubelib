export function transpose(a, outMatrix) {
    outMatrix ??= new Float32Array(16);
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            outMatrix[i * 4 + j] = a[j * 4 + i];
        }
    }
    return outMatrix;
}
export function matrixMult(a, b, outMatrix) {
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
export function createTranslationMatrix(translation) {
    return new Float32Array([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        translation[0], translation[1], translation[2], 1
    ]);
}
export function createRotationMatrix(rotation) {
    const [x, y, z, w] = rotation;
    const a = [
        w, z, -y, x,
        -z, w, x, y,
        y, -x, w, z,
        -x, -y, -z, w
    ];
    const b = [
        w, z, -y, -x,
        -z, w, x, -y,
        y, -x, w, -z,
        x, y, z, w
    ];
    return matrixMult(transpose(a), transpose(b));
}
export function createScaleMatrix(scale) {
    return new Float32Array([
        scale[0], 0, 0, 0,
        0, scale[1], 0, 0,
        0, 0, scale[2], 0,
        0, 0, 0, 1
    ]);
}
export function createTransformMatrix(position, rotation, scale) {
    const outMatrix = new Float32Array(16);
    matrixMult(matrixMult(createTranslationMatrix(position), createRotationMatrix(rotation)), createScaleMatrix(scale), outMatrix);
    return outMatrix;
}
export function createPerspectiveMatrix(fovRadians, aspect, znear) {
    return ([
        fovRadians / aspect, 0, 0, 0,
        0, fovRadians, 0, 0,
        0, 0, -1, -2 * znear,
        0, 0, -1, 0
    ]);
}
