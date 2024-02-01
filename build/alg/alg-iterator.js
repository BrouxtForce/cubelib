export class MoveIterator {
    move;
    done;
    constructor(move, reverse = false) {
        this.move = reverse ? move.copy().invert() : move;
        this.done = false;
    }
    next() {
        let result;
        if (this.done) {
            result = {
                done: true,
                value: undefined
            };
        }
        else {
            result = {
                done: false,
                value: this.move
            };
            this.done = true;
        }
        return result;
    }
}
export class CommutatorIterator {
    phase;
    algA;
    algB;
    currentIterator;
    constructor(commutator, reverse = false) {
        this.phase = reverse ? 4 : 0;
        this.algA = commutator.algA;
        this.algB = commutator.algB;
        reverse = (reverse) !== (commutator.amount < 0);
        this.currentIterator = new AlgIterator(reverse ? this.algB : this.algA);
    }
    next() {
        const result = this.currentIterator.next();
        if (result.done) {
            this.phase++;
            switch (this.phase) {
                case 1:
                    this.currentIterator = new AlgIterator(this.algB);
                    break;
                case 2:
                    this.currentIterator = new AlgIterator(this.algA, true);
                    break;
                case 3:
                    this.currentIterator = new AlgIterator(this.algB, true);
                    break;
                case 5:
                    this.currentIterator = new AlgIterator(this.algA);
                    break;
                case 6:
                    this.currentIterator = new AlgIterator(this.algB, true);
                    break;
                case 7:
                    this.currentIterator = new AlgIterator(this.algA, true);
                    break;
                case 4:
                case 8:
                    return {
                        done: true,
                        value: undefined
                    };
            }
            return this.currentIterator.next();
        }
        return result;
    }
}
export class ConjugateIterator {
    phase;
    algA;
    algB;
    currentIterator;
    reverse;
    constructor(conjugate, reverse = false) {
        this.phase = 0;
        this.algA = conjugate.algA;
        this.algB = conjugate.algB;
        this.reverse = (reverse) !== (conjugate.amount < 0);
        this.currentIterator = new AlgIterator(this.algA);
    }
    next() {
        const result = this.currentIterator.next();
        if (result.done) {
            this.phase++;
            switch (this.phase) {
                case 1:
                    this.currentIterator = new AlgIterator(this.algB, this.reverse);
                    break;
                case 2:
                    this.currentIterator = new AlgIterator(this.algA, true);
                    break;
                case 3:
                    return {
                        done: true,
                        value: undefined
                    };
            }
            return this.currentIterator.next();
        }
        return result;
    }
}
export class AlgIterator {
    index;
    amount;
    algMoveNodes;
    currentIterator;
    reverse;
    constructor(alg, reverse = false) {
        this.reverse = (reverse) !== (alg.amount < 0);
        this.index = this.reverse ? alg.nodes.length - 1 : 0;
        this.amount = Math.abs(alg.amount);
        this.algMoveNodes = alg.moveNodes;
        this.currentIterator = this.#getIterator(this.algMoveNodes[this.index], this.reverse);
    }
    #getIterator(node, reverse = false) {
        if (!node) {
            return null;
        }
        switch (node.type) {
            case "Move":
                return new MoveIterator(node, reverse);
            case "Commutator":
                return new CommutatorIterator(node, reverse);
            case "Conjugate":
                return new ConjugateIterator(node, reverse);
            case "Alg":
                return new AlgIterator(node, reverse);
            default:
                throw new Error(`Unknown alg move node type: ${node.type}`);
        }
    }
    next() {
        if (this.currentIterator) {
            const result = this.currentIterator.next();
            if (!result.done) {
                return {
                    done: false,
                    value: result.value
                };
            }
        }
        this.index += this.reverse ? -1 : 1;
        if ((this.index < this.algMoveNodes.length && !this.reverse) || (this.index >= 0 && this.reverse)) {
            this.currentIterator = this.#getIterator(this.algMoveNodes[this.index], this.reverse);
            return this.next();
        }
        if (--this.amount > 0) {
            this.index = this.reverse ? this.algMoveNodes.length - 1 : 0;
            this.currentIterator = this.#getIterator(this.algMoveNodes[this.index], this.reverse);
            return this.next();
        }
        return {
            done: true,
            value: undefined
        };
    }
}
