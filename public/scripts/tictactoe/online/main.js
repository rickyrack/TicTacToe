import { socket } from "./gameController.js";
import { clearUpdateMsg } from "./updateMessage.js";

export const runGame = (board, roomId, isGameActive) => {
  const oldCanvasDiv = document.getElementById("play-canvas");
  const canvas = oldCanvasDiv.cloneNode(true);
  oldCanvasDiv.parentNode.replaceChild(canvas, oldCanvasDiv);

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

  if (isGameActive)
    canvas.addEventListener("click", (e) => handleClick(e, board, roomId));

  const game = () => {
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

  game();
};

export function handleClick(e, board, roomId) {
  const tileSize = 100;
  const col = Math.floor(e.offsetX / tileSize);
  const row = Math.floor(e.offsetY / tileSize);

  // prevents error when clicking edge of board
  let tileClicked = null;
  if (col !== 3 && col !== -1 && row !== 3 && row !== -1)
    tileClicked = board[row][col];

  if (tileClicked === "") {
    clearUpdateMsg();
    socket.emit("placePiece", { row, col, roomId });
  }
}
