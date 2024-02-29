import { Alg, AlgMoveNode, AlgNode } from "./alg.js";
import { Commutator } from "./commutator.js";
import { Conjugate } from "./conjugate.js";
import { Move } from "./move.js";
import { SiGNTokenInputStream, type SiGNToken } from "./sign-tokens.js";

class TokenStream {
    private readonly tokens: SiGNToken[];
    private index: number;

    constructor(tokens: SiGNToken[]) {
        this.tokens = tokens;
        this.index = 0;
    }

    next(): SiGNToken | null {
        return this.tokens[this.index++] ?? null;
    }
    prev(): void {
        this.index--;
    }
    current(): SiGNToken | null {
        return this.tokens[this.index - 1] ?? null;
    }
    peek(): SiGNToken | null {
        return this.tokens[this.index] ?? null;
    }
    peekRelevant(): SiGNToken | null {
        for (let i = this.index; i < this.tokens.length; i++) {
            switch (this.tokens[i].type) {
                case "blockComment":
                case "lineComment":
                case "whitespace":
                    continue;
            }
            return this.tokens[i];
        }
        return null;
    }
}

interface ParseError {
    message: string;
    pos: number;
    line: number;
    col: number;
}

const variableMap = new Map<string, Alg>();
const errors: ParseError[] = [];

function parseExpression(stream: TokenStream, root: boolean = false): Alg {
    let leftNodes: AlgMoveNode[] = [];

    while (true) {
        const token = stream.next();
        if (!token) {
            break;
        }

        if (token.type === "move") {
            leftNodes.push(Move.fromString(token.value));
            continue;
        }

        if (token.type === "variable") {
            const variableAlg = variableMap.get(token.value);
            if (!variableAlg) {
                errors.push({
                    message: `Undefined variable '${token.value}'`,
                    pos: 0, line: 0, col: 0
                });
                continue;
            }
            leftNodes.push(variableAlg);
            continue;
        }

        if (token.type === "punctuation") {
            switch (token.value) {
                case ":": case ",": {
                    const right = parseExpression(stream, false);
                    if (right === null) {
                        errors.push({
                            message: `Right-hand side of ${token.value === "," ? "commutator" : "conjugate"} cannot be empty.`,
                            pos: 0, line: 0, col: 0
                        });
                        return new Alg(leftNodes);
                    }
                    leftNodes = [new (token.value === "," ? Commutator : Conjugate)(new Alg(leftNodes), right)];
                    break;
                }
                case "(": case "[": {
                    const group = parseExpression(stream);
                    if (group) {
                        leftNodes.push(group);
                    }

                    const closingToken = stream.next();
                    if (!closingToken) {
                        errors.push({
                            message: `Missing closing ${token.value === "(" ? "parentheses" : "brackets"}`,
                            pos: 0, line: 0, col: 0
                        });
                        break;
                    }

                    const incorrectClosing =
                        closingToken.type !== "punctuation" ||
                        (token.value === "(" && closingToken.value !== ")") ||
                        (token.value === "[" && closingToken.value !== "]");

                    if (incorrectClosing) {
                        errors.push({
                            message: `Unexpected token '${token.value}'`,
                            pos: 0, line: 0, col: 0
                        });
                    }
                    break;
                }
                case ")": case "]":
                    if (root) {
                        errors.push({
                            message: `Unexpected closing bracked: '${token.value}'`,
                            pos: 0, line: 0, col: 0
                        });
                    }
                    stream.prev();
                    return new Alg(leftNodes, token.amount);
                default:
                    errors.push({
                        message: `Bug: Unknown punctuation '${token.value}'`,
                        pos: 0, line: 0, col: 0
                    });
            }
        }
    }

    return new Alg(leftNodes);
}

export function parseTokens(tokens: SiGNToken[]): Alg {
    const stream = new TokenStream(tokens.filter(token => (token.type !== "blockComment" && token.type !== "lineComment" && token.type !== "whitespace")));

    variableMap.clear();
    errors.length = 0;

    return parseExpression(stream, true);
}

export function parseAlg(algString: string): [Alg, ParseError[]] {
    const stream = new SiGNTokenInputStream(algString);
    const tokens: SiGNToken[] = [];

    while (true) {
        const next = stream.readNext();
        if (next === null) {
            break;
        }
        tokens.push(next);
    }

    return [parseTokens(tokens), errors.slice()];
}