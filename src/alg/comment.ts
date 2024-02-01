import type { IAlgNonMoveNode } from "./alg.js";

export class Comment implements IAlgNonMoveNode {
    public readonly type = "Comment" as const;
    
    public value: string;
    public commentType: "blockComment" | "lineComment";

    constructor(comment: string, commentType: "blockComment" | "lineComment") {
        this.value = comment;
        this.commentType = commentType;
    }

    copy(): Comment {
        return new Comment(this.value, this.commentType);
    }

    toString(): string {
        if (this.commentType === "lineComment") {
            return `//${this.value}`;
        }
        return `/*${this.value}*/`;
    }
}