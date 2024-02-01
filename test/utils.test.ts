/// <reference types="bun-types" />

import { expect, test } from "bun:test";
import * as Utils from "../src/utils";

test("arrayRepeat n repeatCount", () => {
    const testArray = [1, 2, 3, 4, 5];
    const repeatArray = testArray.slice();

    const repeatCount = 3;
    Utils.arrayRepeat(repeatArray, repeatCount);

    // repeatCount > 1 should create repeatCount shallow copies of the array
    expect(testArray.length * repeatCount).toBe(repeatArray.length);

    for (let i = 0; i < repeatCount; i++) {
        for (let j = 0; j < testArray.length; j++) {
            expect(repeatArray[i * testArray.length + j]).toBe(testArray[j]);
        }
    }
});

test("arrayRepeat one repeatCount", () => {
    const testArray = [6, 7, 8, 9, 10];
    const repeatArray = testArray.slice();

    // A one repeat count should not modify the array
    Utils.arrayRepeat(repeatArray, 1);

    expect(testArray.length).toBe(repeatArray.length);

    for (let i = 0; i < testArray.length; i++) {
        expect(testArray[i]).toBe(repeatArray[i]);
    }
});

test("arrayRepeat zero repeatCount", () => {
    const testArray = [11, 12, 13, 14, 15];
    
    // A zero repeat count should empty the array
    Utils.arrayRepeat(testArray, 0);
    
    expect(testArray.length).toBe(0);
});

test("arrayRepeat invalid repeatCount", () => {
    const testArray = [16, 17, 18, 19, 20];
    const repeatArray = testArray.slice();

    const invalidRepeats = [-1, Number.MIN_SAFE_INTEGER, 0.1, Infinity, -Infinity, NaN];

    // Any invalid repeat count should throw
    for (const invalidRepeat of invalidRepeats) {
        expect(() => {
            Utils.arrayRepeat(repeatArray, invalidRepeat);
        }).toThrow(Error);
    }

    // The array should not have been modified
    expect(testArray.length).toBe(repeatArray.length);

    for (let i = 0; i < testArray.length; i++) {
        expect(testArray[i]).toBe(repeatArray[i]);
    }
});