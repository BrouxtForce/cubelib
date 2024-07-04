import { Alg, AlgNode } from "./alg.js";
import { Comment } from "./comment.js";
import { Commutator } from "./commutator.js";
import { Conjugate } from "./conjugate.js";
import { Move } from "./move.js";
import { SiGNTokenInputStream, type SiGNToken } from "./sign-tokens.js";
import { Whitespace } from "./whitespace.js";

class TokenStream {
    readonly #tokens: SiGNToken[];
    #index: number;

    constructor(tokens: SiGNToken[]) {
        this.#tokens = tokens;
        this.#index = 0;
    }

    next(): SiGNToken | null {
        return this.#tokens[this.#index++] ?? null;
    }
    prev(): void {
        this.#index--;
    }
    current(): SiGNToken | null {
        return this.#tokens[this.#index - 1] ?? null;
    }
    peek(): SiGNToken | null {
        return this.#tokens[this.#index] ?? null;
    }
    peekRelevant(): SiGNToken | null {
        for (let i = this.#index; i < this.#tokens.length; i++) {
            switch (this.#tokens[i].type) {
                case "comment":
                case "whitespace":
                    continue;
            }
            return this.#tokens[i];
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

function parseExpression(stream: TokenStream, root: boolean = false, paren: boolean = false): Alg {
    let leftNodes: AlgNode[] = [];

    while (true) {
        const token = stream.next();
        if (!token) {
            break;
        }

        const pos = token.pos;
        const line = token.line;
        const col = token.col;

        if (token.type === "move") {
            leftNodes.push(Move.fromString(token.value));
            continue;
        }
        if (token.type === "whitespace") {
            leftNodes.push(new Whitespace(token.value));
        }
        if (token.type === "comment") {
            leftNodes.push(new Comment(token.value));
        }

        if (token.type === "variable") {
            const variableAlg = variableMap.get(token.value);
            if (!variableAlg) {
                errors.push({
                    message: `Undefined variable '${token.value}'`,
                    pos, line, col
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
                    if (leftNodes.length === 0) {
                        errors.push({
                            message: `Left-hand side of ${token.value === "," ? "commutator" : "conjugate"} cannot be empty.`,
                            pos, line, col
                        });
                    } else if (right.moveNodes.length === 0) {
                        errors.push({
                            message: `Right-hand side of ${token.value === "," ? "commutator" : "conjugate"} cannot be empty.`,
                            pos, line, col
                        });
                        return new Alg(leftNodes);
                    }
                    leftNodes = [new (token.value === "," ? Commutator : Conjugate)(new Alg(leftNodes), right)];
                    break;
                }
                case "(": case "[": {
                    const group = parseExpression(stream, false, true);
                    group.isGrouping = true;
                    if (group) {
                        leftNodes.push(group);
                    }

                    const closingToken = stream.next();
                    if (!closingToken) {
                        errors.push({
                            message: `Missing closing ${token.value === "(" ? "parentheses" : "brackets"}`,
                            pos, line, col
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
                            pos, line, col
                        });
                    }
                    break;
                }
                case ")": case "]":
                    if (root) {
                        errors.push({
                            message: `Unexpected closing bracked: '${token.value}'`,
                            pos, line, col
                        });
                    }
                    stream.prev();
                    return new Alg(leftNodes, paren ? token.amount : 1);
                default:
                    errors.push({
                        message: `Bug: Unknown punctuation '${token.value}'`,
                        pos, line, col
                    });
            }
        }
    }

    return new Alg(leftNodes);
}

export function parseTokens(tokens: SiGNToken[]): Alg {
    const stream = new TokenStream(tokens);

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