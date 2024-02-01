export class Whitespace {
    type = "Whitespace";
    value;
    constructor(whitespace) {
        this.value = whitespace;
    }
    copy() {
        return new Whitespace(this.value);
    }
    toString() {
        return this.value;
    }
}
