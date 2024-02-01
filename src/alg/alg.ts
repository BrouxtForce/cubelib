import { SiGNTokens, type SiGNToken } from "./sign-tokens.js";
import { AlgIterator } from "./alg-iterator.js";
import { Move } from "./move.js";
import { Commutator } from "./commutator.js";
import { Conjugate } from "./conjugate.js";
import { Comment } from "./comment.js";
import { Whitespace } from "./whitespace.js";
import { arrayRepeat } from "../utils.js";

export interface IAlgMoveNode {
    name?: string;
    type: string;
    amount: number;

    copy(): IAlgMoveNode;
    expand(): (Move | IAlgNonMoveNode)[];
    invert(): IAlgMoveNode;
    simplify(): IAlgMoveNode;
    toString(): string;

    [Symbol.iterator](): Iterator<Move>;
    forward(): { [Symbol.iterator](): Iterator<Move> };
    reverse(): { [Symbol.iterator](): Iterator<Move> };
};

export interface IAlgNonMoveNode {
    type: string;

    copy(): IAlgNonMoveNode;
    toString(): string;
};

export type AlgMoveNode = Move | Commutator | Conjugate | Alg;
export type AlgNonMoveNode = Comment | Whitespace;
export type AlgNode = AlgMoveNode | AlgNonMoveNode;

export class Alg implements IAlgMoveNode {
    public readonly type = "Alg" as const;

    public readonly nodes: AlgNode[];
    public readonly moveNodes: AlgMoveNode[];

    public isGrouping: boolean;

    public amount: number;

    constructor(nodes: AlgNode[], amount: number = 1, isGrouping: boolean = false) {
        this.nodes = nodes;
        this.moveNodes = [];
        this.amount = amount;
        this.isGrouping = isGrouping;

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

    static fromString(moveString: string): Alg {
        return Alg.parseSiGN(moveString);
    }

    copy(): Alg {
        const copiedNodes: AlgNode[] = [];
        for (const node of this.nodes) {
            copiedNodes.push(node.copy());
        }
        return new Alg(copiedNodes, this.amount, this.isGrouping);
    }

    expand(): (Move | AlgNonMoveNode)[] {
        if (this.amount === 0) {
            return [];
        }

        const expandedNodes: (Move | AlgNonMoveNode)[] = [];

        for (const node of this.nodes) {
            if (node.type === "Whitespace" || node.type === "Comment") {
                expandedNodes.push(node);
                continue;
            }
            expandedNodes.push(...node.copy().expand());
        }

        if (this.amount < 0) {
            expandedNodes.reverse();
            for (const node of expandedNodes) {
                if (node.type === "Move") {
                    node.invert();
                }
            }
        }

        arrayRepeat(expandedNodes, Math.abs(this.amount));

        return expandedNodes;
    }

    invert(): Alg {
        for (const node of this.moveNodes) {
            node.invert();
        }
        this.nodes.reverse();

        // TODO: Fix line comments
        return this;
    }

    toString(): string {
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

        // If this is not a grouping, it is assumed that this.amount === 1
        return outString;
    }

    simplify(): Alg {
        let changed = true;
        while (changed) {
            changed = false;

            let prevNode: AlgMoveNode | null = null;
            let prevNodeIndex = -1;
            for (let i = 0; i < this.nodes.length; i++) {
                let node = this.nodes[i];

                // Skip over whitespaces and comments
                if (node.type === "Whitespace" || node.type === "Comment") {
                    continue;
                }

                // Simplify the node
                node.simplify();

                // If a move does nothing, remove it (e.g. R0, L0, etc.)
                if (node.type === "Move") {
                    if (node.amount === 0) {
                        this.nodes.splice(i, 1);
                        i--;
                        continue;
                    }
                }

                // Merge two moves together if possible
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
    [Symbol.iterator](): AlgIterator {
        return new AlgIterator(this);
    }

    private static tokensToAlg(tokens: SiGNToken[], algAmount: number, algVariableMap: Map<string, Alg>): Alg {
        let alg = new Alg([]);
        alg.amount = algAmount;
        let nodes: AlgNode[] = alg.nodes;
        let moveNodes: AlgMoveNode[] = alg.moveNodes;

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
                        // case "'":
                        //     const prevNode = nodes[nodes.length - 1];
                        //     prevNode.amount *= -1;
                        //     break;
                        case ",": case ":": {
                            // TODO: This is black magic. Pls insert comments to explain.
                            const constructor: typeof Commutator | typeof Conjugate = (token.value === ",") ? Commutator : Conjugate;

                            const group = new constructor(alg, new Alg([]));
                            const amount = alg.amount;
                            alg.amount = 1;
                            alg = new Alg([group]);
                            alg.amount = amount;
                            nodes = group.algB.nodes;
                            moveNodes = group.algB.moveNodes;
                            break;
                        }
                        case "[": case "(": {
                            let neededClosingBrackets = 1;
                            for (let j = i + 1; j < tokens.length; j++) {
                                if ("])".indexOf(tokens[j].value) > -1) {
                                    neededClosingBrackets--;
                                    if (neededClosingBrackets === 0) {
                                        // nodes.push(Alg.tokensToAlg(tokens.slice(i + 1, j), tokens[j].amount ?? 1, algVariableMap));
                                        const group = Alg.tokensToAlg(tokens.slice(i + 1, j), tokens[j].amount ?? 1, algVariableMap);
                                        nodes.push(group);
                                        moveNodes.push(group);
                                        i = j;
                                        token = tokens[j];
                                        break;
                                    }
                                } else if ("([".indexOf(tokens[j].value) > -1) {
                                    neededClosingBrackets++;
                                }
                            }
                            break;
                        }
                        case "]": case ")":
                            throw "Unmatched ']' or ')'";
                    }
                    break;
                }
                case "blockComment": case "lineComment":
                    nodes.push(new Comment(token.value, token.type));
                    break;
                case "whitespace":
                    nodes.push(new Whitespace(token.value));
                    break;
                case "variable": {
                    // Check whether or not the variable is followed by a '=' token
                    let declaringVariable = false;
                    let equalSignIndex = -1;
                    for (let j = i + 1; j < tokens.length; j++) {
                        switch (tokens[j].type) {
                            case "blockComment":
                                if (tokens[j].value.includes("\n")) {
                                    break;
                                }
                                // Fallthrough
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

                    // If declaring the variable, read its value
                    // Variable declaration is terminated by either a new line character or matching closing parentheses
                    if (declaringVariable) {
                        let nonmatchedOpenParentheses = 0;
                        let newLine = false;
                        let j: number;
                        for (j = equalSignIndex + 1; j < tokens.length; j++) {
                            const algToken = tokens[j];
                            switch (algToken.type) {
                                case "blockComment":
                                    if (algToken.value.includes("\n")) {
                                        newLine = true;
                                    }
                                    break;
                                case "punctuation":
                                    // Whitelist the allowed punctutation in a variable definition
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
                        
                        // If the last token was a closing bracket, include it in the alg. Otherwise, don't.
                        if (tokens[j - 1].value === "]" || tokens[j - 1].value === ")") {
                            j++;
                        }
                        algVariableMap.set(token.value, this.tokensToAlg(tokens.slice(equalSignIndex + 1, j), 1, algVariableMap));
                        i = j - 1;

                        break;
                    }

                    // Otherwise, substitute in the variable
                    const algVariable = algVariableMap.get(token.value);
                    if (algVariable === undefined) {
                        throw new Error(`Undefined variable: '${token.value}'`);
                    }

                    // If the alg is being executed exactly once in order, simply push the alg directly
                    if (token.amount === 1 || token.amount === undefined) {
                        nodes.push(algVariable);
                        moveNodes.push(algVariable);
                        break;
                    }

                    // Otherwise, we must wrap the alg variable in a new alg with the specified amount,
                    // since there may be more references to the alg variable throughout the alg.
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

    private static preParseSiGNValidation(tokens: SiGNToken[]): string {
        // Helper function
        const invertBracket = (bracket: string) => {
            switch (bracket) {
                case "[": return "]";
                case "]": return "[";
                case ")": return "(";
                case "(": return ")";
                default: throw `String '${bracket}' is not a valid bracket.`;
            }
        };
        
        // Check for matching [] and ()
        let brackets: string[] = [];
        for (const token of tokens) {
            const value = token.value;
            if (token.type === "punctuation") {
                if ("[]()".indexOf(value) > -1) {
                    if (value === ")" || value === "]") {
                        if (brackets[brackets.length - 1] !== invertBracket(value)) {
                            return `Closing bracket '${value}' does not match opening bracket '${brackets[brackets.length - 1]}'.`;
                        }
                        brackets.pop();
                    } else {
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

        // Check for uppercase XYZ (illegal)
        for (const token of tokens) {
            if (token.type === "move" && "XYZ".indexOf(token.value) > -1) {
                return `'${token.value}' must be lowercase.`;
            }
        }

        return "";
    }

    private static parseSiGN(moveString: string): Alg {
        const tokens = SiGNTokens(moveString);

        // TODO: Input validation (checking for the same amount of open/close brackets, etc) for better error messages
        const validation = Alg.preParseSiGNValidation(tokens)
        if (validation) {
            throw validation;
        }

        return Alg.tokensToAlg(tokens, 1, new Map());
    }
}