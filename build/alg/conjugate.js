import { ConjugateIterator } from "./alg-iterator.js";
import { arrayRepeat } from "../utils.js";
export class Conjugate {
    type = "Conjugate";
    algA;
    algB;
    isGrouping;
    amount;
    length;
    constructor(algA, algB, amount = 1, isGrouping = true) {
        this.algA = algA;
        this.algB = algB;
        this.amount = amount;
        this.isGrouping = isGrouping;
        this.length = 2 * this.algA.length + this.algB.length;
    }
    copy() {
        return new Conjugate(this.algA.copy(), this.algB.copy(), this.amount, this.isGrouping);
    }
    expanded() {
        const expandedA = this.algA.expanded();
        const expandedB = this.algB.expanded();
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
                    node.invert();
                }
            }
            expandedB.reverse();
        }
        const nodes = expandedA.concat(expandedB, invertedA);
        const length = nodes.length;
        arrayRepeat(nodes, Math.abs(this.amount));
        for (let i = length; i < nodes.length; i++) {
            nodes[i] = nodes[i].copy();
        }
        return nodes;
    }
    expandedMoves() {
        const expandedA = this.algA.expandedMoves();
        const expandedB = this.algB.expandedMoves();
        const invertedA = [];
        for (let i = expandedA.length - 1; i >= 0; i--) {
            invertedA.push(expandedA[i].copy().invert());
            ;
        }
        if (this.amount < 0) {
            for (let i = 0; i < expandedB.length; i++) {
                const node = expandedB[i];
                if (node.type === "Move") {
                    node.invert();
                }
            }
            expandedB.reverse();
        }
        const nodes = expandedA.concat(expandedB, invertedA);
        const length = nodes.length;
        arrayRepeat(nodes, Math.abs(this.amount));
        for (let i = length; i < nodes.length; i++) {
            nodes[i] = nodes[i].copy();
        }
        return nodes;
    }
    invert() {
        this.algB.invert();
        return this;
    }
    toString() {
        const outString = `${this.algA.toString()}:${this.algB.toString()}`;
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
