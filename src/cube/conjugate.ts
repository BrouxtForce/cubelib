import { Alg, AlgNode } from "./alg";
import { ConjugateIterator } from "./alg-iterator.js";

export class Conjugate implements AlgNode {
    public type = "Conjugate";

    public algA: Alg;
    public algB: Alg;

    public amount: number = 1;

    constructor(algA: Alg, algB: Alg) {
        this.algA = algA;
        this.algB = algB;
    }

    copy(): Conjugate {
        return new Conjugate(this.algA.copy(), this.algB.copy());
    }
    expand(copy: boolean): AlgNode[] {
        const expandedA = this.algA.expand(copy);
        const expandedB = this.algB.expand(copy);
        const invertedA: AlgNode[] = [];

        // Copy expandedA into a separate array and invert its sequence
        for (let i = expandedA.length - 1; i >= 0; i--) {
            invertedA.push(expandedA[i].inverted());
        }

        // Return the concatenated arrays in order of A B A'
        return expandedA.concat(expandedB, invertedA);
    }
    invert(): Conjugate {
        this.algB.invert();
        return this;
    }
    inverted(): Conjugate {
        return new Conjugate(this.algA.copy(), this.algB.inverted());
    }
    toString(): string {
        return `[${this.algA.toString()}:${this.algB.toString()}]`;
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

    forwardIterator(): ConjugateIterator {
        return new ConjugateIterator(this);
    }
    reverseIterator(): ConjugateIterator {
        return new ConjugateIterator(this, true);
    }
    forward() {
        return { [Symbol.iterator]: () => this.forwardIterator() };
    }
    reverse() {
        return { [Symbol.iterator]: () => this.reverseIterator() };
    }
    [Symbol.iterator](): ConjugateIterator {
        // if (this.amount < 0) {
        //     this.amount *= -1;
        //     this.invert();
        // }
        return this.forwardIterator();
    }
}