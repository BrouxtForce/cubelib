/// <reference types="bun-types" />

import { expect, test, describe } from "bun:test";
import { Alg } from "../src/alg/alg";
import { Move } from "../src/alg/move";
import { Commutator } from "../src/alg/commutator";
import { Conjugate } from "../src/alg/conjugate";

function algIsIdentical(a: Alg, b: Alg): boolean {
    const expandedA = a.expandedMoves();
    const expandedB = b.expandedMoves();
    return expandedA.every((move, i) => move.equal(expandedB[i]));
}

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

test("Alg expanded inverse", () => {
    const commutator = "[D : [R' D R, U]']'";

    const alg = Alg.fromString(commutator);
    const expandedNodes: Move[] = alg.expandedMoves();

    const expected = "D R' D R U R' D' R U' D'";

    expect(expandedNodes.join(" ")).toBe(expected);
});

test("Alg expanded repeats", () => {
    const commutator = "(R U, R' U')3";

    const alg = Alg.fromString(commutator);
    const expandedNodes: Move[] = alg.expandedMoves();

    const expected = "R U R' U' U' R' U R R U R' U' U' R' U R R U R' U' U' R' U R".split(" ");

    expect(expandedNodes.length).toBe(expected.length);
    for (let i = 0; i < expandedNodes.length; i++) {
        expect(expandedNodes[i].toString()).toBe(expected[i]);
    }
});

test("Alg.expanded matches Alg.expandedMoves", () => {
    const testAlgs = [
        "[R U: [L' D2, B Fw]2]3'",
        "(R2 U' F' L2 D Bw')5' R2 U F"
    ].map(alg => Alg.fromString(alg));

    for (const testAlg of testAlgs) {
        expect(
            testAlg.expanded().filter(node => node.type === "Move").join(" ")
        ).toBe(
            testAlg.expandedMoves().join(" ")
        );
    }
});

describe("Alg.simplify()", () => {
    const testCases: [string, string][] = [
        // Single move simplifications
        ["R2 F3 L14 B0 D1", "R2 F' L2 D"],

        // Move merging/cancelling
        ["R U U R", "R U2 R"],
        ["R U U' R", "R2"],
        ["R U U' R'", ""],

        // Grouping symbol simplification
        ["(L U U' L)15", "L2"],
        ["(R)3", "R'"],

        // Commutator simplification
        ["[R U2 U2 R', L]2", ""],
        ["[F D R' L, B0]3'", ""],
        ["[R2 D U0 D' R R, L2 L L]", ""],

        // Conjugate simplification
        ["[R: U0]", ""],
        ["[B2 B' B3: R U R']", "R U R'"],
        ["[F2 D D3 F6: R D0 R']", ""]
    ];

    for (const [input, expected] of testCases) {
        console.log(Alg.fromString(input).simplify());
        expect(
            Alg.fromString(input).simplify().expandedMoves().join(" ")
        ).toEqual(expected);
    }
});