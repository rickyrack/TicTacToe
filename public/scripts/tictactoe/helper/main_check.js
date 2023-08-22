export const mainCheck = (board) => {
    let boardSize = board.length;

    let p1Check = 0;
    let p2Check = 0;

    let p1Win = false;
    let p2Win = false;

    for (let i = 0; i < boardSize; i++) {
      for (let j = 0; j < boardSize; j++) {
        // row win check
        if (board[i][j] === "x") p1Check++;
        if (board[i][j] === "o") p2Check++;
      }

      if (p1Check === 3) p1Win = true;
      if (p2Check === 3) p2Win = true;
      //if (p1Win || p2Win) break;
      p1Check = 0;
      p2Check = 0;

      for (let j = 0; j < boardSize; j++) {
        // column win check
        if (board[j][i] === "x") p1Check++;
        if (board[j][i] === "o") p2Check++;
      }

      if (p1Check === 3) p1Win = true;
      if (p2Check === 3) p2Win = true;
      //if (p1Win || p2Win) break;
      p1Check = 0;
      p2Check = 0;

      for (let i = 0; i < boardSize; i++) {
        // diagnol left to right win check
        if (board[i][i] === "x") p1Check++;
        if (board[i][i] === "o") p2Check++;
      }

      if (p1Check === 3) p1Win = true;
      if (p2Check === 3) p2Win = true;
      //if (p1Win || p2Win) break;
      p1Check = 0;
      p2Check = 0;

      // diagnol right to left win check
      if (board[0][2] === "x") p1Check++;
      if (board[1][1] === "x") p1Check++;
      if (board[2][0] === "x") p1Check++;
      if (board[0][2] === "o") p2Check++;
      if (board[1][1] === "o") p2Check++;
      if (board[2][0] === "o") p2Check++;

      if (p1Check === 3) p1Win = true;
      if (p2Check === 3) p2Win = true;
      //if (p1Win || p2Win) break;
      p1Check = 0;
      p2Check = 0;
    }

    if (p1Win && p2Win) return 'p1Win';
    return p1Win ? 'p1Win' : p2Win ? 'p2Win' : false;
}