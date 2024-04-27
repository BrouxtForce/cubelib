/// <reference types="bun-types" />

import { expect, test } from "bun:test";
import { Alg } from "../src/alg/alg";
import { Move } from "../src/alg/move";
import { Commutator } from "../src/alg/commutator";
import { Conjugate } from "../src/alg/conjugate";

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

test("Commutator invert", () => {
    const commutator = new Commutator(
        Alg.fromString("R' D R"),
        Alg.fromString("U")
    );

    commutator.invert();

    const expected = "U R' D R U' R' D' R".split(" ");

    let i = 0;
    for (const move of commutator) {
        expect(move.toString()).toBe(expected[i]);
        i++;
    }

    expect(i).toBe(expected.length);
});

test("Conjugate invert", () => {
    const conjugate = new Conjugate(
        Alg.fromString("R U R'"),
        Alg.fromString("F")
    );

    conjugate.invert();

    const expected = "R U R' F' R U' R'".split(" ");

    let i = 0;
    for (const move of conjugate) {
        expect(move.toString()).toBe(expected[i]);
        i++;
    }

    expect(i).toBe(expected.length);
});

test("Alg invert", () => {
    const alg = Alg.fromString("[[R: U], F]");

    alg.invert();

    const expected = "F R U R' F' R U' R'".split(" ");

    let i = 0;
    for (const move of alg) {
        expect(move.toString()).toBe(expected[i]);
        i++;
    }

    expect(i).toBe(expected.length);
});

test("Alg expand inverse", () => {
    const commutator = "[D : [R' D R, U]']'";

    const alg = Alg.fromString(commutator);
    const expandedNodes: Move[] = alg.expanded().filter(node => node.type === "Move") as Move[];

    const expected = "D R' D R U R' D' R U' D'".split(" ");

    expect(expandedNodes.length).toBe(expected.length);
    for (let i = 0; i < expandedNodes.length; i++) {
        expect(expandedNodes[i].toString()).toBe(expected[i]);
    }
});

test("Alg expand repeats", () => {
    const commutator = "(R U, R' U')3";

    const alg = Alg.fromString(commutator);
    const expandedNodes: Move[] = alg.expanded().filter(node => node.type === "Move") as Move[];

    const expected = "R U R' U' U' R' U R R U R' U' U' R' U R R U R' U' U' R' U R".split(" ");

    expect(expandedNodes.length).toBe(expected.length);
    for (let i = 0; i < expandedNodes.length; i++) {
        expect(expandedNodes[i].toString()).toBe(expected[i]);
    }
});