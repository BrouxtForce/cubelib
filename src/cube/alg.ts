import { SiGNTokens, SiGNToken } from "./sign-tokens.js";
import { AlgIterator } from "./alg-iterator.js";
import { Move } from "./move.js";
import { Commutator } from "./commutator.js";
import { Conjugate } from "./conjugate.js";
import { Comment } from "./comment.js";
import { Whitespace } from "./whitespace.js";

// TODO: Optimization (for both this and sign-tokens.ts)

export interface AlgNode {
    type: string; // Type of AlgNode
    amount: number; // Amount of times the node should be executed. Negative means to invert the node

    copy(): AlgNode; // Returns a deep copy of the AlgNode
    expand(copy: boolean): AlgNode[]; // Expands the node into a (Move | Comment | Whitespace)[], written as AlgNode[] for simplicity
    invert(): AlgNode; // Inverts the AlgNode
    inverted(): AlgNode; // Returns an inverted copy of the AlgNode
    simplify?(): void; // Simplifies the node (Combines and mod 4's moves).
    toString(parent?: boolean): string; // Returns a string representation of the AlgNode. Parameter used internally.

    stripComments?(): void; // (optional) Strips comments from the node
    removeWhitespace?(): void; // (optional) Removes whitespace (except \n's) from the node
    addWhitespace?(): void; // (optional) Adds whitespace where it makes sense to the node

    [Symbol.iterator](): Iterator<any>;
    forwardIterator(): Iterator<any>;
    reverseIterator(): Iterator<any>;
    forward(): { [Symbol.iterator](): Iterator<any> };
    reverse(): { [Symbol.iterator](): Iterator<any> };
}

export class Alg implements AlgNode {
    public type = "Alg";

    public nodes: AlgNode[];

    public amount: number = 1;

    constructor(nodes: AlgNode[]) {
        this.nodes = nodes;
    }
    static fromString(moveString: string): Alg {
        return Alg.parseSiGN(moveString);
    }

    copy(): Alg {
        const copiedNodes = [];
        for (const node of this.nodes) {
            copiedNodes.push(node.copy());
        }
        return new Alg(copiedNodes);
    }
    expand(copy: boolean = false): AlgNode[] {
        const nodes: AlgNode[] = [];
        if (this.amount > 0) {
            for (const node of this.nodes) {
                nodes.push(...node.expand(copy));
            }
        } else {
            for (let i = this.nodes.length - 1; i >= 0; i--) {
                nodes.push(...this.nodes[i].inverted().expand(copy));
            }
        }

        const repeatedNodesArray: AlgNode[] = [];
        if (copy) {
            for (let i = 0; i < Math.abs(this.amount); i++) {
                let copyArray: AlgNode[] = [];
                for (let j = 0; j < nodes.length; j++) {
                    copyArray[j] = nodes[j].copy();
                }
                repeatedNodesArray.push(...copyArray);
            }
        } else {
            for (let i = 0; i < Math.abs(this.amount); i++) {
                repeatedNodesArray.push(...nodes.slice());
            }
        }

        return repeatedNodesArray;
    }
    expanded(): Alg {
        return new Alg(this.expand());
    }
    invert(): Alg {
        // Invert the nodes
        const invertedNodes = [];
        for (let i = this.nodes.length - 1; i >= 0; i--) {
            this.nodes[i].invert();
            invertedNodes.push(this.nodes[i]);
        }

        // Fix line comment positioning
        for (let i = 0; i < invertedNodes.length; i++) {
            if (invertedNodes[i].type === "Comment") {
                const comment = invertedNodes[i] as Comment;
                if (comment.commentType !== "lineComment") {
                    continue;
                }
                if (i + 1 >= invertedNodes.length || invertedNodes[i + 1].type === "Whitespace") {
                    const whitespace = invertedNodes[i] as Whitespace;
                    if (whitespace.value.indexOf("\n") > -1) {
                        continue;
                    }
                }

                invertedNodes.splice(i, 1);

                let broken = false;
                for (let j = i; j < invertedNodes.length; j++) {
                    if (invertedNodes[j].type === "Whitespace") {
                        const whitespace = invertedNodes[j] as Whitespace;
                        // Whitespace will always start with '\n' after a comment
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
    inverted(): Alg {
        return this.copy().invert();
    }
    toString(parent = true): string {
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
    stripComments(): void {
        for (let i = 0; i < this.nodes.length; i++) {
            if (this.nodes[i].type === "Comment") {
                this.nodes.splice(i, 1);
                i--;
                continue;
            }
            this.nodes[i].stripComments?.();
        }
    }
    removeWhitespace(removeNewlines = false): void {
        for (let i = 0; i < this.nodes.length; i++) {
            if (this.nodes[i].type === "Whitespace") {
                const whitespace = this.nodes[i] as Whitespace;

                if (removeNewlines || whitespace.value.indexOf("\n") === -1) {
                    this.nodes.splice(i, 1);
                    i--;
                    continue;
                }

                // Regex . is everything but \n (which is quite convenient here)
                whitespace.value = whitespace.value.replace(/./g, "");
                continue;
            }

            this.nodes[i].removeWhitespace?.();
        }
    }
    addWhitespace(): void {
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
    simplify(): void {
        let changed = true;
        while (changed) {
            changed = false;

            let prevNode: AlgNode | null = null;
            let prevNodeIndex = -1;
            for (let i = 0; i < this.nodes.length; i++) {
                let node = this.nodes[i];

                // Skip over whitespaces and comments
                if (node.type === "Whitespace" || node.type === "Comment") {
                    continue;
                }

                // Simplify the node
                node.simplify?.();

                // Single move simplifications
                if (node.type === "Move") {
                    if (node.amount % 4 === 0) {
                        this.nodes.splice(i, 1);
                        i--;
                        continue;
                    }
                    node.amount %= 4;
                }

                // Two move simplifications
                if (node.type === "Move" && prevNode?.type === "Move") {
                    if ((node as Move).face === (prevNode as Move).face) {
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

    forwardIterator(): AlgIterator {
        return new AlgIterator(this);
    }
    reverseIterator(): AlgIterator {
        return new AlgIterator(this, true);
    }
    forward() {
        return { [Symbol.iterator]: () => this.forwardIterator() };
    }
    reverse() {
        return { [Symbol.iterator]: () => this.reverseIterator() };
    }
    [Symbol.iterator](): AlgIterator {
        return this.forwardIterator();
    }

    private static tokensToAlg(tokens: SiGNToken[], amount?: number): Alg {
        let alg = new Alg([]);
        alg.amount = amount ?? 1;
        let nodes: AlgNode[] = alg.nodes;

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
                        // case "'":
                        //     const prevNode = nodes[nodes.length - 1];
                        //     prevNode.amount *= -1;
                        //     break;
                        case ",": case ":":
                            // TODO: This is black magic. Pls insert comments to explain.
                            const constructor: typeof Commutator | typeof Conjugate = (token.value === ",") ? Commutator : Conjugate;

                            const group = new constructor(alg, new Alg([]));
                            const amount = alg.amount;
                            alg.amount = 1;
                            alg = new Alg([group]);
                            alg.amount = amount;
                            nodes = group.algB.nodes;
                            break;
                        case "[": case "(":
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
                                } else if ("([".indexOf(tokens[j].value) > -1) {
                                    neededClosingBrackets++;
                                }
                            }
                            break;
                        case "]": case ")":
                            throw "Unmatched ']' or ')'.";
                    }
                    break;
                case "blockComment": case "lineComment":
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
            if (token.type === "punctuation" && "[]()".indexOf(value) > -1) {
                if (value === ")" || value === "]") {
                    if (brackets[brackets.length - 1] !== invertBracket(value)) {
                        return `Closing bracket '${value}' does not match opening bracket '${brackets[brackets.length - 1]}'.`;
                    }
                    brackets.pop();
                } else {
                    brackets.push(value);
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

        return Alg.tokensToAlg(tokens);
    }
}