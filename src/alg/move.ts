import type { IAlgMoveNode } from "./alg.js";
import { MoveIterator } from "./alg-iterator.js";
import { SiGNTokenInputStream } from "./sign-tokens.js";
import { mod } from "../utils.js";

export class Move implements IAlgMoveNode {
    public readonly type = "Move" as const;

    public face: string;
    public shallow: number = 1;
    public deep: number = 1;
    public amount: number;

    constructor(face: string, shallow: number, deep: number, amount: number) {
        this.face = face;
        this.shallow = shallow;
        this.deep = deep;
        this.amount = amount;
    }

    // Move.fromString() is strict, requiring proper move notation without a single extra character
    // TODO: Validation and errors
    static fromString(moveString: string): Move {
        let face: string, shallow: number = 1, deep: number = 1, amount: number = 1;

        const stream = new SiGNTokenInputStream(moveString);

        let char = stream.input.peek();

        // Wide layer turns
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

        // Face letter
        face = stream.input.next();

        // Ex: 2R is 2-2r, so shallow and deep should both be 2. Check against 'w' because 2Rw != 2-2r
        if (face === face.toUpperCase() && stream.input.peek() !== "w" && !shallowSpecified && deep !== 1) {
            shallow = deep;
        }

        // Implicitly 2w
        if (stream.input.peek() === "w" || face === face.toLowerCase()) {
            // If 'deep' is already defined, overwriting it would be problematic
            if (deep === 1) {
                deep = 2;
            }
        }

        // Face letter should be forced uppercase if it's UFRBLD
        if ("UFRBLD".indexOf(face.toUpperCase()) !== -1) {
            face = face.toUpperCase();
        }

        // Skip over 'w'
        if (stream.input.peek() === "w") {
            stream.input.next();
        }

        // Turn amount
        if (stream.isNumber(stream.input.peek()) && !stream.input.eof()) {
            amount = Number.parseInt(stream.readNumber());
        }

        // Check for inverse
        if (stream.input.peek() === "'") {
            stream.input.next();
            amount *= -1;
        }

        // Big number error handling
        if (!Number.isSafeInteger(shallow) || !Number.isSafeInteger(deep) || !Number.isSafeInteger(amount)) {
            throw `Invalid move: Number too large to have precise behavior.`;
        }

        if (face.length === 0) {
            throw "Invalid move: Face is missing."
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

    copy(): Move {
        return new Move(this.face, this.shallow, this.deep, this.amount);
    }

    expanded(): Move[] {
        return [this.copy()];
    }

    expandedMoves(): Move[] {
        return [this.copy()];
    }

    invert(): Move {
        this.amount *= -1;
        return this;
    }

    toString(): string {
        let outString = "";

        let lowercase = false; // Defines whether the face turn (ex: 'F"') should be lowercase

        // Wide layer
        if (this.deep !== 1) {
            lowercase = true;

            // Ex: 2-5
            // If shallow isn't one, deep also cannot be one (otherwise the move wouldn't do anything)
            if (this.shallow !== 1) {
                // If shallow == deep, and 2-2r == 2R, then we should output 2R for simplicity
                if (this.shallow === this.deep) {
                    outString += this.shallow;
                    lowercase = false;
                } else {
                    outString += this.shallow + "-" + this.deep;
                }
            }

            // r is implicitly 2r, skip if deep == 2
            else if (this.deep !== 2) {
                outString += this.deep;
            }
        }

        // Face (TODO: Add option for both 'w' and lowercase face)
        if (lowercase) {
            outString += this.face.toLowerCase();
        } else {
            outString += this.face;
        }

        // Turn amount
        if (Math.abs(this.amount) !== 1) {
            outString += Math.abs(this.amount);
        }
        if (this.amount < 0) {
            outString += "'";
        }

        return outString;
    }

    simplify(): IAlgMoveNode {
        this.amount %= 4;

        if (Math.abs(this.amount) === 3) {
            this.amount = -Math.sign(this.amount);
        }

        return this;
    }

    equal(move: Move): boolean {
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
    [Symbol.iterator](): MoveIterator {
        return new MoveIterator(this);
    }
}