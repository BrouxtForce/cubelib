export function mod(a, b) {
    return ((a % b) + b) % b;
}
export function assert(condition, message) {
    if (!condition) {
        if (message) {
            throw new Error(`Assertion failed: ${message}`);
        }
        throw new Error("Assertion failed");
    }
}
export function arrayRepeat(array, repeat) {
    const originalLength = array.length;
    array.length = repeat * originalLength;
    for (let i = 1; i < repeat;) {
        const copyCount = Math.min(repeat - i, i);
        array.copyWithin(i * originalLength, 0, copyCount * originalLength);
        i += copyCount;
    }
    return array;
}
