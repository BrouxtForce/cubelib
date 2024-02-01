import { ConjugateIterator } from "./alg-iterator.js";
export class Conjugate {
    type = "Conjugate";
    algA;
    algB;
    isGrouping = true;
    amount = 1;
    constructor(algA, algB) {
        this.algA = algA;
        this.algB = algB;
    }
    copy() {
        return new Conjugate(this.algA.copy(), this.algB.copy());
    }
    expand() {
        const expandedA = this.algA.expand();
        const expandedB = this.algB.expand();
        const invertedA = [];
        for (let i = expandedA.length - 1; i >= 0; i--) {
            const node = expandedA[i];
            if (node.type === "Move") {
                invertedA.push(node.copy().invert());
                continue;
            }
            invertedA.push(node.copy());
        }
        if (this.amount < 0) {
            for (let i = 0; i < expandedB.length; i++) {
                const node = expandedB[i];
                if (node.type === "Move") {
                    expandedB[i] = node.copy().invert();
                }
            }
            expandedB.reverse();
        }
        return expandedA.concat(expandedB, invertedA);
    }
    invert() {
        this.algB.invert();
        return this;
    }
    toString() {
        const outString = `${this.algA.toString()}:${this.algB.toString()}`;
        if (this.isGrouping) {
            return `[${outString}]`;
        }
        return outString;
    }
    simplify() {
        this.algA.simplify();
        this.algB.simplify();
        if (this.amount < 0) {
            this.algB.invert();
            this.amount *= -1;
        }
        return this;
    }
    forward() {
        return { [Symbol.iterator]: () => new ConjugateIterator(this) };
    }
    reverse() {
        return { [Symbol.iterator]: () => new ConjugateIterator(this, true) };
    }
    [Symbol.iterator]() {
        return new ConjugateIterator(this);
    }
}
