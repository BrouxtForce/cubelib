import type { Alg, AlgNonMoveNode, IAlgMoveNode } from "./alg";
import type { Move } from "./move";
import { ConjugateIterator } from "./alg-iterator.js";

export class Conjugate implements IAlgMoveNode {
    public readonly type = "Conjugate" as const;

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

    copy(): Conjugate {
        return new Conjugate(this.algA.copy(), this.algB.copy(), this.amount, this.isGrouping);
    }

    expand(): (Move | AlgNonMoveNode)[] {
        const expandedA = this.algA.expand();
        const expandedB = this.algB.expand();
        const invertedA: (Move | AlgNonMoveNode)[] = [];

        // Copy expandedA into a separate array and invert its sequence
        for (let i = expandedA.length - 1; i >= 0; i--) {
            const node = expandedA[i];
            if (node.type === "Move") {
                invertedA.push(node.copy().invert());
                continue;
            }
            invertedA.push(node);
        }

        // If this conjugate is inverted, then apply the following transformation:
        // A : B -> A : B'
        // A B A' -> A B' A'
        if (this.amount < 0) {
            for (let i = 0; i < expandedB.length; i++) {
                const node = expandedB[i];
                if (node.type === "Move") {
                    expandedB[i] = node.copy().invert();
                }
            }
            expandedB.reverse();
        }

        // Return the concatenated arrays in order of A B A' (or A B' A' if expandedB has been inverted)
        return expandedA.concat(expandedB, invertedA);
    }

    invert(): Conjugate {
        this.algB.invert();
        return this;
    }

    toString(): string {
        const outString = `${this.algA.toString()}:${this.algB.toString()}`;
        if (this.isGrouping) {
            return `[${outString}]`;
        }
        return outString;
    }

    simplify(): Conjugate {
        this.algA.simplify();
        this.algB.simplify();

        // If the conjugate is inverted, we can cancel the inversion and invert only algB
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
    [Symbol.iterator](): ConjugateIterator {
        return new ConjugateIterator(this);
    }
}