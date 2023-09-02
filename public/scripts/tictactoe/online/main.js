export const game = (board, currPlayer, clickPlayer) => {
  console.log(board)
  console.log(currPlayer)
  console.log(clickPlayer)
  if (currPlayer !== clickPlayer && clickPlayer) {
    // tell other player to wait function
  }
  
  const canvas = document.getElementById("play-canvas");
  canvas.style.visibility = "visible";
  const ctx = canvas.getContext("2d");
  canvas.width = 300;
  canvas.height = 300;

  const piece_o = new Image();
  piece_o.src = "/images/piece_o.png";

  const piece_x = new Image();
  piece_x.src = "/images/piece_x.png";

  const tileSize = 100;
  const boardSize = 3;

  let col = null;
  let row = null;

  canvas.addEventListener("click", handleClick);

  // draw board
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 1; i < boardSize; i++) {
    ctx.beginPath();
    ctx.moveTo(i * tileSize, 0);
    ctx.lineTo(i * tileSize, canvas.height);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, i * tileSize);
    ctx.lineTo(canvas.width, i * tileSize);
    ctx.stroke();
  }

  // check win on server goes here //

  /*let p1Win = false;
      let p2Win = false;
  
      if(mainCheck(board) === 'p1Win') p1Win = true;
      else if(mainCheck(board) === 'p2Win') p2Win = true;
  
      if (p1Win) {
        canvas.removeEventListener("click", handleClick);
        gameActive = false;
        gameOver("p1");
      } else if (p2Win) {
        canvas.removeEventListener("click", handleClick);
        gameActive = false;
        gameOver("p2");
      }
  
      let tieGame = true;
  
      for (let r = 0; r < boardSize; r++) {
        for (let c = 0; c < boardSize; c++) {
          if (board[r][c] === "") {
            tieGame = false;
            break;
          }
        }
      }
  
      if (tieGame && !p1Win && !p2Win) {
        canvas.removeEventListener("click", handleClick);
        gameActive = false;
        gameOver("tie");
      } else tieGame = false;*/

  // draw pieces
  for (let r = 0; r < boardSize; r++) {
    for (let c = 0; c < boardSize; c++) {
      const tile = board[r][c];
      const drawPiece = () => {
        if (tile === "x") {
          ctx.drawImage(
            piece_x,
            c * tileSize,
            r * tileSize,
            tileSize,
            tileSize
          );
        } else if (tile === "o") {
          ctx.drawImage(
            piece_o,
            c * tileSize,
            r * tileSize,
            tileSize,
            tileSize
          );
        }
      };
      drawPiece();
    }
  }
};

function handleClick(e) {
  /*col = Math.floor(e.offsetX / tileSize);
  row = Math.floor(e.offsetY / tileSize);

  const tileClicked = board[row][col];
  if (tileClicked === "") {
    game(board, player);
  }
  controlClick();*/
}
