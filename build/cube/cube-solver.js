import { Cube } from "./cube.js";
import { Alg } from "./alg.js";
import { Move } from "./move.js";
export class CubeSolver {
    constructor(layerCount) {
        console.assert(Number.isInteger(layerCount) && layerCount > 1);
        this.layerCount = layerCount;
        this.state = Array(layerCount ** 3 - (layerCount - 2) ** 3);
        this.cycles = new Map();
    }
    calcMoveCycle(moveString) {
        const cube = new Cube(this.layerCount);
        const move = Move.fromString(moveString);
        if (move === null) {
            console.error(`Invalid move: '${moveString}'`);
            return;
        }
        let arrayHeight = cube.stickers.length;
        let arrayWidth = cube.stickers[0].length;
        for (let i = 0; i < arrayHeight; i++) {
            for (let j = 0; j < arrayWidth; j++) {
                cube.stickers[i][j] = i * arrayWidth + j;
            }
        }
        cube.execute(new Alg([move]));
        let cycles = [];
        let currentCycle = [];
        let searchedPieces = Array(arrayHeight * arrayWidth).fill(false);
        for (let i = 0; i < arrayHeight; i++) {
            for (let j = 0; j < arrayWidth; j++) {
                const index1D = i * arrayWidth + j;
                if (searchedPieces[index1D]) {
                    continue;
                }
                searchedPieces[index1D] = true;
                currentCycle = [index1D];
                let nextIndex = cube.stickers[i][j];
                while (!searchedPieces[nextIndex]) {
                    currentCycle.push(nextIndex);
                    searchedPieces[nextIndex] = true;
                    let nextI = Math.floor(nextIndex / arrayWidth);
                    let nextJ = nextIndex % arrayWidth;
                    nextIndex = cube.stickers[nextI][nextJ];
                }
                if (currentCycle.length > 1) {
                    cycles.push(currentCycle);
                }
            }
        }
        this.cycles.set(move.toString(), cycles);
    }
    cycle(cycles) {
        let swap = this.state[cycles[0]];
        for (let i = 0; i < this.state.length - 1; i++) {
            this.state[cycles[i]] = this.state[cycles[i + 1]];
        }
        this.state[cycles[cycles.length - 1]] = swap;
    }
    move(moveString) {
        const cycles = this.cycles.get(moveString);
        if (cycles === undefined) {
            console.error(`Move '${moveString}' has not been calculated.`);
            return;
        }
        for (const cycle of cycles) {
            this.cycle(cycle);
        }
    }
    solve(depth) {
        let moves = [];
        for (const key of this.cycles.keys()) {
            moves.push(Move.fromString(key));
        }
        let moveGroups = [];
        moveLoop: for (const move of moves) {
            for (const moveGroup of moveGroups) {
                if (moveGroup[0].face === move.face &&
                    moveGroup[0].shallow === move.shallow &&
                    moveGroup[0].deep === move.deep) {
                    moveGroup.push(move);
                    continue moveLoop;
                }
            }
            moveGroups.push([move]);
        }
        let moveStringGroups = [];
        for (const moveGroup of moveGroups) {
            let currentArray = [];
            for (const move of moveGroup) {
                currentArray.push(move.toString());
            }
            moveStringGroups.push(currentArray);
        }
        let maxShallowIterations = moveStringGroups.length * ((moveStringGroups.length - 1) ** (depth - 1));
        console.log(`Max shallow iterations: ${maxShallowIterations}`);
        let indices = Array(depth).fill(0);
        let indicesIndex = 0;
        for (let i = 0; i < maxShallowIterations; i++) {
            indices[indicesIndex] = (indices[indicesIndex] + 1) % depth;
        }
        return [];
    }
}
