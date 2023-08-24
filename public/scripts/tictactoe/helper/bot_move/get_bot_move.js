import { convertBotMove } from "./convert_bot_move.js";
import { minimax } from "./minimax.js";

// gets the bots next move using the minimax algorithm
export const getBotMove = (gameBoard) => {
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

    const botMoveData = minimax(board, 'o');
    console.log(botMoveData);
    if (botMoveData?.tile === undefined) return botMoveData;
    return convertBotMove(botMoveData);
}