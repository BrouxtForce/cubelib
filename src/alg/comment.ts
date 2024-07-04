import type { IAlgNonMoveNode } from "./alg.js";

export class Comment implements IAlgNonMoveNode {
    public readonly type = "Comment" as const;
    
    public value: string;

    constructor(comment: string) {
        this.value = comment;
    }

    copy(): Comment {
        return new Comment(this.value);
    }

    toString(): string {
        return this.value;
    }
}