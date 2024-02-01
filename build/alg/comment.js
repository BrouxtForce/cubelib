export class Comment {
    type = "Comment";
    value;
    commentType;
    constructor(comment, commentType) {
        this.value = comment;
        this.commentType = commentType;
    }
    copy() {
        return new Comment(this.value, this.commentType);
    }
    toString() {
        if (this.commentType === "lineComment") {
            return `//${this.value}`;
        }
        return `/*${this.value}*/`;
    }
}
