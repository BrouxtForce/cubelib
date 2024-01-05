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
