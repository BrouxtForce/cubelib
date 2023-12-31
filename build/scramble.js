export var Scramble;
(function (Scramble) {
    function getNumberOfRandomMoves(puzzleSize) {
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
    function getRandomInt(minInclusive, maxExclusive) {
        return minInclusive + Math.floor(Math.random() * (maxExclusive - minInclusive));
    }
    function randomMove(puzzleSize, moveCount) {
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
        const scramble = [];
        scrambleGenLoop: for (let i = 0; i < moveCount; i++) {
            const index0 = getRandomInt(0, 3);
            const index1 = getRandomInt(0, 2);
            const width = getRandomInt(1, widestMove + (evenCube ? index1 : 1));
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
        const scrambleStrings = scramble.map(entry => {
            let moveString = possibleMoves[entry.index0][entry.index1];
            if (entry.width > 1) {
                if (entry.width === 2) {
                    moveString += "w";
                }
                else {
                    moveString = `${entry.width}${moveString}w`;
                }
            }
            const possibleModifiers = ["", "'", "2"];
            moveString += possibleModifiers[getRandomInt(0, 3)];
            return moveString;
        });
        return scrambleStrings.join(" ");
    }
    Scramble.randomMove = randomMove;
})(Scramble || (Scramble = {}));
