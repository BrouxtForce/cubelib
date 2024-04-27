import type { Alg, AlgNonMoveNode, IAlgMoveNode } from "./alg.js";
import type { Move } from "./move.js";
import { CommutatorIterator } from "./alg-iterator.js";
import { arrayRepeat } from "../utils.js";

export class Commutator implements IAlgMoveNode {
    public readonly type = "Commutator" as const;

    public algA: Alg;
    public algB: Alg;

    public isGrouping: boolean;

    public amount: number;

    constructor(algA: Alg, algB: Alg, amount: number = 1, isGrouping: boolean = true) {
        this.algA = algA;
        this.algB = algB;
        this.amount = amount;
        this.isGrouping = isGrouping;
    }

    copy(): Commutator {
        return new Commutator(this.algA.copy(), this.algB.copy(), this.amount, this.isGrouping);
    }

    expanded(): (Move | AlgNonMoveNode)[] {
        if (this.amount === 0) {
            return [];
        }

        const expandedA = this.algA.expanded();
        const expandedB = this.algB.expanded();
        const invertedA: (Move | AlgNonMoveNode)[] = [];
        const invertedB: (Move | AlgNonMoveNode)[] = [];

        // Copy expandedA and expandedB into separate arrays and invert the sequences
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

        let outArray: (Move | AlgNonMoveNode)[];
        if (this.amount > 0) {
            // A B A' B'
            outArray = expandedA.concat(expandedB, invertedA, invertedB);
        } else {
            // B A B' A'
            outArray = expandedB.concat(expandedA, invertedB, invertedA);
        }
        
        const length = outArray.length;
        const nodes = arrayRepeat(outArray, Math.abs(this.amount));
        for (let i = length; i < outArray.length; i++) {
            outArray[i] = outArray[i].copy();
        }
        return nodes;
    }

    invert(): Commutator {
        const swap = this.algA;
        this.algA = this.algB;
        this.algB = swap;
        
        return this;
    }

    toString(): string {
        const outString = `[${this.algA.toString()},${this.algB.toString()}]`;
        if (this.isGrouping) {
            if (Math.abs(this.amount) !== 1) {
                return `[${outString}]${this.amount}${this.amount < 0 ? "'" : ""}`
            }
            return `[${outString}]${this.amount < 0 ? "'" : ""}`;
        }
        return outString;
    }

    simplify(): Commutator {
        this.algA.simplify();
        this.algB.simplify();

        // If the commutator is inverted, then we can apply the following transformation:
        // [A, B]' -> [B, A]
        // (A B A' B')' -> B A B' A'
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
    [Symbol.iterator](): CommutatorIterator {
        return new CommutatorIterator(this);
    }
}