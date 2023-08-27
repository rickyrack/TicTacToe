import { convertBotMove } from "./convert_bot_move.js";
import { getFinalTestData, minimax } from "./minimax.js";

// gets the bots next move using the minimax algorithm
export const getBotMove = (gameBoard, botDiff) => {
    // copy of the board
    const boardCopy = [...gameBoard];
    // new single array board
    const board = [];

    let tileCounter = 0;
    for (let r = 0; r < boardCopy.length; r++) {
        for (let c = 0; c < boardCopy.length; c++) {
            if(boardCopy[r][c] === 'x' || boardCopy[r][c] === 'o') {
                board.push(boardCopy[r][c]);
            }
            else {
                board.push(tileCounter);
            }
            tileCounter++;
        }
    }

    console.log(botDiff)
    if(botDiff === "Easy") {
        const botMoveData = minimax(board, 'x');
        const finalTestPlayData = getFinalTestData();
        if (botMoveData?.tile === undefined) return botMoveData;
        return convertBotMove(finalTestPlayData[Math.floor(Math.random() * finalTestPlayData.length)]);
    }
    else if(botDiff === "Medium") {
        // this code is the same as hard diff for right now
        const botMoveData = minimax(board, 'o');
        const finalTestPlayData = getFinalTestData();
        console.log(finalTestPlayData);
        if (botMoveData?.tile === undefined) return botMoveData;
        let testPlay = undefined;
        finalTestPlayData.forEach(test => {
            if (test.score === 0) {
                testPlay = test;
                return;
            }
        });
        if (!testPlay) testPlay = finalTestPlayData.find(test => test.score === -1);
        console.log(testPlay)
        return convertBotMove(testPlay);
    }
    else {
        const botMoveData = minimax(board, 'o');
        if (botMoveData?.tile === undefined) return botMoveData;
        return convertBotMove(botMoveData);
    }

}