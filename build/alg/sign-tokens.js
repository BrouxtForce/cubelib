export class CharacterInputStream {
    input;
    pos = 0;
    line = 1;
    col = 0;
    constructor(input) {
        this.input = input;
    }
    get string() { return this.input; }
    next() {
        let char = this.input.charAt(this.pos);
        this.pos++;
        if (char === "\n") {
            this.line++;
            this.col = 0;
        }
        else {
            this.col++;
        }
        return char;
    }
    peek() {
        return this.input.charAt(this.pos);
    }
    skip(length) {
        for (let i = 0; i < length && this.pos < this.input.length; i++) {
            this.next();
        }
    }
    match(str) {
        return this.input.substring(this.pos, this.pos + str.length) === str;
    }
    eof() {
        return this.peek() === "";
    }
    croak(message) {
        throw `Error Ln ${this.line} Col ${this.col}: ${message}`;
    }
}
export class SiGNTokenInputStream {
    input;
    variableSet = new Set();
    constructor(input) {
        this.input = new CharacterInputStream(input);
    }
    isWhitespace(char) {
        if (!char)
            return false;
        return " \t\n".indexOf(char) > -1;
    }
    isPunctuation(char) {
        if (!char)
            return false;
        return "[](),:=".indexOf(char) > -1;
    }
    isMove(char) {
        if (!char)
            return false;
        return "ufrbldmesxyz".indexOf(char.toLowerCase()) > -1;
    }
    isNumber(char) {
        if (!char)
            return false;
        return "0123456789".indexOf(char) > -1;
    }
    isVariable(char) {
        if (!char)
            return false;
        return (char >= "a" && char <= "z") || (char >= "A" && char <= "Z");
    }
    peekVariable() {
        const str = this.input.string;
        for (let i = this.input.pos; i < str.length; i++) {
            const char = str[i];
            if ((char >= "a" && char <= "z") || (char >= "A" && char <= "Z")) {
                continue;
            }
            return str.substring(this.input.pos, i);
        }
        return str.substring(this.input.pos);
    }
    readWhile(predicate) {
        let stringArray = [];
        while (!this.input.eof() && predicate(this.input.peek())) {
            stringArray.push(this.input.next());
        }
        return stringArray.join("");
    }
    readNumber() {
        return this.readWhile(this.isNumber);
    }
    readMove() {
        let moveString = "";
        if (this.isNumber(this.input.peek())) {
            moveString += this.readNumber();
        }
        if (this.input.peek() === "-") {
            moveString += this.input.next();
            moveString += this.readNumber();
        }
        const face = this.input.next();
        moveString += face;
        let char = this.input.peek();
        if (this.isNumber(char)) {
            moveString += this.readNumber();
            if (this.input.peek() === "'") {
                moveString += this.input.next();
            }
            return moveString;
        }
        switch (char) {
            case "w":
                if ("UFRBLD".indexOf(face) === -1) {
                    this.input.croak("Invalid move before 'w'");
                }
                moveString += this.input.next();
                if (this.isNumber(this.input.peek())) {
                    moveString += this.readNumber();
                }
                if (this.input.peek() === "'") {
                    moveString += this.input.next();
                }
                return moveString;
            case "'":
                return moveString + this.input.next();
        }
        return moveString;
    }
    readPunc() {
        return this.input.next();
    }
    readCommentToken() {
        const pos = this.input.pos;
        const line = this.input.line;
        const col = this.input.col;
        this.input.next();
        switch (this.input.peek()) {
            case "/": {
                this.input.next();
                let comment = this.readWhile((char) => char !== "\n");
                return {
                    type: "lineComment",
                    value: comment,
                    pos, line, col
                };
            }
            case "*": {
                this.input.next();
                let comment = "";
                while (!this.input.eof()) {
                    comment += this.readWhile(char => char !== "*");
                    if (this.input.match("*/")) {
                        this.input.next();
                        this.input.next();
                        return {
                            type: "blockComment",
                            value: comment,
                            pos, line, col
                        };
                    }
                    this.input.next();
                }
                this.input.croak("Syntax Error: Missing end to multi-line comment.");
            }
            default:
                this.input.croak("Syntax Error: Random forward slash.");
        }
    }
    readWhitespace() {
        return this.readWhile(this.isWhitespace);
    }
    readNext() {
        if (this.input.eof()) {
            return null;
        }
        const pos = this.input.pos;
        const line = this.input.line;
        const col = this.input.col;
        let char = this.input.peek();
        if (this.isWhitespace(char)) {
            return {
                type: "whitespace",
                value: this.readWhitespace(),
                pos, line, col
            };
        }
        if (this.isVariable(char)) {
            const variable = this.peekVariable();
            if (this.variableSet.has(variable)) {
                this.input.skip(variable.length);
                let amount = 1;
                if (this.isNumber(this.input.peek())) {
                    amount = Number.parseInt(this.readNumber());
                }
                if (this.input.peek() === "'") {
                    this.input.next();
                    amount *= -1;
                }
                return {
                    type: "variable",
                    value: variable,
                    amount: amount,
                    pos, line, col
                };
            }
            const str = this.input.string;
            for (let i = this.input.pos + variable.length; i < str.length; i++) {
                const char = str[i];
                if (this.isWhitespace(char)) {
                    continue;
                }
                if (char === "=") {
                    this.variableSet.add(variable);
                    this.input.skip(variable.length);
                    return {
                        type: "variable",
                        value: variable,
                        pos, line, col
                    };
                }
                break;
            }
        }
        if (this.isMove(char) || this.isNumber(char)) {
            return {
                type: "move",
                value: this.readMove(),
                pos, line, col
            };
        }
        if (this.isPunctuation(char)) {
            let token = {
                type: "punctuation",
                value: this.readPunc(),
                pos, line, col
            };
            if ((this.isNumber(this.input.peek()) || this.input.peek() === "'") && (token.value === ")" || token.value === "]")) {
                token.amount = Number.parseInt(this.readNumber());
                if (isNaN(token.amount)) {
                    token.amount = 1;
                }
                if (this.input.peek() === "'") {
                    this.input.next();
                    token.amount *= -1;
                }
            }
            return token;
        }
        if (char === "/") {
            return this.readCommentToken();
        }
        this.input.croak(`Syntax Error: Unexpected character: '${char}'`);
    }
}
export function SiGNTokens(moveString) {
    let stream = new SiGNTokenInputStream(moveString);
    let tokenArray = [];
    while (true) {
        let token = stream.readNext();
        if (token === null) {
            break;
        }
        tokenArray.push(token);
    }
    return tokenArray;
}
