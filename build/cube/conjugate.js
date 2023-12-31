import { ConjugateIterator } from "./alg-iterator.js";
export class Conjugate {
    constructor(algA, algB) {
        this.type = "Conjugate";
        this.amount = 1;
        this.algA = algA;
        this.algB = algB;
    }
    copy() {
        return new Conjugate(this.algA.copy(), this.algB.copy());
    }
    expand(copy) {
        const expandedA = this.algA.expand(copy);
        const expandedB = this.algB.expand(copy);
        const invertedA = [];
        for (let i = expandedA.length - 1; i >= 0; i--) {
            invertedA.push(expandedA[i].inverted());
        }
        return expandedA.concat(expandedB, invertedA);
    }
    invert() {
        this.algB.invert();
        return this;
    }
    inverted() {
        return new Conjugate(this.algA.copy(), this.algB.inverted());
    }
    toString() {
        return `[${this.algA.toString()}:${this.algB.toString()}]`;
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
        return new ConjugateIterator(this);
    }
    reverseIterator() {
        return new ConjugateIterator(this, true);
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
