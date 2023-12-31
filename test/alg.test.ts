/// <reference types="bun-types" />

import { expect, test } from "bun:test";
import { Alg } from "../src/cube/alg";

test("Alg iterator", () => {
    const forward = "U F x R B L y D z M E S";
    const backward = "S' E' M' z' D' y' L' B' R' x' F' U'";

    const forwardMoves = forward.split(" ");
    const backwardMoves = backward.split(" ");
    
    const alg = Alg.fromString(forward);

    let i = 0;
    for (const move of alg) {
        expect(move.toString()).toBe(forwardMoves[i]);
        i++;
    }

    i = 0;
    for (const move of alg.reverse()) {
        expect(move.toString()).toBe(backwardMoves[i]);
        i++;
    }
});

test("Commutator/conjugate iterator", () => {
    const commutator = "[L' 2U : [3R U 3R', 2U2]]";
    const expanded = "L' 2U 3R U 3R' 2U2 3R U' 3R' 2U2' 2U' L";
    const backward = "L' 2U 2U2 3R U 3R' 2U2' 3R U' 3R' 2U' L";
    const forwardMoves = expanded.split(" ");
    const backwardMoves = backward.split(" ");

    const alg = Alg.fromString(commutator);

    let i = 0;
    for (const move of alg) {
        expect(move.toString()).toBe(forwardMoves[i]);
        i++;
    }

    i = 0;
    for (const move of alg.reverse()) {
        expect(move.toString()).toBe(backwardMoves[i]);
        i++;
    }
});