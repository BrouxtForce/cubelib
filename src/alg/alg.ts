import { AlgIterator } from "./alg-iterator.js";
import { Move } from "./move.js";
import { Commutator } from "./commutator.js";
import { Conjugate } from "./conjugate.js";
import { Comment } from "./comment.js";
import { Whitespace } from "./whitespace.js";
import { arrayRepeat } from "../utils.js";
import { parseAlg } from "./parse.js";

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
        const [alg, errors] = parseAlg(moveString);
        if (errors.length > 0) {
            let message = "";
            for (const error of errors) {
                message += error.message + "\n";
            }
            throw new Error(message);
        }
        return alg;
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
}