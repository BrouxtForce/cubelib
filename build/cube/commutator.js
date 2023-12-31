import { CommutatorIterator } from "./alg-iterator.js";
export class Commutator {
    constructor(algA, algB) {
        this.type = "Commutator";
        this.amount = 1;
        this.algA = algA;
        this.algB = algB;
    }
    copy() {
        return new Commutator(this.algA.copy(), this.algB.copy());
    }
    expand(copy) {
        const expandedA = this.algA.expand(copy);
        const expandedB = this.algB.expand(copy);
        const invertedA = [];
        const invertedB = [];
        for (let i = expandedA.length - 1; i >= 0; i--) {
            invertedA.push(expandedA[i].inverted());
        }
        for (let i = expandedB.length - 1; i >= 0; i--) {
            invertedB.push(expandedB[i].inverted());
        }
        return expandedA.concat(expandedB, invertedA, invertedB);
    }
    invert() {
        let swap = this.algA;
        this.algA = this.algB;
        this.algB = swap;
        return this;
    }
    inverted() {
        return new Commutator(this.algB.copy(), this.algA.copy());
    }
    toString() {
        return `[${this.algA.toString()},${this.algB.toString()}]`;
    }
    stripComments() {
        this.algA.stripComments();
        this.algB.stripComments();
    }
    removeWhitespace() {
        this.algA.removeWhitespace();
        this.algB.removeWhitespace();
    }
    addWhitespace() {
        this.algA.addWhitespace();
        this.algB.addWhitespace();
    }
    simplify() {
        this.algA.simplify();
        this.algB.simplify();
    }
    forwardIterator() {
        return new CommutatorIterator(this);
    }
    reverseIterator() {
        return new CommutatorIterator(this, true);
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
