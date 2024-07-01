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
    function fillTable(state, depth, mMove, numMoves, table) {
        const tableValue = table.get(state);
        if (tableValue === undefined || numMoves < tableValue) {
            table.set(state, numMoves);
        }
        else {
            return;
        }
        if (depth < 1) {
            return;
        }
        const start = mMove ? 1 : 4;
        const end = mMove ? 4 : 7;
        for (let i = start; i < end; i++) {
            const lseMove = i;
            const nextState = move(state, lseMove);
            fillTable(nextState, depth - 1, !mMove, numMoves + 1, table);
        }
    }
    const eolrTable = new Map();
    let eolrTableSize = 0;
    function initEolrTable(size) {
        eolrTableSize = size;
        let state = getEolrState(FastLSE.SOLVED_STATE);
        for (let j = 0; j < 4; j++) {
            state = move(state, LSEMove.U);
            fillTable(state, eolrTableSize, true, 0, eolrTable);
            fillTable(state, eolrTableSize, false, 0, eolrTable);
            state = move(state, LSEMove.U2);
            fillTable(state, eolrTableSize, true, 0, eolrTable);
            fillTable(state, eolrTableSize, false, 0, eolrTable);
            state = move(state, LSEMove.U);
            state = move(state, LSEMove.M);
        }
    }
    FastLSE.initEolrTable = initEolrTable;
    function clearEolrTable() {
        eolrTableSize = 0;
        eolrTable.clear();
    }
    FastLSE.clearEolrTable = clearEolrTable;
    const lseTable = new Map();
    let lseTableSize = 0;
    function initTable(size) {
        lseTableSize = size;
        fillTable(FastLSE.SOLVED_STATE, lseTableSize, true, 0, lseTable);
        fillTable(FastLSE.SOLVED_STATE, lseTableSize, false, 0, lseTable);
    }
    FastLSE.initTable = initTable;
    function clearTable() {
        lseTableSize = 0;
        lseTable.clear();
    }
    FastLSE.clearTable = clearTable;
    function search(state, depth, mMove, solution, solutions, table, tableSize) {
        let numMoves = table.get(state);
        if (numMoves !== undefined) {
            if (numMoves === 0) {
                solutions.push(solution.map(move => lseMoveToString(move)).join(" "));
                return;
            }
            if (numMoves > depth) {
                return;
            }
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
            if (depth > 1) {
                search(nextState, depth - 1, !mMove, solution, solutions, table, tableSize);
            }
            solution.pop();
        }
    }
    FastLSE.search = search;
    function solve(state, depth) {
        const solutions = [];
        search(state, depth, true, [], solutions, lseTable, lseTableSize);
        search(state, depth, false, [], solutions, lseTable, lseTableSize);
        return solutions;
    }
    FastLSE.solve = solve;
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
    function solveEOLR(state, depth) {
        const solutions = [];
        const eolrState = getEolrState(state);
        search(eolrState, depth, true, [], solutions, eolrTable, eolrTableSize);
        search(eolrState, depth, false, [], solutions, eolrTable, eolrTableSize);
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
    function getRandomEolrStateWithEo(eo) {
        const cornerPermutation = Math.floor(4 * Math.random());
        const centerPermutation = Math.floor(2 * Math.random()) * 2;
        const solvedEdgePermutation = [0, 1, 2, 3, 4, 5];
        const edgePermutation = Array(6).fill(0).map(() => solvedEdgePermutation.splice(Math.floor(solvedEdgePermutation.length * Math.random()), 1)[0]);
        const edgeOrientation = eo;
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
    FastLSE.getRandomEolrStateWithEo = getRandomEolrStateWithEo;
})(FastLSE || (FastLSE = {}));
