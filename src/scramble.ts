export namespace Scramble {
    function getNumberOfRandomMoves(puzzleSize: number): number {
        switch (puzzleSize) {
            case 2: return 15;
            case 3: return 25;
            case 4: return 40;
            case 5: return 60;
            case 6: return 80;
            case 7: return 100;
            default: return 0;
        }
    }

    function getRandomInt(minInclusive: number, maxExclusive: number): number {
        return minInclusive + Math.floor(Math.random() * (maxExclusive - minInclusive));
    }

    export function randomMove(puzzleSize: number, moveCount?: number): string {
        const widestMove = Math.floor(puzzleSize / 2);
        const evenCube = (puzzleSize % 2 === 0);

        if (moveCount === undefined) {
            moveCount = getNumberOfRandomMoves(puzzleSize);
        }

        const possibleMoves = [
            ["D", "U"],
            ["B", "F"],
            ["L", "R"]
        ];
        const scramble: { index0: number, index1: number, width: number }[] = [];

        scrambleGenLoop:
        for (let i = 0; i < moveCount; i++) {
            // Generate indices for possibleMoves
            const index0 = getRandomInt(0, 3);
            const index1 = getRandomInt(0, 2);

            // For even cubes, only allow half of all moves to turn the half the cube
            const width = getRandomInt(1, widestMove + (evenCube ? index1 : 1));

            // Check against instances such as L R L (second L is redundant)
            for (let j = i - 1; j >= 0; j--) {
                if (scramble[j].index0 === index0) {
                    if (scramble[j].index1 === index1 && scramble[j].width === width) {
                        i--;
                        continue scrambleGenLoop;
                    }
                    continue;
                }
                break;
            }

            scramble.push({ index0, index1, width });
        }

        // Convert moves to string and randomly make each turn cw, ccw, or 180 degrees
        const scrambleStrings = scramble.map(entry => {
            let moveString = possibleMoves[entry.index0][entry.index1];
            if (entry.width > 1) {
                if (entry.width === 2) {
                    moveString += "w";
                } else {
                    moveString = `${entry.width}${moveString}w`
                }
            }

            const possibleModifiers = ["", "'", "2"];
            moveString += possibleModifiers[getRandomInt(0, 3)];

            return moveString;
        });

        return scrambleStrings.join(" ");
    }
}