import { assert, mod } from "../utils.js";
import { Cube } from "./cube.js";
export class CacheCube {
    layerCount;
    cube;
    stickersPerFace;
    #cycleCube;
    #algMap;
    constructor(layerCount) {
        this.layerCount = layerCount;
        this.cube = new Cube(layerCount);
        this.stickersPerFace = layerCount ** 2;
        this.#cycleCube = new Cube(layerCount);
        this.#algMap = new WeakMap();
    }
    static #executeCycle(cube, cycle, amount) {
        const firstSticker = cube.stickers[cycle[0][0]][cycle[0][1]];
        for (let i = 0; i < cycle.length; i++) {
            const current = cycle[i];
            const nextIndex = mod(i + amount, cycle.length);
            const nextSticker = (nextIndex === 0) ?
                firstSticker :
                cube.stickers[cycle[nextIndex][0]][cycle[nextIndex][1]];
            cube.stickers[current[0]][current[1]] = nextSticker;
        }
    }
    static #executeCycleInverse(cube, cycle, amount) {
        const lastPosition = cycle[cycle.length - 1];
        const lastSticker = cube.stickers[lastPosition[0]][lastPosition[1]];
        for (let i = cycle.length - 1; i >= 0; i--) {
            const current = cycle[i];
            const prevIndex = mod(i + amount, cycle.length);
            const prevSticker = (prevIndex === cycle.length - 1) ?
                lastSticker :
                cube.stickers[cycle[prevIndex][0]][cycle[prevIndex][1]];
            cube.stickers[current[0]][current[1]] = prevSticker;
        }
    }
    static #executeCycles(cube, cycles, amount) {
        if (amount === 0) {
            return;
        }
        if (amount > 0) {
            for (const cycle of cycles) {
                this.#executeCycle(cube, cycle, amount);
            }
        }
        else {
            for (const cycle of cycles) {
                this.#executeCycleInverse(cube, cycle, amount);
            }
        }
    }
    #getIndex(i, j) {
        return i * this.stickersPerFace + j;
    }
    #getCycle(startI, startJ) {
        const cycle = [];
        let i = startI;
        let j = startJ;
        do {
            cycle.push([i, j]);
            const next = this.#cycleCube.stickers[i][j];
            i = Math.floor(next / this.stickersPerFace);
            j = next % this.stickersPerFace;
        } while (i !== startI || j !== startJ);
        return cycle;
    }
    #getCycles() {
        const cycles = [];
        const visitedStickersSet = new Set();
        for (let i = 0; i < 6; i++) {
            for (let j = 0; j < this.stickersPerFace; j++) {
                const index = this.#getIndex(i, j);
                if (visitedStickersSet.has(index)) {
                    continue;
                }
                if (this.#cycleCube.stickers[i][j] !== index) {
                    const cycle = this.#getCycle(i, j);
                    for (let i = 1; i < cycle.length; i++) {
                        visitedStickersSet.add(this.#getIndex(cycle[i][0], cycle[i][1]));
                    }
                    cycles.push(cycle);
                }
            }
        }
        return cycles;
    }
    #resetCycleCube() {
        for (let i = 0; i < 6; i++) {
            for (let j = 0; j < this.stickersPerFace; j++) {
                this.#cycleCube.stickers[i][j] = this.#getIndex(i, j);
            }
        }
    }
    recordAlg(alg) {
        this.#resetCycleCube();
        let amount = alg.amount;
        alg.amount = 1;
        this.#cycleCube.execute(alg);
        alg.amount = amount;
        const cycles = this.#getCycles();
        this.#algMap.set(alg, cycles);
        return cycles;
    }
    #recordAlgsRecursive(alg) {
        if (this.#algMap.has(alg)) {
            return;
        }
        this.#resetCycleCube();
        for (const node of alg.nodes) {
            switch (node.type) {
                case "Alg": {
                    this.#recordAlgsRecursive(node);
                    break;
                }
                case "Commutator": {
                    this.#recordAlgsRecursive(node.algA);
                    this.#recordAlgsRecursive(node.algB);
                }
                case "Conjugate": {
                    this.#recordAlgsRecursive(node.algA);
                    this.#recordAlgsRecursive(node.algB);
                }
                case "Move":
                case "Whitespace":
                case "Comment":
                    continue;
                default:
                    throw new Error(`Unimplemented alg node type in CacheCube.execute(): '${node.type}'`);
            }
        }
        this.#resetCycleCube();
        for (const node of alg.nodes) {
            switch (node.type) {
                case "Alg":
                    const cycles = this.#algMap.get(node);
                    assert(cycles !== undefined);
                    CacheCube.#executeCycles(this.#cycleCube, cycles, node.amount);
                    break;
                case "Commutator":
                case "Conjugate":
                    const algA = node.algA;
                    const algB = node.algB;
                    const cyclesA = this.#algMap.get(algA);
                    const cyclesB = this.#algMap.get(algB);
                    assert(cyclesA !== undefined && cyclesB !== undefined);
                    CacheCube.#executeCycles(this.#cycleCube, cyclesA, node.amount * algA.amount);
                    CacheCube.#executeCycles(this.#cycleCube, cyclesB, node.amount * algB.amount);
                    CacheCube.#executeCycles(this.#cycleCube, cyclesA, -node.amount * algA.amount);
                    if (node.type === "Commutator") {
                        CacheCube.#executeCycles(this.#cycleCube, cyclesB, -node.amount * algB.amount);
                    }
                    break;
                case "Move":
                    this.#cycleCube.execute(node);
            }
        }
        this.#algMap.set(alg, this.#getCycles());
    }
    execute(alg) {
        let cycles = this.#algMap.get(alg);
        if (cycles) {
            CacheCube.#executeCycles(this.cube, cycles, alg.amount);
            return;
        }
        this.#recordAlgsRecursive(alg);
        cycles = this.#algMap.get(alg);
        assert(cycles !== undefined);
        CacheCube.#executeCycles(this.cube, cycles, alg.amount);
    }
}
