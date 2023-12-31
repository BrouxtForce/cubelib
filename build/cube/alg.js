import { SiGNTokens } from "./sign-tokens.js";
import { AlgIterator } from "./alg-iterator.js";
import { Move } from "./move.js";
import { Commutator } from "./commutator.js";
import { Conjugate } from "./conjugate.js";
import { Comment } from "./comment.js";
import { Whitespace } from "./whitespace.js";
export class Alg {
    constructor(nodes) {
        this.type = "Alg";
        this.amount = 1;
        this.nodes = nodes;
    }
    static fromString(moveString) {
        return Alg.parseSiGN(moveString);
    }
    copy() {
        const copiedNodes = [];
        for (const node of this.nodes) {
            copiedNodes.push(node.copy());
        }
        return new Alg(copiedNodes);
    }
    expand(copy = false) {
        const nodes = [];
        if (this.amount > 0) {
            for (const node of this.nodes) {
                nodes.push(...node.expand(copy));
            }
        }
        else {
            for (let i = this.nodes.length - 1; i >= 0; i--) {
                nodes.push(...this.nodes[i].inverted().expand(copy));
            }
        }
        const repeatedNodesArray = [];
        if (copy) {
            for (let i = 0; i < Math.abs(this.amount); i++) {
                let copyArray = [];
                for (let j = 0; j < nodes.length; j++) {
                    copyArray[j] = nodes[j].copy();
                }
                repeatedNodesArray.push(...copyArray);
            }
        }
        else {
            for (let i = 0; i < Math.abs(this.amount); i++) {
                repeatedNodesArray.push(...nodes.slice());
            }
        }
        return repeatedNodesArray;
    }
    expanded() {
        return new Alg(this.expand());
    }
    invert() {
        const invertedNodes = [];
        for (let i = this.nodes.length - 1; i >= 0; i--) {
            this.nodes[i].invert();
            invertedNodes.push(this.nodes[i]);
        }
        for (let i = 0; i < invertedNodes.length; i++) {
            if (invertedNodes[i].type === "Comment") {
                const comment = invertedNodes[i];
                if (comment.commentType !== "lineComment") {
                    continue;
                }
                if (i + 1 >= invertedNodes.length || invertedNodes[i + 1].type === "Whitespace") {
                    const whitespace = invertedNodes[i];
                    if (whitespace.value.indexOf("\n") > -1) {
                        continue;
                    }
                }
                invertedNodes.splice(i, 1);
                let broken = false;
                for (let j = i; j < invertedNodes.length; j++) {
                    if (invertedNodes[j].type === "Whitespace") {
                        const whitespace = invertedNodes[j];
                        if (whitespace.value[0] === "\n") {
                            broken = true;
                            invertedNodes.splice(j, 0, comment);
                            break;
                        }
                    }
                }
                if (!broken) {
                    invertedNodes.push(comment);
                }
            }
        }
        this.nodes = invertedNodes;
        return this;
    }
    inverted() {
        return this.copy().invert();
    }
    toString(parent = true) {
        const stringArray = [];
        for (const node of this.nodes) {
            stringArray.push(node.toString(false));
        }
        if (this.amount === 1 && parent) {
            return stringArray.join("");
        }
        const absAmount = Math.abs(this.amount);
        return `(${stringArray.join("")})${absAmount !== 1 ? absAmount : ""}${this.amount < 0 ? "'" : ""}`;
    }
    stripComments() {
        for (let i = 0; i < this.nodes.length; i++) {
            if (this.nodes[i].type === "Comment") {
                this.nodes.splice(i, 1);
                i--;
                continue;
            }
            this.nodes[i].stripComments?.();
        }
    }
    removeWhitespace(removeNewlines = false) {
        for (let i = 0; i < this.nodes.length; i++) {
            if (this.nodes[i].type === "Whitespace") {
                const whitespace = this.nodes[i];
                if (removeNewlines || whitespace.value.indexOf("\n") === -1) {
                    this.nodes.splice(i, 1);
                    i--;
                    continue;
                }
                whitespace.value = whitespace.value.replace(/./g, "");
                continue;
            }
            this.nodes[i].removeWhitespace?.();
        }
    }
    addWhitespace() {
        for (let i = 0; i < this.nodes.length; i++) {
            this.nodes[i].addWhitespace?.();
            let type = this.nodes[i].type;
            if (type !== "Whitespace") {
                if (i + 1 >= this.nodes.length) {
                    continue;
                }
                if (this.nodes[i + 1].type !== "Whitespace") {
                    this.nodes.splice(i + 1, 0, new Whitespace(" "));
                    i++;
                }
            }
        }
    }
    simplify() {
        let changed = true;
        while (changed) {
            changed = false;
            let prevNode = null;
            let prevNodeIndex = -1;
            for (let i = 0; i < this.nodes.length; i++) {
                let node = this.nodes[i];
                if (node.type === "Whitespace" || node.type === "Comment") {
                    continue;
                }
                node.simplify?.();
                if (node.type === "Move") {
                    if (node.amount % 4 === 0) {
                        this.nodes.splice(i, 1);
                        i--;
                        continue;
                    }
                    node.amount %= 4;
                }
                if (node.type === "Move" && prevNode?.type === "Move") {
                    if (node.face === prevNode.face) {
                        changed = true;
                        prevNode.amount += node.amount;
                        if (node.amount === 0) {
                            this.nodes.splice(prevNodeIndex, 1);
                        }
                        this.nodes.splice(i, 1);
                        i = prevNodeIndex;
                        continue;
                    }
                }
                prevNode = node;
                prevNodeIndex = i;
            }
        }
    }
    forwardIterator() {
        return new AlgIterator(this);
    }
    reverseIterator() {
        return new AlgIterator(this, true);
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
    static tokensToAlg(tokens, amount) {
        let alg = new Alg([]);
        alg.amount = amount ?? 1;
        let nodes = alg.nodes;
        for (let i = 0; i < tokens.length; i++) {
            let token = tokens[i];
            switch (token.type) {
                case "move":
                    const move = Move.fromString(token.value);
                    if (move !== null) {
                        nodes.push(move);
                    }
                    break;
                case "punctuation":
                    switch (token.value) {
                        case ",":
                        case ":":
                            const constructor = (token.value === ",") ? Commutator : Conjugate;
                            const group = new constructor(alg, new Alg([]));
                            const amount = alg.amount;
                            alg.amount = 1;
                            alg = new Alg([group]);
                            alg.amount = amount;
                            nodes = group.algB.nodes;
                            break;
                        case "[":
                        case "(":
                            let neededClosingBrackets = 1;
                            for (let j = i + 1; j < tokens.length; j++) {
                                if ("])".indexOf(tokens[j].value) > -1) {
                                    neededClosingBrackets--;
                                    if (neededClosingBrackets === 0) {
                                        nodes.push(Alg.tokensToAlg(tokens.slice(i + 1, j), tokens[j].amount));
                                        i = j;
                                        token = tokens[j];
                                        break;
                                    }
                                }
                                else if ("([".indexOf(tokens[j].value) > -1) {
                                    neededClosingBrackets++;
                                }
                            }
                            break;
                        case "]":
                        case ")":
                            throw "Unmatched ']' or ')'.";
                    }
                    break;
                case "blockComment":
                case "lineComment":
                    nodes.push(new Comment(token.value, token.type));
                    break;
                case "whitespace":
                    nodes.push(new Whitespace(token.value));
                    break;
                default:
                    throw `Invalid token type: ${token.type}.`;
            }
        }
        return alg;
    }
    static preParseSiGNValidation(tokens) {
        const invertBracket = (bracket) => {
            switch (bracket) {
                case "[": return "]";
                case "]": return "[";
                case ")": return "(";
                case "(": return ")";
                default: throw `String '${bracket}' is not a valid bracket.`;
            }
        };
        let brackets = [];
        for (const token of tokens) {
            const value = token.value;
            if (token.type === "punctuation" && "[]()".indexOf(value) > -1) {
                if (value === ")" || value === "]") {
                    if (brackets[brackets.length - 1] !== invertBracket(value)) {
                        return `Closing bracket '${value}' does not match opening bracket '${brackets[brackets.length - 1]}'.`;
                    }
                    brackets.pop();
                }
                else {
                    brackets.push(value);
                }
            }
        }
        if (brackets.length !== 0) {
            return `'${brackets[brackets.length - 1]}' missing closing bracket.`;
        }
        for (const token of tokens) {
            if (token.type === "move" && "XYZ".indexOf(token.value) > -1) {
                return `'${token.value}' must be lowercase.`;
            }
        }
        return "";
    }
    static parseSiGN(moveString) {
        const tokens = SiGNTokens(moveString);
        const validation = Alg.preParseSiGNValidation(tokens);
        if (validation) {
            throw validation;
        }
        return Alg.tokensToAlg(tokens);
    }
}
