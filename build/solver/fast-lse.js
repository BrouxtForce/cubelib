import { Cube } from "../cube/cube.js";
export var FastLSE;
(function (FastLSE) {
    FastLSE.SOLVED_STATE = 0x543210;
    const UB_INDEX = 0;
    const UR_INDEX = 1;
    const UF_INDEX = 2;
    const UL_INDEX = 3;
    const DF_INDEX = 4;
    const DB_INDEX = 5;
    const CORNER_INDEX = 6;
    const CENTER_INDEX = 7;
    let LSEMove;
    (function (LSEMove) {
        LSEMove[LSEMove["M"] = 1] = "M";
        LSEMove[LSEMove["M2"] = 2] = "M2";
        LSEMove[LSEMove["MPrime"] = 3] = "MPrime";
        LSEMove[LSEMove["U"] = 4] = "U";
        LSEMove[LSEMove["U2"] = 5] = "U2";
        LSEMove[LSEMove["UPrime"] = 6] = "UPrime";
    })(LSEMove || (LSEMove = {}));
    ;
    function lseMoveToString(move) {
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
    function stringToLseMove(move) {
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
    FastLSE.stringToLseMove = stringToLseMove;
    function getNibble(state, index) {
        return (state >> (index * 4)) & 0b1111;
    }
    function setNibble(state, index, nibble) {
        return ((state & ((~0) ^ (0b1111 << (index * 4)))) | (nibble << (index * 4)));
    }
    function cycleEdgesCw(state, index0, index1, index2, index3) {
        let outState = state;
        outState = setNibble(outState, index0, getNibble(state, index3));
        outState = setNibble(outState, index1, getNibble(state, index0));
        outState = setNibble(outState, index2, getNibble(state, index1));
        outState = setNibble(outState, index3, getNibble(state, index2));
        return outState;
    }
    function cycleEdgesCcw(state, index0, index1, index2, index3) {
        let outState = state;
        outState = setNibble(outState, index0, getNibble(state, index1));
        outState = setNibble(outState, index1, getNibble(state, index2));
        outState = setNibble(outState, index2, getNibble(state, index3));
        outState = setNibble(outState, index3, getNibble(state, index0));
        return outState;
    }
    function swapEdges(state, index0, index1) {
        let outState = state;
        outState = setNibble(outState, index0, getNibble(state, index1));
        outState = setNibble(outState, index1, getNibble(state, index0));
        return outState;
    }
    function flipM(state) {
        return state ^ 8914952;
    }
    function addCenterState(state, amount) {
        return setNibble(state, 7, (getNibble(state, 7) + amount) % 4);
    }
    function addCornerState(state, amount) {
        return setNibble(state, 6, (getNibble(state, 6) + amount) % 4);
    }
    function move(state, move) {
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
    FastLSE.move = move;
    function reverseLseMove(move) {
        switch (move) {
            case LSEMove.M: return LSEMove.MPrime;
            case LSEMove.MPrime: return LSEMove.M;
            case LSEMove.U: return LSEMove.UPrime;
            case LSEMove.UPrime: return LSEMove.U;
            default: return move;
        }
    }
    function setLseMove(moves, index, move) {
        return (moves & ((~0) << (index * 3))) | (move << (index * 3));
    }
    function getLseMove(moves, index) {
        return (moves >> (index * 3)) & 0b111;
    }
    function numLseMoves(moves) {
        return Math.trunc((34 - Math.clz32(moves)) / 3);
    }
    function lseMoveArrayToNumber(lseMoves) {
        let number = 0;
        for (let i = 0; i < lseMoves.length; i++) {
            number = setLseMove(number, i, lseMoves[i]);
        }
        return number;
    }
    function lseMovesToArray(lseMoves) {
        const array = [];
        for (let i = 0; i < 10; i++) {
            const lseMove = getLseMove(lseMoves, i);
            if (lseMove) {
                array.push(lseMove);
            }
        }
        return array;
    }
    const table = new Map();
    let tableSize = 0;
    function fillTable(state, depth, mMove, lseMoves) {
        const start = mMove ? 1 : 4;
        const end = mMove ? 4 : 7;
        for (let i = start; i < end; i++) {
            const lseMove = i;
            const nextState = move(state, lseMove);
            if (nextState === FastLSE.SOLVED_STATE) {
                continue;
            }
            const nextLseMoves = setLseMove(lseMoves, depth - 1, reverseLseMove(lseMove));
            const tableValue = table.get(nextState);
            if (tableValue === undefined) {
                table.set(nextState, nextLseMoves);
            }
            else if (typeof tableValue === "number") {
                table.set(nextState, [tableValue, nextLseMoves]);
            }
            else {
                tableValue.push(nextLseMoves);
            }
            if (depth > 1) {
                fillTable(nextState, depth - 1, !mMove, nextLseMoves);
            }
        }
    }
    function initTable() {
        tableSize = 10;
        console.time("fill table");
        fillTable(FastLSE.SOLVED_STATE, tableSize, true, 0);
        fillTable(FastLSE.SOLVED_STATE, tableSize, false, 0);
        console.timeEnd("fill table");
    }
    FastLSE.initTable = initTable;
    function clearTable() {
        tableSize = 0;
        console.time("clear table");
        table.clear();
        console.timeEnd("clear table");
    }
    FastLSE.clearTable = clearTable;
    function search(state, isSolved, depth, mMove, solution, solutions) {
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
        }
        else if (depth <= tableSize) {
            return;
        }
        const start = mMove ? 1 : 4;
        const end = mMove ? 4 : 7;
        for (let i = start; i < end; i++) {
            const lseMove = i;
            const nextState = move(state, lseMove);
            solution.push(lseMove);
            if (isSolved(nextState)) {
                solutions.push(solution.map(move => lseMoveToString(move)).join(" "));
            }
            else if (depth > 1) {
                search(nextState, isSolved, depth - 1, !mMove, solution, solutions);
            }
            solution.pop();
        }
    }
    FastLSE.search = search;
    function solve(state, depth) {
        const solutions = [];
        const isSolved = (state) => state === FastLSE.SOLVED_STATE;
        console.time("solve");
        search(state, isSolved, depth, true, [], solutions);
        search(state, isSolved, depth, false, [], solutions);
        console.timeEnd("solve");
        return solutions;
    }
    FastLSE.solve = solve;
    function getEoState(ub, ur, uf, ul, df, db) {
        let eoState = 0;
        if (ub)
            eoState = setNibble(eoState, UB_INDEX, 0b1000);
        if (ur)
            eoState = setNibble(eoState, UR_INDEX, 0b1000);
        if (uf)
            eoState = setNibble(eoState, UF_INDEX, 0b1000);
        if (ul)
            eoState = setNibble(eoState, UL_INDEX, 0b1000);
        if (df)
            eoState = setNibble(eoState, DF_INDEX, 0b1000);
        if (db)
            eoState = setNibble(eoState, DB_INDEX, 0b1000);
        return eoState;
    }
    function getEolrState(state) {
        let eolrState = state;
        const ulurEdges = [UL_INDEX, UR_INDEX];
        const ubEdge = getNibble(state, UB_INDEX);
        const urEdge = getNibble(state, UR_INDEX);
        const ufEdge = getNibble(state, UF_INDEX);
        const ulEdge = getNibble(state, UL_INDEX);
        const dfEdge = getNibble(state, DF_INDEX);
        const dbEdge = getNibble(state, DB_INDEX);
        if (ulurEdges.indexOf(ubEdge & 0b111) === -1)
            eolrState = setNibble(eolrState, UB_INDEX, ubEdge & 0b1000);
        if (ulurEdges.indexOf(urEdge & 0b111) === -1)
            eolrState = setNibble(eolrState, UR_INDEX, urEdge & 0b1000);
        if (ulurEdges.indexOf(ufEdge & 0b111) === -1)
            eolrState = setNibble(eolrState, UF_INDEX, ufEdge & 0b1000);
        if (ulurEdges.indexOf(ulEdge & 0b111) === -1)
            eolrState = setNibble(eolrState, UL_INDEX, ulEdge & 0b1000);
        if (ulurEdges.indexOf(dfEdge & 0b111) === -1)
            eolrState = setNibble(eolrState, DF_INDEX, dfEdge & 0b1000);
        if (ulurEdges.indexOf(dbEdge & 0b111) === -1)
            eolrState = setNibble(eolrState, DB_INDEX, dbEdge & 0b1000);
        return eolrState;
    }
    const ocEolrMask = getEoState(false, false, false, false, false, false);
    const mcEolrMask = getEoState(false, true, false, true, true, true);
    const eoMask = getEoState(true, true, true, true, true, true);
    function isEolrSolved(eolrState) {
        const centerPermutation = getNibble(eolrState, CENTER_INDEX);
        if (centerPermutation % 2 === 0) {
            if ((eolrState & eoMask) !== ocEolrMask) {
                return false;
            }
        }
        else {
            if ((eolrState & eoMask) !== mcEolrMask) {
                return false;
            }
        }
        const ufEdge = getNibble(eolrState, UF_INDEX);
        const ubEdge = getNibble(eolrState, UB_INDEX);
        const cornerPermutation = getNibble(eolrState, CORNER_INDEX);
        switch (cornerPermutation) {
            case 0:
            case 2: return false;
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
    function solveEOLR(state, depth) {
        const solutions = [];
        const eolrState = getEolrState(state);
        const cubeContainer = document.createElement("div");
        document.body.appendChild(cubeContainer);
        const cube = Cube.fromString(stateToString(eolrState));
        cube.html(cubeContainer);
        function stringSplit(str) {
            str = Array(32 - str.length % 32).fill("0").join("") + str;
            const out = [];
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
    FastLSE.solveEOLR = solveEOLR;
    function stateToString(state) {
        const centerPermutation = getNibble(state, CENTER_INDEX);
        const centers = ["U", "B", "D", "F"];
        for (let i = 0; i < centerPermutation; i++) {
            centers.unshift(centers.pop());
        }
        const cornerPermutation = getNibble(state, CORNER_INDEX);
        const corners = ["F", "L", "B", "R"];
        for (let i = 0; i < cornerPermutation; i++) {
            corners.unshift(corners.pop());
        }
        function getEdgeStickers(nibble) {
            const flipped = nibble & 0b1000;
            nibble &= 0b111;
            let edge;
            switch (nibble) {
                case UB_INDEX:
                    edge = "UB";
                    break;
                case UR_INDEX:
                    edge = "UR";
                    break;
                case UF_INDEX:
                    edge = "UF";
                    break;
                case UL_INDEX:
                    edge = "UL";
                    break;
                case DF_INDEX:
                    edge = "DF";
                    break;
                case DB_INDEX:
                    edge = "DB";
                    break;
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
        return `U${ubEdge[0]}U${ulEdge[0]}${centers[0]}${urEdge[0]}U${ufEdge[0]}U` +
            `${corners[1]}${ulEdge[1]}${corners[1]}LLLLLL` +
            `${corners[0]}${ufEdge[1]}${corners[0]}F${centers[3]}FF${dfEdge[1]}F` +
            `${corners[3]}${urEdge[1]}${corners[3]}RRRRRR` +
            `${corners[2]}${ubEdge[1]}${corners[2]}B${centers[1]}BB${dbEdge[1]}B` +
            `D${dfEdge[0]}DD${centers[2]}DD${dbEdge[0]}D`;
    }
    FastLSE.stateToString = stateToString;
    function getNumCycles(array) {
        let numCycles = 0;
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
    function getRandomState() {
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
    FastLSE.getRandomState = getRandomState;
})(FastLSE || (FastLSE = {}));
