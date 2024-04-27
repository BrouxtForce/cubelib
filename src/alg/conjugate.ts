import type { Alg, AlgNonMoveNode, IAlgMoveNode } from "./alg";
import type { Move } from "./move";
import { ConjugateIterator } from "./alg-iterator.js";
import { arrayRepeat } from "../utils.js";

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

    expanded(): (Move | AlgNonMoveNode)[] {
        const expandedA = this.algA.expanded();
        const expandedB = this.algB.expanded();
        const invertedA: (Move | AlgNonMoveNode)[] = [];

        // Copy expandedA into a separate array and invert its sequence
        for (let i = expandedA.length - 1; i >= 0; i--) {
            const node = expandedA[i];
            if (node.type === "Move") {
                invertedA.push(node.copy().invert());
                continue;
            }
            invertedA.push(node.copy());
        }

        // If this conjugate is inverted, then apply the following transformation:
        // A : B -> A : B'
        // A B A' -> A B' A'
        if (this.amount < 0) {
            for (let i = 0; i < expandedB.length; i++) {
                const node = expandedB[i];
                if (node.type === "Move") {
                    node.invert();
                }
            }
            expandedB.reverse();
        }

        // Return the concatenated arrays in order of A B A' (or A B' A' if expandedB has been inverted)
        const nodes = expandedA.concat(expandedB, invertedA);
        const length = nodes.length;
        arrayRepeat(nodes, Math.abs(this.amount));
        for (let i = length; i < nodes.length; i++) {
            nodes[i] = nodes[i].copy();
        }
        return nodes;
    }

    expandedMoves(): Move[] {
        const expandedA = this.algA.expandedMoves();
        const expandedB = this.algB.expandedMoves();
        const invertedA: Move[] = [];

        // Copy expandedA into a separate array and invert its sequence
        for (let i = expandedA.length - 1; i >= 0; i--) {
            invertedA.push(expandedA[i].copy().invert());;
        }

        // If this conjugate is inverted, then apply the following transformation:
        // A : B -> A : B'
        // A B A' -> A B' A'
        if (this.amount < 0) {
            for (let i = 0; i < expandedB.length; i++) {
                const node = expandedB[i];
                if (node.type === "Move") {
                    node.invert();
                }
            }
            expandedB.reverse();
        }

        // Return the concatenated arrays in order of A B A' (or A B' A' if expandedB has been inverted)
        const nodes = expandedA.concat(expandedB, invertedA);
        const length = nodes.length;
        arrayRepeat(nodes, Math.abs(this.amount));
        for (let i = length; i < nodes.length; i++) {
            nodes[i] = nodes[i].copy();
        }
        return nodes;
    }

    invert(): Conjugate {
        this.algB.invert();
        return this;
    }

    toString(): string {
        const outString = `${this.algA.toString()}:${this.algB.toString()}`;
        if (this.isGrouping) {
            if (Math.abs(this.amount) !== 1) {
                return `[${outString}]${this.amount}${this.amount < 0 ? "'" : ""}`
            }
            return `[${outString}]${this.amount < 0 ? "'" : ""}`;
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