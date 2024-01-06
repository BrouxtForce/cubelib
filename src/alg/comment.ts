import { AlgNode } from "./alg.js";
import { EmptyIterator } from "./alg-iterator.js";

export class Comment implements AlgNode {
    public type = "Comment";
    
    public value: string;
    public commentType: "blockComment" | "lineComment";
    public amount = 0; // Does nothing

    constructor(comment: string, commentType: "blockComment" | "lineComment") {
        this.value = comment;
        this.commentType = commentType;
    }
    copy(): Comment { return new Comment(this.value, this.commentType); }
    expand(copy: boolean): Comment[] { return copy ? [this.copy()] : [this]; }
    invert(): Comment { return this; }
    inverted(): Comment { return this.copy(); }
    toString(): string {
        if (this.commentType === "lineComment") {
            return `//${this.value}`;
        }
        return `/*${this.value}*/`;
    }

    forwardIterator(): Iterator<any> {
        return new EmptyIterator();
    }
    reverseIterator(): Iterator<any> {
        return new EmptyIterator();
    }
    forward() {
        return { [Symbol.iterator]: () => this.forwardIterator() }
    }
    reverse() {
        return { [Symbol.iterator]: () => this.reverseIterator() }
    }
    [Symbol.iterator](): Iterator<any> {
        return this.forwardIterator();
    }
}