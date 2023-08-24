// converts the bot move back from single array format to 2d array
export const convertBotMove = (moveData) => {
    let tileCounter = 0;
    const boardSize = 3;
    for (let r = 0; r < boardSize; r++) {
        for (let c = 0; c < boardSize; c++) {
            if (tileCounter === moveData.tile) {
                return {row: r, col: c};
            }
            tileCounter++;
        }
    }
}