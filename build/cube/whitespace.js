import { EmptyIterator } from "./alg-iterator.js";
export class Whitespace {
    type = "Whitespace";
    value;
    amount = 0;
    constructor(whitespace) {
        this.value = whitespace;
    }
    copy() { return new Whitespace(this.value); }
    expand(copy) { return copy ? [this.copy()] : [this]; }
    invert() { return this; }
    inverted() { return this.copy(); }
    toString() { return this.value; }
    forwardIterator() {
        return new EmptyIterator();
    }
    reverseIterator() {
        return new EmptyIterator();
    }
    forward() {
        return { [Symbol.iterator]: () => this.forwardIterator() };
    }
    reverse() {
        return { [Symbol.iterator]: () => this.reverseIterator() };
    }
    [Symbol.iterator]() {
        return this.forwardIterator();
    }
}
