/// <reference types="bun-types" />

import { expect, test, describe } from "bun:test";
import { FastLSE } from "../src/solver/fast-lse";
import { Cube } from "../src/cube/cube";
import { Alg } from "../src/alg/alg";

describe("FastLSE LSE solver", () => {
    test("Table does not effect results", () => {
        const scrambledState = FastLSE.getRandomState();

        let prevJoinedSolutions: string = "";
        for (let i = 0; i <= 10; i++) {
            FastLSE.clearTable();
            FastLSE.initTable(i);
            const joinedSolutions = FastLSE.solve(scrambledState, 15).join("|");
            if (i > 0) {
                expect(prevJoinedSolutions).toBe(joinedSolutions);
            }
            prevJoinedSolutions = joinedSolutions;
        }
    });

    test("All solutions solve LSE", () => {
        const scrambledState = FastLSE.getRandomState();
        const solutions = FastLSE.solve(scrambledState, 15);
        const stateString = FastLSE.stateToString(scrambledState);
        for (const solution of solutions) {
            const cube = Cube.fromString(stateString);
            cube.execute(Alg.fromString(solution));
            expect(cube.solved()).toBe(true);
        }
    });
});

describe("FastLSE EOLR solver", () => {
    test("Table does not effect results", () => {
        const randomEo = Array(6).fill(0).map(_ => Math.floor(Math.random() * 2));
        const scrambledState = FastLSE.getRandomEolrStateWithEo(randomEo);

        let prevJoinedSolutions: string = "";
        for (let i = 0; i <= 10; i++) {
            FastLSE.clearEolrTable();
            FastLSE.initEolrTable(i);
            const joinedSolutions = FastLSE.solveEolr(scrambledState, 13).join("|");
            if (i > 0) {
                expect(prevJoinedSolutions).toBe(joinedSolutions);
            }
            prevJoinedSolutions = joinedSolutions;
        }
    });

    test("All solutions solve EOLR", () => {
        const randomEo = Array(6).fill(0).map(_ => Math.floor(Math.random() * 2));
        const scrambledState = FastLSE.getRandomEolrStateWithEo(randomEo);
        const solutions = FastLSE.solveEolr(scrambledState, 15);
        for (const solution of solutions) {
            let state = scrambledState;
            const moves = solution.split(" ").map(FastLSE.stringToLseMove);
            for (const move of moves) {
                state = FastLSE.move(state, move);
            };
            expect(FastLSE.solveEolr(state, 0).length).toBe(2);
        }
    });
});
