export function assert(condition: boolean, message?: string): void {
    if (!condition) {
        if (message) {
            throw new Error(`Assertion failed: ${message}`);
        }
        throw new Error("Assertion failed");
    }
}