import { AlgIterator } from "./alg-iterator.js";
import { arrayRepeat } from "../utils.js";
import { parseAlg } from "./parse.js";
;
;
export class Alg {
    type = "Alg";
    nodes;
    moveNodes;
    length;
    isGrouping;
    amount;
    constructor(nodes, amount = 1, isGrouping = false) {
        this.nodes = nodes;
        this.moveNodes = [];
        this.amount = amount;
        this.isGrouping = isGrouping;
        this.length = 0;
        for (const node of nodes) {
            switch (node.type) {
                case "Alg":
                case "Move":
                case "Commutator":
                case "Conjugate":
                    this.moveNodes.push(node);
                    this.length += node.length;
                    break;
            }
        }
    }
    static fromString(moveString) {
        const [alg, errors] = parseAlg(moveString);
        if (errors.length > 0) {
            let message = "";
            for (const error of errors) {
                message += `Error Ln ${error.line} Col ${error.col}: ${error.message}\n`;
            }
            throw new Error(message);
        }
        return alg;
    }
    copy() {
        const copiedNodes = [];
        for (const node of this.nodes) {
            copiedNodes.push(node.copy());
        }
        return new Alg(copiedNodes, this.amount, this.isGrouping);
    }
    expanded() {
        if (this.amount === 0) {
            return [];
        }
        const expandedNodes = [];
        for (const node of this.nodes) {
            if (node.type === "Whitespace" || node.type === "Comment") {
                expandedNodes.push(node);
                continue;
            }
            expandedNodes.push(...node.expanded());
        }
        if (this.amount < 0) {
            expandedNodes.reverse();
            for (const node of expandedNodes) {
                if (node.type === "Move") {
                    node.invert();
                }
            }
        }
        const length = expandedNodes.length;
        arrayRepeat(expandedNodes, Math.abs(this.amount));
        for (let i = length; i < expandedNodes.length; i++) {
            expandedNodes[i] = expandedNodes[i].copy();
        }
        return expandedNodes;
    }
    expandedMoves() {
        if (this.amount === 0) {
            return [];
        }
        const expandedMoves = [];
        for (const node of this.nodes) {
            if (node.type === "Whitespace" || node.type === "Comment") {
                continue;
            }
            expandedMoves.push(...node.expandedMoves());
        }
        if (this.amount < 0) {
            expandedMoves.reverse();
            expandedMoves.forEach(move => move.invert());
        }
        const length = expandedMoves.length;
        arrayRepeat(expandedMoves, Math.abs(this.amount));
        for (let i = length; i < expandedMoves.length; i++) {
            expandedMoves[i] = expandedMoves[i].copy();
        }
        return expandedMoves;
    }
    invert() {
        for (const node of this.moveNodes) {
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
}
