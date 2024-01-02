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

    get string(): string { return this.input; }

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
    skip(length: number): void {
        for (let i = 0; i < length && this.pos < this.input.length; i++) {
            this.next();
        }
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
    type: "move" | "punctuation" | "whitespace" | "lineComment" | "blockComment" | "variable";
    value: string;
    amount?: number; // Only used for punctuation and variables
}

export class SiGNTokenInputStream {
    public input: CharacterInputStream;

    private variableSet: Set<string> = new Set();

    constructor(input: string) {
        this.input = new CharacterInputStream(input);
    }

    // Warning: will return true for empty strings
    isWhitespace(char: string): boolean {
        return " \t\n".indexOf(char) > -1;
    }
    isPunctuation(char: string): boolean {
        return "[](),:=".indexOf(char) > -1;
    }
    isMove(char: string): boolean {
        return "ufrbldmesxyz".indexOf(char.toLowerCase()) > -1;
    }
    isNumber(char: string): boolean {
        return "0123456789".indexOf(char) > -1;
    }
    isVariable(char: string): boolean {
        return (char >= "a" && char <= "z") || (char >= "A" && char <= "Z");
    }

    peekVariable(): string {
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
        // This is slightly annoying, because some variable names may be valid SiGN notation.
        // To handle this, any "word" found in the scramble will only be handled as a variable
        // if the variable has already been declared or if the next relevant token is a '='.
        if (this.isVariable(char)) {
            const variable = this.peekVariable();
            if (this.variableSet.has(variable)) {
                // Read over the variable
                this.input.skip(variable.length);

                let amount = 1;

                if (this.isNumber(this.input.peek())) {
                    amount = Number.parseInt(this.readNumber());
                }
                if (this.input.peek() === "'") {
                    this.input.next(); // Reads the apostrophe
                    amount *= -1;
                }

                return {
                    type: "variable",
                    value: variable,
                    amount: amount
                };
            }

            // If the next token is an '=', then this must be a variable
            // Otherwise, it's either a SiGN move or it's illegal
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
                        value: variable
                    };
                }
                break;
            }
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