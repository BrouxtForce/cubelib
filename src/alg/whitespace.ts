import { AlgNode } from "./alg.js";
import { EmptyIterator } from "./alg-iterator.js";

export class Whitespace implements AlgNode {
    public type = "Whitespace";

    public value: string;
    public amount = 0;

    constructor(whitespace: string) {
        this.value = whitespace;
    }
    copy(): Whitespace { return new Whitespace(this.value); }
    expand(copy: boolean): Whitespace[] { return copy ? [this.copy()] : [this]; }
    invert(): Whitespace { return this; }
    inverted(): Whitespace { return this.copy(); }
    toString(): string { return this.value; }

    forwardIterator(): Iterator<any> {
        return new EmptyIterator();
    }
    reverseIterator(): Iterator<any> {
        return new EmptyIterator();
    }
    forward() {
        return { [Symbol.iterator]: () => this.forwardIterator() };
    }
    reverse() {
        return { [Symbol.iterator]: () => this.reverseIterator() };
    }
    [Symbol.iterator](): Iterator<any> {
        return this.forwardIterator();
    }
}