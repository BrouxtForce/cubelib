import type { IAlgNonMoveNode } from "./alg.js";

export class Whitespace implements IAlgNonMoveNode {
    public readonly type = "Whitespace" as const;

    public value: string;

    constructor(whitespace: string) {
        this.value = whitespace;
    }

    copy(): Whitespace {
        return new Whitespace(this.value);
    }

    toString(): string {
        return this.value;
    }
}