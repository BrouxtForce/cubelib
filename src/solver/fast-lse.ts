import { Alg } from "../cube/alg.js";
import { Cube } from "../cube/cube.js";

/**
 * A namespace for executing M and U moves quickly and finding many LSE solutions
 */
export namespace FastLSE {
    /**
     * A 32-bit integer containing the state of LSE.
     * 
     * The first 6 nibbles (nibble = half of a byte) contain 6 numbers (0 to 5) denoting edge permutation.
     * The 8 bit (0b1000) of each nibble denotes edge orientation (1 = bad, 0 = good).
     * 
     * The seventh nibble contains a number from 0 to 3 denoting how the corners are positioned.
     * 
     * The eighth nibble contains a number from 0 to 3 denoting how the centers are positioned.
     * 
     * Order: 0b(center permutation)_(corner permutation)_(DB)_(DF)_(UL)_(UF)_(UR)_(Ub)
     */
    type LSEState = number;

    // Same number as 0b0000_0000_0101_0100_0011_0010_0001_0000
    export const SOLVED_STATE: LSEState = 0x543210;

    const UB_INDEX = 0;
    const UR_INDEX = 1;
    const UF_INDEX = 2;
    const UL_INDEX = 3;
    const DF_INDEX = 4;
    const DB_INDEX = 5;
    const CORNER_INDEX = 6;
    const CENTER_INDEX = 7;

    enum LSEMove {
        M = 1,
        M2 = 2,
        MPrime = 3,
        U = 4,
        U2 = 5,
        UPrime = 6
    };

    function lseMoveToString(move: LSEMove): string {
        switch (move) {
            case LSEMove.M: return "M";
            case LSEMove.M2: return "M2";
            case LSEMove.MPrime: return "M'";
            case LSEMove.U: return "U";
            case LSEMove.UPrime: return "U'";
            case LSEMove.U2: return "U2";
            default: throw new Error(`Invalid LSE move number: '${move}'`);
        }
    }

    export function stringToLseMove(move: string): LSEMove {
        switch (move) {
            case "M": return LSEMove.M;
            case "M'": return LSEMove.MPrime;
            case "M2": return LSEMove.M2;
            case "U": return LSEMove.U;
            case "U'": return LSEMove.UPrime;
            case "U2": return LSEMove.U2;
            default: throw new Error(`Invalid LSE move: '${move}'`);
        }
    }

    function getNibble(state: LSEState, index: number): number {
        return (state >> (index * 4)) & 0b1111;
    }

    function setNibble(state: LSEState, index: number, nibble: number): number {
        return ((state & ((~0) ^ (0b1111 << (index * 4)))) | (nibble << (index * 4)));
    }

    function cycleEdgesCw(state: LSEState, index0: number, index1: number, index2: number, index3: number): LSEState {
        let outState: number = state;

        outState = setNibble(outState, index0, getNibble(state, index3));
        outState = setNibble(outState, index1, getNibble(state, index0));
        outState = setNibble(outState, index2, getNibble(state, index1));
        outState = setNibble(outState, index3, getNibble(state, index2));

        return outState;
    }

    function cycleEdgesCcw(state: LSEState, index0: number, index1: number, index2: number, index3: number): LSEState {
        let outState: number = state;

        outState = setNibble(outState, index0, getNibble(state, index1));
        outState = setNibble(outState, index1, getNibble(state, index2));
        outState = setNibble(outState, index2, getNibble(state, index3));
        outState = setNibble(outState, index3, getNibble(state, index0));

        return outState;
    }

    function swapEdges(state: LSEState, index0: number, index1: number): LSEState {
        let outState: number = state;

        outState = setNibble(outState, index0, getNibble(state, index1));
        outState = setNibble(outState, index1, getNibble(state, index0));
        
        return outState;
    }

    function flipM(state: LSEState): LSEState {
        return state ^ 0b1000_1000_0000_1000_0000_1000;
    }

    function addCenterState(state: LSEState, amount: number): LSEState {
        return setNibble(state, 7, (getNibble(state, 7) + amount) % 4);
    }

    function addCornerState(state: LSEState, amount: number): LSEState {
        return setNibble(state, 6, (getNibble(state, 6) + amount) % 4);
    }

    export function move(state: LSEState, move: LSEMove): LSEState {
        switch (move) {
            case LSEMove.M:
                state = cycleEdgesCcw(state, 0, 5, 4, 2);
                state = flipM(state);
                state = addCenterState(state, 3);
                break;
            case LSEMove.MPrime:
                state = cycleEdgesCw(state, 0, 5, 4, 2);
                state = flipM(state);
                state = addCenterState(state, 1);
                break;
            case LSEMove.M2:
                state = swapEdges(state, 0, 4);
                state = swapEdges(state, 2, 5);
                state = addCenterState(state, 2);
                break;
            case LSEMove.U:
                state = cycleEdgesCw(state, 0, 1, 2, 3);
                state = addCornerState(state, 1);
                break;
            case LSEMove.UPrime:
                state = cycleEdgesCcw(state, 0, 1, 2, 3);
                state = addCornerState(state, 3);
                break;
            case LSEMove.U2:
                state = swapEdges(state, 0, 2);
                state = swapEdges(state, 1, 3);
                state = addCornerState(state, 2);
                break;
            default:
                throw new Error(`Invalid move: '${move}'`);
        }
        return state;
    }

    function reverseLseMove(move: LSEMove): LSEMove {
        switch (move) {
            case LSEMove.M:      return LSEMove.MPrime;
            case LSEMove.MPrime: return LSEMove.M;
            case LSEMove.U:      return LSEMove.UPrime;
            case LSEMove.UPrime: return LSEMove.U;
            default:             return move;
        }
    }

    function setLseMove(moves: number, index: number, move: LSEMove): number {
        return (moves & ((~0) << (index * 3))) | (move << (index * 3));
    }

    function getLseMove(moves: number, index: number): LSEMove {
        return (moves >> (index * 3)) & 0b111;
    }

    function numLseMoves(moves: number): number {
        return Math.trunc((34 - Math.clz32(moves)) / 3);
    }

    function lseMoveArrayToNumber(lseMoves: LSEMove[]): number {
        let number: number = 0;
        for (let i = 0; i < lseMoves.length; i++) {
            number = setLseMove(number, i, lseMoves[i]);
        }
        return number;
    }

    function lseMovesToArray(lseMoves: number): LSEMove[] {
        const array: LSEMove[] = [];
        for (let i = 0; i < 10; i++) {
            const lseMove = getLseMove(lseMoves, i);
            if (lseMove) {
                array.push(lseMove);
            }
        }
        return array;
    }

    const table = new Map<number, number | number[]>();
    let tableSize = 0;
    function fillTable(state: LSEState, depth: number, mMove: boolean, lseMoves: number): void {
        const start = mMove ? 1 : 4;
        const end = mMove ? 4 : 7;
        for (let i = start; i < end; i++) {
            const lseMove: LSEMove = i;

            const nextState = move(state, lseMove);
            if (nextState === SOLVED_STATE) {
                continue;
            }

            const nextLseMoves = setLseMove(lseMoves, depth - 1, reverseLseMove(lseMove));

            const tableValue = table.get(nextState);
            if (tableValue === undefined) {
                table.set(nextState, nextLseMoves);
            } else if (typeof tableValue === "number") {
                table.set(nextState, [tableValue, nextLseMoves]);
            } else {
                tableValue.push(nextLseMoves);
            }

            if (depth > 1) {
                fillTable(nextState, depth - 1, !mMove, nextLseMoves);
            }
        }
    }

    export function initTable(): void {
        tableSize = 10;

        console.time("fill table");
        fillTable(SOLVED_STATE, tableSize, true, 0);
        fillTable(SOLVED_STATE, tableSize, false, 0);
        console.timeEnd("fill table");
    }

    export function clearTable(): void {
        tableSize = 0;

        console.time("clear table");
        table.clear();
        console.timeEnd("clear table");
    }

    export function search(state: LSEState, isSolved: (state: LSEState) => boolean, depth: number, mMove: boolean, solution: number[], solutions: string[]): void {
        let storedState = table.get(state);
        if (storedState !== undefined) {
            if (typeof storedState === "number") {
                storedState = [storedState];
            }
            for (const lseMoves of storedState) {
                if (numLseMoves(lseMoves) > depth) {
                    continue;
                }
                solutions.push(solution.concat(lseMovesToArray(lseMoves)).map(val => lseMoveToString(val)).join(" "));
            }
            return;
        } else if (depth <= tableSize) {
            return;
        }

        const start = mMove ? 1 : 4;
        const end = mMove ? 4 : 7;
        for (let i = start; i < end; i++) {
            const lseMove: LSEMove = i;

            const nextState = move(state, lseMove);
            solution.push(lseMove);
            if (isSolved(nextState)) {
                solutions.push(solution.map(move => lseMoveToString(move)).join(" "));
            } else if (depth > 1) {
                search(nextState, isSolved, depth - 1, !mMove, solution, solutions);
            }
            solution.pop();
        }
    }

    export function solve(state: LSEState, depth: number): string[] {
        const solutions: string[] = [];

        const isSolved = (state: LSEState) => state === SOLVED_STATE;

        console.time("solve");
        search(state, isSolved, depth, true, [], solutions);
        search(state, isSolved, depth, false, [], solutions);
        console.timeEnd("solve");

        return solutions;
    }

    function getEoState(ub: boolean, ur: boolean, uf: boolean, ul: boolean, df: boolean, db: boolean): LSEState {
        let eoState: LSEState = 0;

        if (ub) eoState = setNibble(eoState, UB_INDEX, 0b1000);
        if (ur) eoState = setNibble(eoState, UR_INDEX, 0b1000);
        if (uf) eoState = setNibble(eoState, UF_INDEX, 0b1000);
        if (ul) eoState = setNibble(eoState, UL_INDEX, 0b1000);
        if (df) eoState = setNibble(eoState, DF_INDEX, 0b1000);
        if (db) eoState = setNibble(eoState, DB_INDEX, 0b1000);

        return eoState;
    }

    function getEolrState(state: LSEState): LSEState {
        let eolrState: LSEState = state;

        const ulurEdges = [UL_INDEX, UR_INDEX];

        const ubEdge = getNibble(state, UB_INDEX);
        const urEdge = getNibble(state, UR_INDEX);
        const ufEdge = getNibble(state, UF_INDEX);
        const ulEdge = getNibble(state, UL_INDEX);
        const dfEdge = getNibble(state, DF_INDEX);
        const dbEdge = getNibble(state, DB_INDEX);

        if (ulurEdges.indexOf(ubEdge & 0b111) === -1) eolrState = setNibble(eolrState, UB_INDEX, ubEdge & 0b1000);
        if (ulurEdges.indexOf(urEdge & 0b111) === -1) eolrState = setNibble(eolrState, UR_INDEX, urEdge & 0b1000);
        if (ulurEdges.indexOf(ufEdge & 0b111) === -1) eolrState = setNibble(eolrState, UF_INDEX, ufEdge & 0b1000);
        if (ulurEdges.indexOf(ulEdge & 0b111) === -1) eolrState = setNibble(eolrState, UL_INDEX, ulEdge & 0b1000);
        if (ulurEdges.indexOf(dfEdge & 0b111) === -1) eolrState = setNibble(eolrState, DF_INDEX, dfEdge & 0b1000);
        if (ulurEdges.indexOf(dbEdge & 0b111) === -1) eolrState = setNibble(eolrState, DB_INDEX, dbEdge & 0b1000);

        return eolrState;
    }

    const ocEolrMask: LSEState = getEoState(false, false, false, false, false, false);
    const mcEolrMask: LSEState = getEoState(false, true, false, true, true, true);
    const eoMask: LSEState = getEoState(true, true, true, true, true, true);
    function isEolrSolved(eolrState: LSEState): boolean {
        const centerPermutation = getNibble(eolrState, CENTER_INDEX);
        if (centerPermutation % 2 === 0) {
            if ((eolrState & eoMask) !== ocEolrMask) {
                return false;
            }
        } else {
            if ((eolrState & eoMask) !== mcEolrMask) {
                return false;
            }
        }

        const ufEdge = getNibble(eolrState, UF_INDEX);
        const ubEdge = getNibble(eolrState, UB_INDEX);

        const cornerPermutation = getNibble(eolrState, CORNER_INDEX);
        switch (cornerPermutation) {
            case 0: case 2: return false;
            case 1:
                if (ufEdge !== UR_INDEX || ubEdge !== UL_INDEX) {
                    return false;
                }
                break;
            case 3:
                if (ufEdge !== UL_INDEX || ubEdge !== UR_INDEX) {
                    return false;
                }
                break;
        }

        return true;
    }

    export function solveEOLR(state: LSEState, depth: number): string[] {
        const solutions: string[] = [];

        const eolrState = getEolrState(state);

        const cubeContainer = document.createElement("div");
        document.body.appendChild(cubeContainer);

        const cube = Cube.fromString(stateToString(eolrState));
        cube.html(cubeContainer);

        function stringSplit(str: string): string {
            str = Array(32 - str.length % 32).fill("0").join("") + str;

            const out: string[] = [];
            for (let i = 0; i < str.length; i += 4) {
                out.push(str.slice(i, Math.min(i + 4, str.length)));
            }

            return out.join(" ");
        }

        clearTable();

        search(eolrState, isEolrSolved, depth, true, [], solutions);
        search(eolrState, isEolrSolved, depth, false, [], solutions);

        return solutions;
    }

    export function stateToString(state: LSEState): string {
        const centerPermutation = getNibble(state, CENTER_INDEX);
        const centers: string[] = ["U", "B", "D", "F"];
        for (let i = 0; i < centerPermutation; i++) {
            centers.unshift(centers.pop() as string);
        }

        const cornerPermutation = getNibble(state, CORNER_INDEX);
        const corners: string[] = ["F", "L", "B", "R"];
        for (let i = 0; i < cornerPermutation; i++) {
            corners.unshift(corners.pop() as string);
        }

        function getEdgeStickers(nibble: number): string {
            const flipped = nibble & 0b1000;
            nibble &= 0b111;

            let edge: string;
            switch (nibble) {
                case UB_INDEX: edge = "UB"; break;
                case UR_INDEX: edge = "UR"; break;
                case UF_INDEX: edge = "UF"; break;
                case UL_INDEX: edge = "UL"; break;
                case DF_INDEX: edge = "DF"; break;
                case DB_INDEX: edge = "DB"; break;
                default: throw new Error(`Invalid edge nibble: ${nibble.toString(2)}`);
            }

            if (flipped) {
                return edge[1] + edge[0];
            }
            return edge;
        }

        const ubEdge = getEdgeStickers(getNibble(state, UB_INDEX));
        const urEdge = getEdgeStickers(getNibble(state, UR_INDEX));
        const ufEdge = getEdgeStickers(getNibble(state, UF_INDEX));
        const ulEdge = getEdgeStickers(getNibble(state, UL_INDEX));
        const dfEdge = getEdgeStickers(getNibble(state, DF_INDEX));
        const dbEdge = getEdgeStickers(getNibble(state, DB_INDEX));

        return  `U${ubEdge[0]}U${ulEdge[0]}${centers[0]}${urEdge[0]}U${ufEdge[0]}U` + 
                `${corners[1]}${ulEdge[1]}${corners[1]}LLLLLL` +
                `${corners[0]}${ufEdge[1]}${corners[0]}F${centers[3]}FF${dfEdge[1]}F` +
                `${corners[3]}${urEdge[1]}${corners[3]}RRRRRR` +
                `${corners[2]}${ubEdge[1]}${corners[2]}B${centers[1]}BB${dbEdge[1]}B` +
                `D${dfEdge[0]}DD${centers[2]}DD${dbEdge[0]}D`;
    }

    function getNumCycles(array: number[]): number {
        let numCycles: number = 0;
        for (let i = 0; i < array.length; i++) {
            if (array[i] !== i) {
                const swap = array[array[i]];
                array[array[i]] = array[i];
                array[i] = swap;
                numCycles++;
                i--;
                continue;
            }
        }
        return numCycles;
    }

    export function getRandomState(): LSEState {
        const cornerPermutation = Math.floor(4 * Math.random());
        const centerPermutation = Math.floor(4 * Math.random());
        const solvedEdgePermutation = [0, 1, 2, 3, 4, 5];
        const edgePermutation = Array(6).fill(0).map(() => solvedEdgePermutation.splice(Math.floor(solvedEdgePermutation.length * Math.random()), 1)[0]);
        const edgeOrientation = Array(6).fill(0).map(() => Math.floor(2 * Math.random()));

        if (edgeOrientation.reduce((acc, val) => acc + val) % 2 !== 0) {
            edgeOrientation[0] ^= 1;
        }

        let randomState = 0;
        randomState = setNibble(randomState, UB_INDEX, edgePermutation[0] | (edgeOrientation[0] << 3));
        randomState = setNibble(randomState, UR_INDEX, edgePermutation[1] | (edgeOrientation[1] << 3));
        randomState = setNibble(randomState, UF_INDEX, edgePermutation[2] | (edgeOrientation[2] << 3));
        randomState = setNibble(randomState, UL_INDEX, edgePermutation[3] | (edgeOrientation[3] << 3));
        randomState = setNibble(randomState, DF_INDEX, edgePermutation[4] | (edgeOrientation[4] << 3));
        randomState = setNibble(randomState, DB_INDEX, edgePermutation[5] | (edgeOrientation[5] << 3));
        randomState = setNibble(randomState, CORNER_INDEX, cornerPermutation);
        randomState = setNibble(randomState, CENTER_INDEX, centerPermutation);

        if (getNumCycles(edgePermutation) % 2 !== (cornerPermutation + centerPermutation) % 2) {
            randomState = swapEdges(randomState, DF_INDEX, DB_INDEX);
        }

        return randomState;
    }
}