import { EmptyIterator } from "./alg-iterator.js";
export class Comment {
    constructor(comment, commentType) {
        this.type = "Comment";
        this.amount = 0;
        this.value = comment;
        this.commentType = commentType;
    }
    copy() { return new Comment(this.value, this.commentType); }
    expand(copy) { return copy ? [this.copy()] : [this]; }
    invert() { return this; }
    inverted() { return this.copy(); }
    toString() {
        if (this.commentType === "lineComment") {
            return `//${this.value}`;
        }
        return `/*${this.value}*/`;
    }
    forwardIterator() {
        return new EmptyIterator();
    }
    reverseIterator() {
        return new EmptyIterator();
    }
    forward() {
        return { [Symbol.iterator]: () => this.forwardIterator() };
    }
    reverse() {
        return { [Symbol.iterator]: () => this.reverseIterator() };
    }
    [Symbol.iterator]() {
        return this.forwardIterator();
    }
}
