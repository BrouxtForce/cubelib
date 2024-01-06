import { Alg, AlgNode } from "./alg.js";
import { CommutatorIterator } from "./alg-iterator.js";

export class Commutator implements AlgNode {
    public type = "Commutator";

    public algA: Alg;
    public algB: Alg;

    public amount: number = 1;

    constructor(algA: Alg, algB: Alg) {
        this.algA = algA;
        this.algB = algB;
    }

    copy(): Commutator {
        return new Commutator(this.algA.copy(), this.algB.copy());
    }
    expand(copy: boolean): AlgNode[] {
        const expandedA = this.algA.expand(copy);
        const expandedB = this.algB.expand(copy);
        const invertedA: AlgNode[] = [];
        const invertedB: AlgNode[] = [];

        // Copy expandedA and expandedB into separate arrays and invert the sequences
        for (let i = expandedA.length - 1; i >= 0; i--) {
            invertedA.push(expandedA[i].inverted());
        }
        for (let i = expandedB.length - 1; i >= 0; i--) {
            invertedB.push(expandedB[i].inverted());
        }

        // Return the concatenated arrays in order of A B A' B'
        return expandedA.concat(expandedB, invertedA, invertedB);
    }
    invert(): Commutator {
        let swap = this.algA;
        this.algA = this.algB;
        this.algB = swap;
        return this;
    }
    inverted(): Commutator {
        return new Commutator(this.algB.copy(), this.algA.copy());
    }
    toString(): string {
        return `[${this.algA.toString()},${this.algB.toString()}]`;
    }
    stripComments(): void {
        this.algA.stripComments();
        this.algB.stripComments();
    }
    removeWhitespace(): void {
        this.algA.removeWhitespace();
        this.algB.removeWhitespace();
    }
    addWhitespace(): void {
        this.algA.addWhitespace();
        this.algB.addWhitespace();
    }
    simplify(): void {
        this.algA.simplify();
        this.algB.simplify();
    }

    forwardIterator(): CommutatorIterator {
        return new CommutatorIterator(this);
    }
    reverseIterator(): CommutatorIterator {
        return new CommutatorIterator(this, true);
    }
    forward() {
        return { [Symbol.iterator]: () => this.forwardIterator() };
    }
    reverse() {
        return { [Symbol.iterator]: () => this.reverseIterator() }
    }
    [Symbol.iterator](): CommutatorIterator {
        // if (this.amount < 0) {
        //     this.amount *= -1;
        //     this.invert();
        // }
        // return new CommutatorIterator(this);
        return this.forwardIterator();
    }
}