import { CommutatorIterator } from "./alg-iterator.js";
import { arrayRepeat } from "../utils.js";
export class Commutator {
    type = "Commutator";
    algA;
    algB;
    isGrouping = false;
    amount = 1;
    constructor(algA, algB) {
        this.algA = algA;
        this.algB = algB;
    }
    copy() {
        return new Commutator(this.algA.copy(), this.algB.copy());
    }
    expand() {
        if (this.amount === 0) {
            return [];
        }
        const expandedA = this.algA.expand();
        const expandedB = this.algB.expand();
        const invertedA = [];
        const invertedB = [];
        for (let i = expandedA.length - 1; i >= 0; i--) {
            const node = expandedA[i];
            if (node.type === "Move") {
                invertedA.push(node.copy().invert());
                continue;
            }
            invertedA.push(node);
        }
        for (let i = expandedB.length - 1; i >= 0; i--) {
            const node = expandedB[i];
            if (node.type === "Move") {
                invertedB.push(node.copy().invert());
                continue;
            }
            invertedB.push(node);
        }
        let outArray;
        if (this.amount > 0) {
            outArray = expandedA.concat(expandedB, invertedA, invertedB);
        }
        else {
            outArray = expandedB.concat(expandedA, invertedB, invertedA);
        }
        return arrayRepeat(outArray, Math.abs(this.amount));
    }
    invert() {
        this.amount *= -1;
        return this;
    }
    toString() {
        const outString = `[${this.algA.toString()},${this.algB.toString()}]`;
        if (this.isGrouping) {
            return `[${outString}]`;
        }
        return outString;
    }
    simplify() {
        this.algA.simplify();
        this.algB.simplify();
        if (this.amount < 0) {
            const swap = this.algA;
            this.algA = this.algB;
            this.algB = swap;
            this.amount *= -1;
        }
        return this;
    }
    forward() {
        return { [Symbol.iterator]: () => new CommutatorIterator(this) };
    }
    reverse() {
        return { [Symbol.iterator]: () => new CommutatorIterator(this, true) };
    }
    [Symbol.iterator]() {
        return new CommutatorIterator(this);
    }
}
