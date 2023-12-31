/// <reference types="bun-types" />

import { expect, test } from "bun:test";
import { Move } from "../src/cube/move";

test("Move with number suffix", () => {
    const move = Move.fromString("U5");

    expect(move.face).toBe("U");
    expect(move.amount).toBe(5);
    expect(move.shallow).toBe(1);
    expect(move.deep).toBe(1);
});

test("Move with number prefix", () => {
    const move = Move.fromString("2D");

    expect(move.face).toBe("D");
    expect(move.amount).toBe(1);
    expect(move.shallow).toBe(2);
    expect(move.deep).toBe(2);
});

test("Wide move with number prefix", () => {
    const move = Move.fromString("2Lw");

    expect(move.face).toBe("L");
    expect(move.amount).toBe(1);
    expect(move.shallow).toBe(1);
    expect(move.deep).toBe(2);
});

test("Move with double number prefix", () => {
    const move = Move.fromString("2-3R");

    expect(move.face).toBe("R");
    expect(move.amount).toBe(1);
    expect(move.shallow).toBe(2);
    expect(move.deep).toBe(3);
});

test("Wide move with double number prefix", () => {
    const move = Move.fromString("3-4Fw");

    expect(move.face).toBe("F");
    expect(move.amount).toBe(1);
    expect(move.shallow).toBe(3);
    expect(move.deep).toBe(4);
});

test("Wide moves", () => {
    const move = Move.fromString("Bw");

    expect(move.face).toBe("B");
    expect(move.amount).toBe(1);
    expect(move.shallow).toBe(1);
    expect(move.deep).toBe(2);
});