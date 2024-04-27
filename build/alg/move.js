import { MoveIterator } from "./alg-iterator.js";
import { SiGNTokenInputStream } from "./sign-tokens.js";
import { mod } from "../utils.js";
export class Move {
    type = "Move";
    face;
    shallow = 1;
    deep = 1;
    amount;
    constructor(face, shallow, deep, amount) {
        this.face = face;
        this.shallow = shallow;
        this.deep = deep;
        this.amount = amount;
    }
    static fromString(moveString) {
        let face, shallow = 1, deep = 1, amount = 1;
        const stream = new SiGNTokenInputStream(moveString);
        let char = stream.input.peek();
        let shallowSpecified = false;
        if (stream.isNumber(char)) {
            deep = Number.parseInt(stream.readNumber());
            if (stream.input.peek() === "-") {
                stream.input.next();
                let newDeep = Number.parseInt(stream.readNumber());
                shallow = deep;
                deep = newDeep;
                shallowSpecified = true;
            }
        }
        face = stream.input.next();
        if (face === face.toUpperCase() && stream.input.peek() !== "w" && !shallowSpecified && deep !== 1) {
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
    expanded() {
        return [this.copy()];
    }
    expandedMoves() {
        return [this.copy()];
    }
    invert() {
        this.amount *= -1;
        return this;
    }
    toString() {
        let outString = "";
        let lowercase = false;
        if (this.deep !== 1) {
            lowercase = true;
            if (this.shallow !== 1) {
                if (this.shallow === this.deep) {
                    outString += this.shallow;
                    lowercase = false;
                }
                else {
                    outString += this.shallow + "-" + this.deep;
                }
            }
            else if (this.deep !== 2) {
                outString += this.deep;
            }
        }
        if (lowercase) {
            outString += this.face.toLowerCase();
        }
        else {
            outString += this.face;
        }
        if (Math.abs(this.amount) !== 1) {
            outString += Math.abs(this.amount);
        }
        if (this.amount < 0) {
            outString += "'";
        }
        return outString;
    }
    simplify() {
        this.amount %= 4;
        if (Math.abs(this.amount) === 3) {
            this.amount = -Math.sign(this.amount);
        }
        return this;
    }
    equal(move) {
        return mod(this.amount, 4) === mod(move.amount, 4) &&
            this.face === move.face &&
            this.shallow === move.shallow &&
            this.deep === move.deep;
    }
    forward() {
        return { [Symbol.iterator]: () => new MoveIterator(this) };
    }
    reverse() {
        return { [Symbol.iterator]: () => new MoveIterator(this, true) };
    }
    [Symbol.iterator]() {
        return new MoveIterator(this);
    }
}
