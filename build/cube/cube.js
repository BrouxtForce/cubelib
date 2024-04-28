import { assert } from "../utils.js";
export var Face;
(function (Face) {
    Face[Face["U"] = 0] = "U";
    Face[Face["L"] = 1] = "L";
    Face[Face["F"] = 2] = "F";
    Face[Face["R"] = 3] = "R";
    Face[Face["B"] = 4] = "B";
    Face[Face["D"] = 5] = "D";
})(Face || (Face = {}));
;
function oppositeFace(face) {
    switch (face) {
        case Face.U: return Face.D;
        case Face.F: return Face.B;
        case Face.R: return Face.L;
        case Face.B: return Face.F;
        case Face.L: return Face.R;
        case Face.D: return Face.U;
        default: return Face.U;
    }
}
function faceToString(face) {
    switch (face) {
        case Face.U: return "U";
        case Face.F: return "F";
        case Face.R: return "R";
        case Face.B: return "B";
        case Face.L: return "L";
        case Face.D: return "D";
        default: return "?";
    }
}
function stringToFace(string) {
    switch (string.toUpperCase()) {
        case "U": return Face.U;
        case "F": return Face.F;
        case "R": return Face.R;
        case "B": return Face.B;
        case "L": return Face.L;
        case "D": return Face.D;
        default: return -1;
    }
}
function rotateIndexCw(index, size) {
    let x = index % size;
    let y = Math.floor(index / size);
    let newX = size - y - 1;
    let newY = x;
    return newY * size + newX;
}
function rotateIndexCcw(index, size) {
    let x = index % size;
    let y = Math.floor(index / size);
    let newX = y;
    let newY = size - x - 1;
    return newY * size + newX;
}
export class Cube {
    #layerCount;
    stickers;
    constructor(layerCount) {
        console.assert(Number.isInteger(layerCount) && layerCount > 1);
        this.#layerCount = layerCount;
        let stickersPerFace = layerCount * layerCount;
        this.stickers = Array(6);
        for (let i = 0; i < 6; i++) {
            this.stickers[i] = Array(stickersPerFace);
            for (let j = 0; j < stickersPerFace; j++) {
                this.stickers[i][j] = i;
            }
        }
    }
    static fromString(state) {
        const layerCount = Math.floor(Math.sqrt(state.length / 6));
        const sqLayerCount = layerCount * layerCount;
        const cube = new Cube(layerCount);
        for (let i = 0; i < 6; i++) {
            for (let j = 0; j < sqLayerCount; j++) {
                cube.stickers[i][j] = stringToFace(state[i * sqLayerCount + j]);
            }
        }
        return cube;
    }
    toString() {
        const stringArray = [];
        const sqLayerCount = this.#layerCount * this.#layerCount;
        for (let i = 0; i < 6; i++) {
            for (let j = 0; j < sqLayerCount; j++) {
                stringArray.push(faceToString(this.stickers[i][j]));
            }
        }
        return stringArray.join("");
    }
    getLayerCount() {
        return this.#layerCount;
    }
    solve() {
        let stickersPerFace = this.#layerCount * this.#layerCount;
        for (let i = 0; i < 6; i++) {
            for (let j = 0; j < stickersPerFace; j++) {
                this.stickers[i][j] = i;
            }
        }
    }
    solved() {
        let stickersPerFace = this.#layerCount * this.#layerCount;
        for (let i = 0; i < 6; i++) {
            let faceColor = this.stickers[i][0];
            for (let j = 1; j < stickersPerFace; j++) {
                if (this.stickers[i][j] !== faceColor) {
                    return false;
                }
            }
        }
        return true;
    }
    static #memo(numPieces, buffer, cycleBreakOrder, getBaseIndex, getPiece, swapPiece) {
        cycleBreakOrder = cycleBreakOrder.filter(piece => piece !== getPiece(piece, false) && getBaseIndex(piece) !== getBaseIndex(buffer));
        const isSamePiece = (a, b) => {
            return getBaseIndex(a) === getBaseIndex(b);
        };
        const solvedPieces = Array(numPieces).fill(false);
        const memo = [];
        let target = getPiece(buffer, false);
        let cycleStart = buffer;
        solvedPieces[getBaseIndex(buffer)] = true;
        let loopProtector = 0;
        memoLoop: while (true) {
            if (loopProtector++ > 100) {
                console.error("Infinite loop error");
                return memo;
            }
            if (isSamePiece(target, cycleStart) || isSamePiece(target, buffer)) {
                if (isSamePiece(target, cycleStart) && !isSamePiece(target, buffer)) {
                    solvedPieces[getBaseIndex(cycleStart)] = true;
                    memo.push(target);
                    if (swapPiece)
                        swapPiece(target);
                }
                while (true) {
                    const cycleBreak = cycleBreakOrder.shift();
                    if (cycleBreak === undefined) {
                        break memoLoop;
                    }
                    if (!solvedPieces[getBaseIndex(cycleBreak)]) {
                        cycleStart = cycleBreak;
                        break;
                    }
                }
                target = cycleStart;
                memo.push(target);
                if (swapPiece)
                    swapPiece(target);
                target = getPiece(target, false);
                continue;
            }
            memo.push(target);
            solvedPieces[getBaseIndex(target)] = true;
            if (swapPiece)
                swapPiece(target);
            target = getPiece(target, true);
        }
        return memo;
    }
    memoEdges(buffer, cycleBreakOrder) {
        const edges = this.#getEdgeIndices();
        const getBaseIndex = (index) => {
            return Math.floor(index / 2);
        };
        const getPiece = (target) => {
            const targetEdge = edges[getBaseIndex(target)];
            return (targetEdge - targetEdge % 2) + (targetEdge + target) % 2;
        };
        return Cube.#memo(edges.length, buffer, cycleBreakOrder, getBaseIndex, getPiece);
    }
    static #getEdgeBaseIndex(edge) {
        const edgeHash = edge.reduce((acc, val) => acc | (1 << val), 0);
        switch (edgeHash) {
            case 0b010001: return 0;
            case 0b001001: return 1;
            case 0b000101: return 2;
            case 0b000011: return 3;
            case 0b001100: return 4;
            case 0b000110: return 5;
            case 0b010010: return 6;
            case 0b011000: return 7;
            case 0b100100: return 8;
            case 0b101000: return 9;
            case 0b110000: return 10;
            case 0b100010: return 11;
            default: throw new Error(`Invalid edge: [${edge.join(", ")}]`);
        }
    }
    #getEdgeIndices() {
        const edges = this.#getEdges(Math.floor(this.#layerCount / 2));
        const indices = Array(edges.length);
        for (let i = 0; i < edges.length; i++) {
            const edge = edges[i];
            let flipped;
            if (edge.some(val => (val === Face.U || val === Face.D))) {
                flipped = !(edge[0] === Face.U || edge[0] === Face.D);
            }
            else {
                flipped = !(edge[0] === Face.F || edge[0] === Face.B);
            }
            const baseIndex = Cube.#getEdgeBaseIndex(edge);
            indices[i] = baseIndex * 2 + Number(flipped);
        }
        return indices;
    }
    memoWings(wingIndex, buffer, cycleBreakOrder) {
        const wings = this.#getWingIndices(wingIndex);
        const getBaseIndex = (index) => index;
        const getPiece = (target) => wings[target];
        return Cube.#memo(wings.length, buffer, cycleBreakOrder, getBaseIndex, getPiece);
    }
    static #getWingBaseIndex(wing) {
        const wingHash = (1 << wing[0]) | (1 << (wing[1] + 6));
        switch (wingHash) {
            case 0b010000000001: return 0;
            case 0b000001010000: return 1;
            case 0b001000000001: return 2;
            case 0b000001001000: return 3;
            case 0b000100000001: return 4;
            case 0b000001000100: return 5;
            case 0b000010000001: return 6;
            case 0b000001000010: return 7;
            case 0b001000000100: return 8;
            case 0b000100001000: return 9;
            case 0b000010000100: return 10;
            case 0b000100000010: return 11;
            case 0b000010010000: return 12;
            case 0b010000000010: return 13;
            case 0b001000010000: return 14;
            case 0b010000001000: return 15;
            case 0b000100100000: return 16;
            case 0b100000000100: return 17;
            case 0b001000100000: return 18;
            case 0b100000001000: return 19;
            case 0b010000100000: return 20;
            case 0b100000010000: return 21;
            case 0b000010100000: return 22;
            case 0b100000000010: return 23;
            default: throw new Error(`Invalid wing: [${wing.join(", ")}]`);
        }
    }
    #getWingIndices(wingIndex) {
        const wings = this.#getWings(wingIndex);
        const indices = Array(wings.length);
        for (let i = 0; i < wings.length; i++) {
            const wing = wings[i];
            if (i % 2 === 1) {
                const swap = wing[0];
                wing[0] = wing[1];
                wing[1] = swap;
            }
            indices[i] = Cube.#getWingBaseIndex(wing);
        }
        return indices;
    }
    memoCorners(buffer, cycleBreakOrder) {
        const corners = this.#getCornerIndices();
        const getBaseIndex = (index) => {
            return Math.floor(index / 3);
        };
        const getPiece = (target) => {
            const targetCorner = corners[getBaseIndex(target)];
            return (targetCorner - targetCorner % 3) + (targetCorner + target) % 3;
        };
        return Cube.#memo(corners.length, buffer, cycleBreakOrder, getBaseIndex, getPiece);
    }
    static #getCornerBaseIndex(triplet) {
        const tripletHash = triplet.reduce((acc, val) => acc | (1 << val), 0);
        switch (tripletHash) {
            case 0b010011: return 0;
            case 0b011001: return 1;
            case 0b001101: return 2;
            case 0b000111: return 3;
            case 0b100110: return 4;
            case 0b101100: return 5;
            case 0b111000: return 6;
            case 0b110010: return 7;
            default: throw `Invalid corner: [${triplet.join(", ")}]`;
        }
    }
    #getCornerIndices() {
        const corners = this.#getCorners();
        const indices = Array(corners.length);
        for (let i = 0; i < corners.length; i++) {
            const corner = corners[i];
            if (i % 2 === 1) {
                const swap = corner[1];
                corner[1] = corner[2];
                corner[2] = swap;
            }
            let topColorIndex = corner.findIndex(val => (val === Face.U || val === Face.D));
            if (topColorIndex === -1) {
                throw new Error(`Invalid corner triplet: [${corner.join(", ")}]`);
            }
            const baseIndex = Cube.#getCornerBaseIndex(corner);
            let index = baseIndex * 3 + topColorIndex;
            indices[i] = index;
        }
        return indices;
    }
    memoCenters(centerIndex, buffer, cycleBreakOrder) {
        const centers = this.#getCenterIndices(centerIndex);
        const mutableCenters = centers.slice();
        const getColor = (index) => Math.floor(index / 4);
        const getBaseIndex = (index) => index;
        const getPiece = (target, solve) => {
            if (!solve) {
                return centers[target];
            }
            const nextColor = getColor(centers[target]);
            const faceStartIndex = nextColor * 4;
            for (let i = 0; i < 4; i++) {
                const index = faceStartIndex + i;
                if (mutableCenters[index] === index) {
                    continue;
                }
                const swapIndex = centers.indexOf(index);
                assert(swapIndex !== -1);
                assert(getColor(centers[swapIndex]) === getColor(centers[target]));
                const swap = centers[swapIndex];
                centers[swapIndex] = centers[target];
                centers[target] = swap;
                {
                    const swap = mutableCenters[swapIndex];
                    mutableCenters[swapIndex] = mutableCenters[target];
                    mutableCenters[target] = swap;
                }
                const debugString = "ABCDEFGHIJKLMNOPQRSTUVWX";
                console.log(`swap ${debugString[swapIndex]} ${debugString[target]} (${debugString[centers[swapIndex]]} ${debugString[centers[target]]})`);
                return swap;
            }
            return centers[target];
        };
        const debugString = "ABCDEFGHIJKLMNOPQRSTUVWX";
        const swapPiece = (piece) => {
            const swap = mutableCenters[buffer];
            mutableCenters[buffer] = mutableCenters[piece];
            mutableCenters[piece] = swap;
        };
        const memo = Cube.#memo(centers.length, buffer, cycleBreakOrder, getBaseIndex, getPiece, swapPiece);
        console.log(mutableCenters.map(val => debugString[val]).join(" "));
        return memo;
    }
    #getCenterIndices(centerIndex) {
        const centers = this.#getCenters(centerIndex);
        const indices = Array(centers.length);
        const takenIndices = Array(centers.length).fill(false);
        for (let i = 0; i < centers.length; i++) {
            const center = centers[i];
            const face = Math.floor(i / 4);
            if (center === face) {
                indices[i] = i;
                takenIndices[i] = true;
            }
        }
        for (let i = 0; i < centers.length; i++) {
            if (indices[i] !== undefined) {
                continue;
            }
            for (let j = 0; j < 4; j++) {
                let index = centers[i] * 4 + j;
                if (!takenIndices[index]) {
                    takenIndices[index] = true;
                    indices[i] = index;
                    break;
                }
            }
        }
        assert(takenIndices.every(value => value === true));
        return indices;
    }
    #getCenters(index) {
        const centers = [];
        for (let face = 0; face < 6; face++) {
            for (let i = 0; i < 4; i++) {
                centers.push(this.stickers[face][index]);
                index = rotateIndexCw(index, this.#layerCount);
            }
        }
        return centers;
    }
    #getEdges(index) {
        const edges = [];
        const faces = [Face.U, Face.L, Face.F, Face.R, Face.B, Face.D];
        for (const face of faces) {
            for (let i = 0; i < 4; i++) {
                edges.push(this.stickers[face][index]);
                index = rotateIndexCw(index, this.#layerCount);
            }
        }
        const U = edges.slice(0, 4);
        const L = edges.slice(4, 8);
        const F = edges.slice(8, 12);
        const R = edges.slice(12, 16);
        const B = edges.slice(16, 20);
        const D = edges.slice(20, 24);
        return [
            [U[0], B[0]], [U[1], R[0]], [U[2], F[0]], [U[3], L[0]],
            [F[1], R[3]], [F[3], L[1]], [B[1], L[3]], [B[3], R[1]],
            [D[0], F[2]], [D[1], R[2]], [D[2], B[2]], [D[3], L[2]]
        ];
    }
    #getWings(indexA) {
        const wings = [];
        let indexB = this.#layerCount - indexA - 1;
        const faces = [Face.U, Face.L, Face.F, Face.R, Face.B, Face.D];
        for (const face of faces) {
            for (let i = 0; i < 4; i++) {
                wings.push(this.stickers[face][indexA]);
                wings.push(this.stickers[face][indexB]);
                indexA = rotateIndexCw(indexA, this.#layerCount);
                indexB = rotateIndexCw(indexB, this.#layerCount);
            }
        }
        const U = wings.slice(0, 8);
        const L = wings.slice(8, 16);
        const F = wings.slice(16, 24);
        const R = wings.slice(24, 32);
        const B = wings.slice(32, 40);
        const D = wings.slice(40, 48);
        return [
            [U[0], B[1]], [U[1], B[0]], [U[2], R[1]], [U[3], R[0]], [U[4], F[1]], [U[5], F[0]], [U[6], L[1]], [U[7], L[0]],
            [F[2], R[7]], [F[3], R[6]], [F[6], L[3]], [F[7], L[2]], [B[2], L[7]], [B[3], L[6]], [B[6], R[3]], [B[7], R[2]],
            [D[0], F[5]], [D[1], F[4]], [D[2], R[5]], [D[3], R[4]], [D[4], B[5]], [D[5], B[4]], [D[6], L[5]], [D[7], L[4]],
        ];
    }
    #getCorners() {
        const corners = [];
        const faces = [Face.U, Face.L, Face.F, Face.R, Face.B, Face.D];
        let index = 0;
        for (const face of faces) {
            for (let i = 0; i < 4; i++) {
                corners.push(this.stickers[face][index]);
                index = rotateIndexCw(index, this.#layerCount);
            }
        }
        const U = corners.slice(0, 4);
        const L = corners.slice(4, 8);
        const F = corners.slice(8, 12);
        const R = corners.slice(12, 16);
        const B = corners.slice(16, 20);
        const D = corners.slice(20, 24);
        return [
            [U[0], B[1], L[0]], [U[1], B[0], R[1]], [U[2], F[1], R[0]], [U[3], F[0], L[1]],
            [D[0], F[3], L[2]], [D[1], F[2], R[3]], [D[2], B[3], R[2]], [D[3], B[2], L[3]]
        ];
    }
    #faceHtml(face) {
        const nodes = [];
        for (const faceColor of this.stickers[face]) {
            const node = document.createElement("div");
            node.classList.add("sticker");
            node.classList.add(faceToString(faceColor));
            nodes.push(node);
        }
        const faceNode = document.createElement("div");
        faceNode.classList.add("face");
        faceNode.replaceChildren(...nodes);
        return faceNode;
    }
    #emptyFace() {
        const faceNode = document.createElement("div");
        faceNode.classList.add("face");
        return faceNode;
    }
    html(node) {
        node.classList.add("cube");
        node.style.setProperty("--layer-count", this.#layerCount.toString());
        node.replaceChildren(this.#emptyFace(), this.#faceHtml(Face.U), this.#emptyFace(), this.#emptyFace(), this.#faceHtml(Face.L), this.#faceHtml(Face.F), this.#faceHtml(Face.R), this.#faceHtml(Face.B), this.#emptyFace(), this.#faceHtml(Face.D));
    }
    static #getAdjacentFaces(face) {
        let Dir;
        (function (Dir) {
            Dir[Dir["U"] = 0] = "U";
            Dir[Dir["R"] = 3] = "R";
            Dir[Dir["L"] = 1] = "L";
            Dir[Dir["D"] = 5] = "D";
        })(Dir || (Dir = {}));
        const $ = (face, direction) => ({ face, direction });
        switch (face) {
            case Face.U:
                return [$(Face.B, Dir.U), $(Face.R, Dir.U), $(Face.F, Dir.U), $(Face.L, Dir.U)];
            case Face.L:
                return [$(Face.U, Dir.L), $(Face.F, Dir.L), $(Face.D, Dir.L), $(Face.B, Dir.R)];
            case Face.F:
                return [$(Face.U, Dir.D), $(Face.R, Dir.L), $(Face.D, Dir.U), $(Face.L, Dir.R)];
            case Face.R:
                return [$(Face.U, Dir.R), $(Face.B, Dir.L), $(Face.D, Dir.R), $(Face.F, Dir.R)];
            case Face.B:
                return [$(Face.U, Dir.U), $(Face.L, Dir.L), $(Face.D, Dir.D), $(Face.R, Dir.R)];
            case Face.D:
                return [$(Face.F, Dir.D), $(Face.R, Dir.D), $(Face.B, Dir.D), $(Face.L, Dir.D)];
            default:
                console.error(`Invalid face: ${face}`);
                return [];
        }
    }
    #cycleFaceCw(face) {
        let faceArray = this.stickers[face];
        let copyArray = faceArray.slice();
        for (let i = 0; i < faceArray.length; i++) {
            faceArray[i] = copyArray[rotateIndexCcw(i, this.#layerCount)];
        }
    }
    #cycleFaceCcw(face) {
        let faceArray = this.stickers[face];
        let copyArray = faceArray.slice();
        for (let i = 0; i < faceArray.length; i++) {
            faceArray[i] = copyArray[rotateIndexCw(i, this.#layerCount)];
        }
    }
    #cycleFace(face, counterclockwise) {
        if (counterclockwise) {
            this.#cycleFaceCcw(face);
        }
        else {
            this.#cycleFaceCw(face);
        }
    }
    #faceThread(direction, depth) {
        const array = [];
        switch (direction) {
            case Face.U: {
                let startIndex = depth * this.#layerCount;
                for (let i = 0; i < this.#layerCount; i++) {
                    array.push(startIndex + i);
                }
                return array;
            }
            case Face.R: {
                let startIndex = this.#layerCount - depth - 1;
                for (let i = 0; i < this.#layerCount; i++) {
                    array.push(startIndex + this.#layerCount * i);
                }
                return array;
            }
            case Face.L: {
                let startIndex = depth;
                for (let i = this.#layerCount - 1; i >= 0; i--) {
                    array.push(startIndex + this.#layerCount * i);
                }
                return array;
            }
            case Face.D: {
                let startIndex = (this.#layerCount - depth) * this.#layerCount - this.#layerCount;
                for (let i = this.#layerCount - 1; i >= 0; i--) {
                    array.push(startIndex + i);
                }
                return array;
            }
            default:
                console.error(`Invalid direction: ${direction}`);
                return [];
        }
    }
    #cycleThreadCcw(face, depth) {
        const adjFaces = Cube.#getAdjacentFaces(face);
        const faceIndices = [];
        for (const adjFace of adjFaces) {
            faceIndices.push(this.#faceThread(adjFace.direction, depth));
        }
        let firstCopy = [];
        for (const index of faceIndices[0]) {
            firstCopy[index] = this.stickers[adjFaces[0].face][index];
        }
        for (let i = 0; i < faceIndices.length; i++) {
            const arr = this.stickers?.[adjFaces[i + 1]?.face] ?? firstCopy;
            for (let j = 0; j < faceIndices[0].length; j++) {
                const currIndex = faceIndices[i][j];
                const nextIndex = faceIndices[(i + 1) % faceIndices.length][j];
                if (!Number.isInteger(arr[nextIndex])) {
                    console.error(`Invalid index: ${nextIndex}`);
                    continue;
                }
                this.stickers[adjFaces[i].face][currIndex] = arr[nextIndex];
            }
        }
    }
    #cycleThreadCw(face, depth) {
        for (let i = 0; i < 3; i++) {
            this.#cycleThreadCcw(face, depth);
        }
    }
    #cycleThread(face, depth, counterclockwise) {
        if (counterclockwise) {
            this.#cycleThreadCcw(face, depth);
        }
        else {
            this.#cycleThreadCw(face, depth);
        }
    }
    reset() {
        for (let i = 0; i < 6; i++) {
            for (let j = 0; j < this.stickers[i].length; j++) {
                this.stickers[i][j] = i;
            }
        }
    }
    move(face, amount, shallow = 1, deep = 1) {
        let counterclockwise = amount < 0;
        amount = Math.abs(amount) % 4;
        if (amount === 0) {
            return;
        }
        counterclockwise = (amount === 3) !== counterclockwise;
        let double = amount === 2;
        shallow = Math.min(shallow, this.#layerCount);
        deep = Math.min(deep, this.#layerCount);
        if (!double) {
            if (shallow === 1) {
                this.#cycleFace(face, counterclockwise);
            }
            if (deep >= this.#layerCount) {
                this.#cycleFace(oppositeFace(face), !counterclockwise);
            }
            for (let i = shallow - 1; i < deep; i++) {
                this.#cycleThread(face, i, counterclockwise);
            }
        }
        else {
            if (shallow === 1) {
                this.#cycleFaceCw(face);
                this.#cycleFaceCw(face);
            }
            if (deep >= this.#layerCount) {
                let opposite = oppositeFace(face);
                this.#cycleFaceCw(opposite);
                this.#cycleFaceCw(opposite);
            }
            for (let i = shallow - 1; i < deep; i++) {
                this.#cycleThreadCw(face, i);
                this.#cycleThreadCw(face, i);
            }
        }
    }
    execute(alg) {
        for (const move of alg) {
            if ("UFRBLD".indexOf(move.face) > -1) {
                this.move(stringToFace(move.face), move.amount, move.shallow, move.deep);
            }
            else if ("MES".indexOf(move.face) > -1) {
                if (this.#layerCount % 2 === 0)
                    continue;
                let faceNum = stringToFace("LDF"["MES".indexOf(move.face)]);
                let depth = (this.#layerCount - 1) / 2 + 1;
                this.move(faceNum, move.amount, depth, depth);
            }
            else if ("mes".indexOf(move.face) > -1) {
                let faceNum = stringToFace("LDF"["mes".indexOf(move.face)]);
                this.move(faceNum, move.amount, 2, this.#layerCount - 1);
            }
            else if ("xyz".indexOf(move.face) > -1) {
                let faceNum = stringToFace("RUF"["xyz".indexOf(move.face)]);
                this.move(faceNum, move.amount, 1, this.#layerCount);
            }
            else {
                console.error(`Move ${move.face} not supported.`);
            }
        }
    }
    executeUntil(alg, numMoves) {
        for (const move of alg) {
            if (numMoves-- <= 0) {
                return move;
            }
            this.execute(move);
        }
        return null;
    }
}
