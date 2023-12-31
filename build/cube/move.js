import { MoveIterator } from "./alg-iterator.js";
import { SiGNTokenInputStream } from "./sign-tokens.js";
export class Move {
    constructor(face, shallow, deep, amount) {
        this.type = "Move";
        this.shallow = 1;
        this.deep = 1;
        this.face = face;
        this.shallow = shallow;
        this.deep = deep;
        this.amount = amount;
    }
    static fromString(moveString) {
        let face, shallow = 1, deep = 1, amount = 1;
        const stream = new SiGNTokenInputStream(moveString);
        let char = stream.input.peek();
        if (stream.isNumber(char)) {
            deep = Number.parseInt(stream.readNumber());
            if (stream.input.peek() === "-") {
                stream.input.next();
                let newDeep = Number.parseInt(stream.readNumber());
                shallow = deep;
                deep = newDeep;
            }
        }
        face = stream.input.next();
        if (face === face.toUpperCase() && stream.input.peek() !== "w" && deep !== 1) {
            shallow = deep;
        }
        if (stream.input.peek() === "w" || face === face.toLowerCase()) {
            if (deep === 1) {
                deep = 2;
            }
        }
        if ("UFRBLD".indexOf(face.toUpperCase()) !== -1) {
            face = face.toUpperCase();
        }
        if (stream.input.peek() === "w") {
            stream.input.next();
        }
        if (stream.isNumber(stream.input.peek()) && !stream.input.eof()) {
            amount = Number.parseInt(stream.readNumber());
        }
        if (stream.input.peek() === "'") {
            stream.input.next();
            amount *= -1;
        }
        if (!Number.isSafeInteger(shallow) || !Number.isSafeInteger(deep) || !Number.isSafeInteger(amount)) {
            throw `Invalid move: Number too large to have precise behavior.`;
        }
        if (face.length === 0) {
            throw "Invalid move: Face is missing.";
        }
        if ("UFRBLDMESmesxyz".indexOf(face) === -1) {
            throw `Invalid move`;
        }
        if (shallow > deep) {
            throw "Invalid move: Shallow index cannot be greater than deep index.";
        }
        if (shallow < 1) {
            throw "Invalid move: Shallow index must be at least 1.";
        }
        return new Move(face, shallow, deep, amount);
    }
    copy() {
        return new Move(this.face, this.shallow, this.deep, this.amount);
    }
    expand(copy) {
        return copy ? [this] : [this.copy()];
    }
    invert() {
        this.amount *= -1;
        return this;
    }
    inverted() {
        return new Move(this.face, this.shallow, this.deep, -this.amount);
    }
    toString() {
        const stringArray = [];
        let lowercase = false;
        if (this.deep !== 1) {
            lowercase = true;
            if (this.shallow !== 1) {
                if (this.shallow === this.deep) {
                    stringArray.push(this.shallow);
                    lowercase = false;
                }
                else {
                    stringArray.push(this.shallow, "-", this.deep);
                }
            }
            else if (this.deep !== 2) {
                stringArray.push(this.deep);
            }
        }
        if (lowercase) {
            stringArray.push(this.face.toLowerCase());
        }
        else {
            stringArray.push(this.face);
        }
        if (Math.abs(this.amount) !== 1) {
            stringArray.push(Math.abs(this.amount));
        }
        if (this.amount < 0) {
            stringArray.push("'");
        }
        return stringArray.join("");
    }
    forwardIterator() {
        return new MoveIterator(this);
    }
    reverseIterator() {
        return new MoveIterator(this, true);
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
