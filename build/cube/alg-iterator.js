export class MoveIterator {
    constructor(move, reverse = false) {
        this.move = reverse ? move.inverted() : move;
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
    constructor(commutator, reverse = false) {
        this.phase = reverse ? 4 : 0;
        this.algA = commutator.algA;
        this.algB = commutator.algB;
        reverse = (reverse) !== (commutator.amount < 0);
        this.currentIterator = reverse ? this.algB.forwardIterator() : this.algA.forwardIterator();
    }
    next() {
        const result = this.currentIterator.next();
        if (result.done) {
            this.phase++;
            switch (this.phase) {
                case 1:
                    this.currentIterator = this.algB.forwardIterator();
                    break;
                case 2:
                    this.currentIterator = this.algA.reverseIterator();
                    break;
                case 3:
                    this.currentIterator = this.algB.reverseIterator();
                    break;
                case 5:
                    this.currentIterator = this.algA.forwardIterator();
                    break;
                case 6:
                    this.currentIterator = this.algB.reverseIterator();
                    break;
                case 7:
                    this.currentIterator = this.algA.reverseIterator();
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
    constructor(conjugate, reverse = false) {
        this.phase = 0;
        this.algA = conjugate.algA;
        this.algB = conjugate.algB;
        this.reverse = (reverse) !== (conjugate.amount < 0);
        this.currentIterator = this.algA.forwardIterator();
    }
    next() {
        const result = this.currentIterator.next();
        if (result.done) {
            this.phase++;
            switch (this.phase) {
                case 1:
                    this.currentIterator = this.reverse ? this.algB.reverseIterator() : this.algB.forwardIterator();
                    break;
                case 2:
                    this.currentIterator = this.algA.reverseIterator();
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
    constructor(alg, reverse = false) {
        this.reverse = (reverse) !== (alg.amount < 0);
        this.index = this.reverse ? alg.nodes.length - 1 : 0;
        this.amount = Math.abs(alg.amount);
        this.algNodes = alg.nodes;
        this.currentIterator = this.algNodes[this.index]?.[this.reverse ? "reverseIterator" : "forwardIterator"]?.();
    }
    next() {
        if (this.algNodes.length === 0) {
            return {
                done: true,
                value: undefined
            };
        }
        const result = this.currentIterator.next();
        if (!result.done) {
            return {
                done: false,
                value: result.value
            };
        }
        this.index += this.reverse ? -1 : 1;
        if ((this.index < this.algNodes.length && !this.reverse) || (this.index >= 0 && this.reverse)) {
            this.currentIterator = this.algNodes[this.index][this.reverse ? "reverseIterator" : "forwardIterator"]();
            return this.next();
        }
        else {
            if (--this.amount > 0) {
                this.index = this.reverse ? this.algNodes.length - 1 : 0;
                this.currentIterator = this.algNodes[this.index][this.reverse ? "reverseIterator" : "forwardIterator"]();
                return this.next();
            }
            else {
                return {
                    done: true,
                    value: undefined
                };
            }
        }
    }
}
export class EmptyIterator {
    next() {
        return {
            done: true,
            value: undefined
        };
    }
}
