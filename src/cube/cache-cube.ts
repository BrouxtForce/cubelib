import type { Alg } from "../alg/alg.js";
import type { Commutator } from "../alg/commutator.js";
import type { Conjugate } from "../alg/conjugate.js";
import { Cube } from "./cube.js";
import { assert, mod } from "../utils.js";

export class CacheCube {
    public readonly layerCount: number;
    public readonly cube: Cube;
    public readonly stickersPerFace;
    readonly #cycleCube: Cube;
    readonly #algMap: WeakMap<Alg, [number, number][][]>;

    constructor(layerCount: number) {
        this.layerCount = layerCount;
        this.cube = new Cube(layerCount);
        this.stickersPerFace = layerCount ** 2;
        this.#cycleCube = new Cube(layerCount);
        this.#algMap = new WeakMap();
    }

    static #executeCycle(cube: Cube, cycle: [number, number][], amount: number): void {
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
    static #executeCycleInverse(cube: Cube, cycle: [number, number][], amount: number): void {
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
    static #executeCycles(cube: Cube, cycles: [number, number][][], amount: number): void {
        if (amount === 0) {
            return;
        }
        if (amount > 0) {
            for (const cycle of cycles) {
                this.#executeCycle(cube, cycle, amount);
            }
        } else {
            for (const cycle of cycles) {
                this.#executeCycleInverse(cube, cycle, amount);
            }
        }
    }

    #getIndex(i: number, j: number): number {
        return i * this.stickersPerFace + j;
    }

    #getCycle(startI: number, startJ: number): [number, number][] {
        const cycle: [number, number][] = [];

        let i = startI;
        let j = startJ;

        do {
            cycle.push([i, j]);

            const next = this.#cycleCube.stickers[i][j];
            i = Math.floor(next / this.stickersPerFace);
            j = next % this.stickersPerFace;
        }
        while (i !== startI || j !== startJ);

        return cycle;
    }

    #getCycles(): [number, number][][] {
        const cycles: [number, number][][] = [];

        // This set will only be filled with stickers after the current index
        // because the stickers are iterated in order
        const visitedStickersSet = new Set<number>();

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

    #resetCycleCube(): void {
        for (let i = 0; i < 6; i++) {
            for (let j = 0; j < this.stickersPerFace; j++) {
                this.#cycleCube.stickers[i][j] = this.#getIndex(i, j);
            }
        }
    }

    recordAlg(alg: Alg): [number, number][][] {
        this.#resetCycleCube();

        // We only want to record one execution of the alg
        let amount = alg.amount;
        alg.amount = 1;
        this.#cycleCube.execute(alg);
        alg.amount = amount;

        const cycles = this.#getCycles();
        this.#algMap.set(alg, cycles);

        return cycles;
    }

    #recordAlgsRecursive(alg: Alg): void {
        // Skip this alg if it has already been recorded
        if (this.#algMap.has(alg)) {
            return;
        }

        this.#resetCycleCube();

        // Call #recordAlgsRecursive recursively on all child algs
        for (const node of alg.moveNodes) {
            switch (node.type) {
                case "Alg":
                    this.#recordAlgsRecursive(node);
                    break;
                case "Commutator":
                case "Conjugate":
                    this.#recordAlgsRecursive(node.algA);
                    this.#recordAlgsRecursive(node.algB);
                case "Move":
                    continue;
                default:
                    // @ts-expect-error if all cases have been covered, node.type should be of type never
                    throw new Error(`Unimplemented alg move node type in CacheCube.execute(): '${node.type}'`);
            }
        }

        // Record the current alg
        this.#resetCycleCube();
        for (const node of alg.moveNodes) {
            switch (node.type) {
                case "Alg": {
                    const cycles = this.#algMap.get(node);
                    assert(cycles !== undefined);
                    CacheCube.#executeCycles(this.#cycleCube, cycles, node.amount);
                    break;
                }
                case "Commutator":
                case "Conjugate": {
                    const cyclesA = this.#algMap.get(node.algA);
                    const cyclesB = this.#algMap.get(node.algB);
                    assert(cyclesA !== undefined && cyclesB !== undefined);

                    const absAmount = Math.abs(node.amount);
                    if (node.amount > 0) {
                        // Commutator = A B A' B'
                        // Conjugate = A B A'
                        CacheCube.#executeCycles(this.#cycleCube, cyclesA, absAmount * node.algA.amount);
                        CacheCube.#executeCycles(this.#cycleCube, cyclesB, absAmount * node.algB.amount);
                        CacheCube.#executeCycles(this.#cycleCube, cyclesA, -absAmount * node.algA.amount);
                        if (node.type === "Commutator") {
                            CacheCube.#executeCycles(this.#cycleCube, cyclesB, -absAmount * node.algB.amount);
                        }
                    } else {
                        // Commutator' = B A B' A'
                        // Conjugate' = A B' A'
                        if (node.type === "Commutator") {
                            CacheCube.#executeCycles(this.#cycleCube, cyclesB, absAmount * node.algB.amount);
                        }
                        CacheCube.#executeCycles(this.#cycleCube, cyclesA, absAmount * node.algA.amount);
                        CacheCube.#executeCycles(this.#cycleCube, cyclesB, -absAmount * node.algB.amount);
                        CacheCube.#executeCycles(this.#cycleCube, cyclesA, -absAmount * node.algA.amount);
                    }
                    break;
                }
                case "Move":
                    this.#cycleCube.execute(node);
            }
        }
        this.#algMap.set(alg, this.#getCycles());
    }

    execute(alg: Alg): void {
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