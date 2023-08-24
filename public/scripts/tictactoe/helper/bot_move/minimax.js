import { getEmptyTiles } from "./get_empty_tiles.js";
import { winCheck } from "./win_check.js";

const playerPiece = 'x';
const botPiece = 'o';

export const minimax = (currBoard, piece) => {
    const openTiles = getEmptyTiles(currBoard);

    if (winCheck(currBoard, playerPiece)) return {score: -1};
    else if (winCheck(currBoard, botPiece)) return {score: 1};
    else if (openTiles.length === 0) return {score: 0};

    const testPlayData = [];

    for (let i = 0; i < openTiles.length; i++) {
        const currTestPlayData = {};
        currTestPlayData.tile = currBoard[openTiles[i]];
        currBoard[openTiles[i]] = piece;

        if (piece === botPiece) {
            const result = minimax(currBoard, playerPiece);
            currTestPlayData.score = result.score;
        }
        else {
            const result = minimax(currBoard, botPiece);
            currTestPlayData.score = result.score;
        }

        currBoard[openTiles[i]] = currTestPlayData.tile;
        testPlayData.push(currTestPlayData);
    }

    let bestTestPlay = null;

    if (piece === botPiece) {
        let bestScore = -Infinity;
        for (let i = 0; i < testPlayData.length; i++) {
            if (testPlayData[i].score > bestScore) {
                bestScore = testPlayData[i].score;
                bestTestPlay = i;
            }
        }
    }
    else {
        let bestScore = Infinity;
        for (let i = 0; i < testPlayData.length; i++) {
            if (testPlayData[i].score < bestScore) {
                bestScore = testPlayData[i].score;
                bestTestPlay = i;
            }
        }
    }

    return testPlayData[bestTestPlay];
}