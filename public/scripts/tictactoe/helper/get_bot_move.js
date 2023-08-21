export const getBotMove = (gameBoard) => {
    // minimax algorithm
    const board = [];
    let tileCounter = 0;
    for (let r = 0; r < gameBoard.length; r++) {
        for (let c = 0; c < gameBoard.length; c++) {
            if(gameBoard[r][c] === 'x' || gameBoard[r][c] === 'o') {
                board.push(gameBoard[r][c]);
            }
            else {
                board.push(tileCounter);
            }
            tileCounter++;
        }
    }
    const getEmptyTiles = (boardState) => {
        return boardState.filter(i => i !== 'x' && i !== 'o');
    }
    console.log(getEmptyTiles(board))
}