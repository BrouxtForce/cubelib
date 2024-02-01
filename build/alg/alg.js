import { SiGNTokens } from "./sign-tokens.js";
import { AlgIterator } from "./alg-iterator.js";
import { Move } from "./move.js";
import { Commutator } from "./commutator.js";
import { Conjugate } from "./conjugate.js";
import { Comment } from "./comment.js";
import { Whitespace } from "./whitespace.js";
import { arrayRepeat } from "../utils.js";
;
;
export class Alg {
    type = "Alg";
    nodes;
    moveNodes;
    isGrouping = false;
    amount = 1;
    constructor(nodes) {
        this.nodes = nodes;
        this.moveNodes = [];
        for (const node of nodes) {
            switch (node.type) {
                case "Alg":
                case "Move":
                case "Commutator":
                case "Conjugate":
                    this.moveNodes.push(node);
                    break;
            }
        }
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
    expand() {
        if (this.amount === 0) {
            return [];
        }
        const expandedNodes = [];
        for (const node of this.nodes) {
            if (node.type === "Whitespace" || node.type === "Comment") {
                expandedNodes.push(node);
                continue;
            }
            expandedNodes.push(...node.expand());
        }
        if (this.amount < 0) {
            expandedNodes.reverse();
        }
        arrayRepeat(expandedNodes, Math.abs(this.amount));
        return expandedNodes;
    }
    invert() {
        for (const node of this.nodes) {
            if (node.type === "Comment" || node.type === "Whitespace") {
                continue;
            }
            node.invert();
        }
        this.nodes.reverse();
        return this;
    }
    toString() {
        let outString = "";
        for (const node of this.nodes) {
            outString += node.toString();
        }
        if (this.isGrouping) {
            const absAmount = Math.abs(this.amount);
            if (absAmount !== 1) {
                outString += absAmount.toString();
            }
            if (this.amount < 0) {
                outString += "'";
            }
            return `(${outString})`;
        }
        return outString;
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
                node.simplify();
                if (node.type === "Move") {
                    if (node.amount === 0) {
                        this.nodes.splice(i, 1);
                        i--;
                        continue;
                    }
                }
                if (node.type === "Move" && prevNode?.type === "Move") {
                    if (node.face === prevNode.face) {
                        changed = true;
                        prevNode.amount += node.amount;
                        this.nodes.splice(i, 1);
                        i = prevNodeIndex;
                        continue;
                    }
                }
                prevNode = node;
                prevNodeIndex = i;
            }
        }
        return this;
    }
    forward() {
        return { [Symbol.iterator]: () => new AlgIterator(this) };
    }
    reverse() {
        return { [Symbol.iterator]: () => new AlgIterator(this, true) };
    }
    [Symbol.iterator]() {
        return new AlgIterator(this);
    }
    static tokensToAlg(tokens, algAmount, algVariableMap) {
        let alg = new Alg([]);
        alg.amount = algAmount;
        let nodes = alg.nodes;
        let moveNodes = alg.moveNodes;
        for (let i = 0; i < tokens.length; i++) {
            let token = tokens[i];
            switch (token.type) {
                case "move": {
                    const move = Move.fromString(token.value);
                    if (move !== null) {
                        nodes.push(move);
                        moveNodes.push(move);
                    }
                    break;
                }
                case "punctuation": {
                    switch (token.value) {
                        case ",":
                        case ":": {
                            const constructor = (token.value === ",") ? Commutator : Conjugate;
                            const group = new constructor(alg, new Alg([]));
                            const amount = alg.amount;
                            alg.amount = 1;
                            alg = new Alg([group]);
                            alg.amount = amount;
                            nodes = group.algB.nodes;
                            moveNodes = group.algB.moveNodes;
                            break;
                        }
                        case "[":
                        case "(": {
                            let neededClosingBrackets = 1;
                            for (let j = i + 1; j < tokens.length; j++) {
                                if ("])".indexOf(tokens[j].value) > -1) {
                                    neededClosingBrackets--;
                                    if (neededClosingBrackets === 0) {
                                        const group = Alg.tokensToAlg(tokens.slice(i + 1, j), tokens[j].amount ?? 1, algVariableMap);
                                        nodes.push(group);
                                        moveNodes.push(group);
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
                        }
                        case "]":
                        case ")":
                            throw "Unmatched ']' or ')'";
                    }
                    break;
                }
                case "blockComment":
                case "lineComment":
                    nodes.push(new Comment(token.value, token.type));
                    break;
                case "whitespace":
                    nodes.push(new Whitespace(token.value));
                    break;
                case "variable": {
                    let declaringVariable = false;
                    let equalSignIndex = -1;
                    for (let j = i + 1; j < tokens.length; j++) {
                        switch (tokens[j].type) {
                            case "blockComment":
                                if (tokens[j].value.includes("\n")) {
                                    break;
                                }
                            case "whitespace":
                                continue;
                            case "punctuation":
                                if (tokens[j].value === "=") {
                                    declaringVariable = true;
                                    equalSignIndex = j;
                                }
                                break;
                        }
                        break;
                    }
                    if (declaringVariable) {
                        let nonmatchedOpenParentheses = 0;
                        let newLine = false;
                        let j;
                        for (j = equalSignIndex + 1; j < tokens.length; j++) {
                            const algToken = tokens[j];
                            switch (algToken.type) {
                                case "blockComment":
                                    if (algToken.value.includes("\n")) {
                                        newLine = true;
                                    }
                                    break;
                                case "punctuation":
                                    if ("[](),:".indexOf(algToken.value) === -1) {
                                        throw new Error(`Invalid character in variable declaration: '${algToken.value}'`);
                                    }
                                    if (algToken.value === "[" || algToken.value === "(") {
                                        nonmatchedOpenParentheses++;
                                        break;
                                    }
                                    if (algToken.value === "]" || algToken.value === ")") {
                                        nonmatchedOpenParentheses--;
                                    }
                                    break;
                                case "lineComment":
                                    newLine = true;
                                    break;
                                case "whitespace":
                                    if (algToken.value.includes("\n")) {
                                        newLine = true;
                                    }
                                    break;
                                case "variable":
                                    break;
                            }
                            if (newLine && nonmatchedOpenParentheses === 0) {
                                j++;
                                break;
                            }
                        }
                        if (tokens[j - 1].value === "]" || tokens[j - 1].value === ")") {
                            j++;
                        }
                        algVariableMap.set(token.value, this.tokensToAlg(tokens.slice(equalSignIndex + 1, j), 1, algVariableMap));
                        i = j - 1;
                        break;
                    }
                    const algVariable = algVariableMap.get(token.value);
                    if (algVariable === undefined) {
                        throw new Error(`Undefined variable: '${token.value}'`);
                    }
                    if (token.amount === 1 || token.amount === undefined) {
                        nodes.push(algVariable);
                        moveNodes.push(algVariable);
                        break;
                    }
                    const alg = new Alg([algVariable]);
                    alg.amount = token.amount;
                    nodes.push(alg);
                    moveNodes.push(alg);
                    break;
                }
                default:
                    throw `Invalid token type: ${token.type}`;
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
            if (token.type === "punctuation") {
                if ("[]()".indexOf(value) > -1) {
                    if (value === ")" || value === "]") {
                        if (brackets[brackets.length - 1] !== invertBracket(value)) {
                            return `Closing bracket '${value}' does not match opening bracket '${brackets[brackets.length - 1]}'.`;
                        }
                        brackets.pop();
                    }
                    else {
                        brackets.push(value);
                    }
                    continue;
                }
                if (value === "=" && brackets.length !== 0) {
                    return "Syntax error: '=' is not allowed within brackets/parenthesis.";
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
        return Alg.tokensToAlg(tokens, 1, new Map());
    }
}
