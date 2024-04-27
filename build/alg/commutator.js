import { CommutatorIterator } from "./alg-iterator.js";
import { arrayRepeat } from "../utils.js";
export class Commutator {
    type = "Commutator";
    algA;
    algB;
    isGrouping;
    amount;
    constructor(algA, algB, amount = 1, isGrouping = true) {
        this.algA = algA;
        this.algB = algB;
        this.amount = amount;
        this.isGrouping = isGrouping;
    }
    copy() {
        return new Commutator(this.algA.copy(), this.algB.copy(), this.amount, this.isGrouping);
    }
    expanded() {
        if (this.amount === 0) {
            return [];
        }
        const expandedA = this.algA.expanded();
        const expandedB = this.algB.expanded();
        const invertedA = [];
        const invertedB = [];
        for (let i = expandedA.length - 1; i >= 0; i--) {
            const node = expandedA[i];
            if (node.type === "Move") {
                invertedA.push(node.copy().invert());
                continue;
            }
            invertedA.push(node.copy());
        }
        for (let i = expandedB.length - 1; i >= 0; i--) {
            const node = expandedB[i];
            if (node.type === "Move") {
                invertedB.push(node.copy().invert());
                continue;
            }
            invertedB.push(node.copy());
        }
        let outArray;
        if (this.amount > 0) {
            outArray = expandedA.concat(expandedB, invertedA, invertedB);
        }
        else {
            outArray = expandedB.concat(expandedA, invertedB, invertedA);
        }
        const length = outArray.length;
        const nodes = arrayRepeat(outArray, Math.abs(this.amount));
        for (let i = length; i < outArray.length; i++) {
            outArray[i] = outArray[i].copy();
        }
        return nodes;
    }
    invert() {
        const swap = this.algA;
        this.algA = this.algB;
        this.algB = swap;
        return this;
    }
    toString() {
        const outString = `[${this.algA.toString()},${this.algB.toString()}]`;
        if (this.isGrouping) {
            if (Math.abs(this.amount) !== 1) {
                return `[${outString}]${this.amount}${this.amount < 0 ? "'" : ""}`;
            }
            return `[${outString}]${this.amount < 0 ? "'" : ""}`;
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
