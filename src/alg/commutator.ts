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

    expand(): (Move | AlgNonMoveNode)[] {
        if (this.amount === 0) {
            return [];
        }

        const expandedA = this.algA.expand();
        const expandedB = this.algB.expand();
        const invertedA: (Move | AlgNonMoveNode)[] = [];
        const invertedB: (Move | AlgNonMoveNode)[] = [];

        // Copy expandedA and expandedB into separate arrays and invert the sequences
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

        let outArray: (Move | AlgNonMoveNode)[];
        if (this.amount > 0) {
            // A B A' B'
            outArray = expandedA.concat(expandedB, invertedA, invertedB);
        } else {
            // B A B' A'
            outArray = expandedB.concat(expandedA, invertedB, invertedA);
        }

        return arrayRepeat(outArray, Math.abs(this.amount));
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
            return `[${outString}]`;
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