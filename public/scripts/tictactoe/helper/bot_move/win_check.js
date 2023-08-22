export const winCheck = (gameBoard, piece) => {
    const board = [...gameBoard];

    if(check()) {
      return true;
    }
    else return false;

    // returns true or false if the piece CAN win
    function check() {
      let isWin = false;
      const winningConditions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    winningConditions.forEach(cond => {
      for (let i = 0; i < cond.length; i++) {
        if (board[cond[i]] === 'x' || board[cond[i]] === 'o') cond[i] = board[cond[i]];
      }

      const checkCond = [...cond];
      for (let i = 0; i < cond.length; i++) {
        if (checkCond[i] !== 'x' && checkCond[i] !== 'o') {
          checkCond[i] = piece;
          break;
        }
      }

      if (checkCond[0] === checkCond[1] && checkCond[1] === checkCond[2]) {
        isWin = true;
      }
    })

    if (isWin) return true;

  }
}