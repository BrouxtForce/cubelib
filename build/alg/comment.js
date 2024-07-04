export class Comment {
    type = "Comment";
    value;
    constructor(comment) {
        this.value = comment;
    }
    copy() {
        return new Comment(this.value);
    }
    toString() {
        return this.value;
    }
}
