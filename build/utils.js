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
    assert(Number.isInteger(repeat), "arrayRepeat() repeat must be an integer");
    assert(repeat >= 0, "arrayRepeat() repeat must be a nonnegative integer");
    const originalLength = array.length;
    array.length = repeat * originalLength;
    for (let i = 1; i < repeat;) {
        const copyCount = Math.min(repeat - i, i);
        array.copyWithin(i * originalLength, 0, copyCount * originalLength);
        i += copyCount;
    }
    return array;
}
