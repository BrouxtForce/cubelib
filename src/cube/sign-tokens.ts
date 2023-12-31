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

    next() {
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
    peek() {
        return this.input.charAt(this.pos);
    }
    eof() {
        return this.peek() === "";
    }
    croak(message: string) {
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
    isForwardSlash(char: string): boolean {
        return char === "/";
    }

    readWhile(func: (char: string) => any): string {
        let stringArray: string[] = [];
        while (!this.input.eof() && func(this.input.peek())) {
            stringArray.push(this.input.next());
        }
        return stringArray.join("");
    }
    readNumber(): string {
        return this.readWhile(this.isNumber);
    }
    readMove(): string {
        let move = "";
        if (this.isNumber(this.input.peek())) {
            move += this.readNumber();
        }
        if (this.input.peek() === "-") {
            move += this.input.next();
            move += this.readNumber();
        }

        move += this.input.next();
        let char = this.input.peek();
        if (this.isNumber(char)) {
            move += this.readNumber();
            if (this.input.peek() === "'") {
                move += this.input.next();
            }
            return move;
        }
        switch (char) {
            case "w":
                if ("UFRBLD".indexOf(move[move.length - 1]) === -1) {
                    this.input.croak("Invalid move before 'w'");
                }
                move += this.input.next();
                if (this.isNumber(this.input.peek())) {
                    move += this.readNumber();
                }
                if (this.input.peek() === "'") {
                    move += this.input.next();
                }
                return move;
            case "'":
                return move + this.input.next();
        }
        return move;
    }
    readPunc(): string {
        return this.input.next();
    }
    readCommentToken(): { type: "lineComment" | "blockComment", value: string } | null {
        this.input.next(); // First '/' in comment declaration
        if (this.input.peek() === "/") {
            this.input.next();
            
            let comment = this.readWhile((char: string) => char !== "\n");
            return {
                type: "lineComment",
                value: comment
            };
        }
        if (this.input.peek() === "*") {
            this.input.next();

            let comment = "";
            let char = "";
            while (!this.input.eof()) {
                char = this.input.next();
                if (char === "*" && this.input.peek() === "/") {
                    this.input.next();
                    return {
                        type: "blockComment",
                        value: comment
                    };
                } else {
                    comment += char;
                }
            }
            this.input.croak("Syntax Error: Missing end to multi-line comment.");
            return null;
        }
        this.input.croak("Syntax Error: Random forward slash.");
        return null;
    }
    readWhitespace(): string {
        return this.readWhile(this.isWhitespace);
    }

    readNext(): SiGNToken | null {
        while (true) {
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
            if (this.isForwardSlash(char)) {
                // It's fine if it returns null because the alg will not finish parsing if there is an error
                return this.readCommentToken();
            }

            this.input.croak(`Syntax Error: ${char}`);
        }
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