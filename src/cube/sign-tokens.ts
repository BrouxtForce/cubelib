/*
    Ref: https://lisperator.net/pltut/parser/
*/

export class CharacterInputStream {
    private input: string;

    public pos: number = 0;
    public line: number = 1;
    public col: number = 0;

    constructor(input: string) {
        this.input = input;
    }

    next(): string {
        let char = this.input.charAt(this.pos);
        this.pos++;
        if (char === "\n") {
            this.line++;
            this.col = 0;
        } else {
            this.col++;
        }
        return char;
    }
    peek(): string {
        return this.input.charAt(this.pos);
    }
    match(str: string): boolean {
        return this.input.substring(this.pos, this.pos + str.length) === str;
    }
    eof(): boolean {
        return this.peek() === "";
    }
    croak(message: string): never {
        throw `Error Ln ${this.line} Col ${this.col}: ${message}`;
    }

}

export interface SiGNToken {
    type: "move" | "punctuation" | "whitespace" | "lineComment" | "blockComment";
    value: string;
    amount?: number; // Only used for punctuation
}

export class SiGNTokenInputStream {
    public input: CharacterInputStream;

    constructor(input: string) {
        this.input = new CharacterInputStream(input);
    }

    // Warning: will return true for empty strings
    isWhitespace(char: string): boolean {
        return " \t\n".indexOf(char) > -1;
    }
    isPunctuation(char: string): boolean {
        return "[](),:".indexOf(char) > -1;
    }
    isMove(char: string): boolean {
        return "ufrbldmesxyz".indexOf(char.toLowerCase()) > -1;
    }
    isNumber(char: string): boolean {
        return "0123456789".indexOf(char) > -1;
    }

    readWhile(predicate: (char: string) => any): string {
        let stringArray: string[] = [];
        while (!this.input.eof() && predicate(this.input.peek())) {
            stringArray.push(this.input.next());
        }
        return stringArray.join("");
    }
    readNumber(): string {
        return this.readWhile(this.isNumber);
    }
    readMove(): string {
        let moveString = "";

        // Check for both number prefixes
        if (this.isNumber(this.input.peek())) {
            moveString += this.readNumber();
        }
        if (this.input.peek() === "-") {
            moveString += this.input.next();
            moveString += this.readNumber();
        }

        const face = this.input.next();
        moveString += face;

        // Check for number suffix
        let char = this.input.peek();
        if (this.isNumber(char)) {
            moveString += this.readNumber();
            if (this.input.peek() === "'") {
                moveString += this.input.next();
            }
            return moveString;
        }

        // Check for wide and inverse moves
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
    readPunc(): string {
        return this.input.next();
    }
    readCommentToken(): { type: "lineComment" | "blockComment", value: string } | null {
        // Both line comments and block comments start with '/', so we can skip this value
        this.input.next();
    
        switch (this.input.peek()) {
            // Line comment: Read until end of line
            case "/": {
                // Skip the '/'
                this.input.next();

                let comment = this.readWhile((char: string) => char !== "\n");
                return {
                    type: "lineComment",
                    value: comment
                };
            }
            // Block comment: Read until matching "*/"
            case "*": {
                // Skip the '*'
                this.input.next();

                let comment = "";
                while (!this.input.eof()) {
                    comment += this.readWhile(char => char !== "*");
                    if (this.input.match("*/")) {
                        this.input.next(); // Reads '*'
                        this.input.next(); // Reads '/'
                        return {
                            type: "blockComment",
                            value: comment
                        };
                    }
                    // Read the '*' to avoid an infinite loop
                    this.input.next();
                }
                this.input.croak("Syntax Error: Missing end to multi-line comment.");
            }
            default:
                this.input.croak("Syntax Error: Random forward slash.");
        }
    }
    readWhitespace(): string {
        return this.readWhile(this.isWhitespace);
    }

    readNext(): SiGNToken | null {
        if (this.input.eof()) {
            return null;
        }

        let char = this.input.peek();
        if (this.isWhitespace(char)) {
            return {
                type: "whitespace",
                value: this.readWhitespace()
            };
        }
        if (this.isMove(char) || this.isNumber(char)) {
            return {
                type: "move",
                value: this.readMove()
            };
        }
        if (this.isPunctuation(char)) {
            let token: SiGNToken = {
                type: "punctuation",
                value: this.readPunc()
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

export function SiGNTokens(moveString: string): SiGNToken[] {
    let stream = new SiGNTokenInputStream(moveString);
    let tokenArray: SiGNToken[] = [];

    while (true) {
        let token = stream.readNext();
        if (token === null) {
            break;
        }
        tokenArray.push(token);
    }

    return tokenArray;
}