import { gameOver } from "./game_over.js";
import { getBotMove } from "./helper/get_bot_move.js";

window.addEventListener("load", () => {
  newGame();
});

export const newGame = () => {
  const canvas = document.getElementById("play-canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = 300;
  canvas.height = 300;

  const piece_o = new Image();
  piece_o.src = "/images/piece_o.png";

  const piece_x = new Image();
  piece_x.src = "/images/piece_x.png";

  const tileSize = 100;
  const boardSize = 3;

  let nextPiece = "x";
  let col = undefined;
  let row = undefined;

  const board = [];

  // is game being played or did game end, used for game visual improvements
  let gameActive = true;

  // bot vars
  const diffSwitch = document.querySelector(".play-bot-diff");
  const botDefault = "Medium";
  let botDiff = botDefault;
  if (
    diffSwitch.textContent === "Easy" ||
    diffSwitch.textContent === "Medium" ||
    diffSwitch.textContent === "Hard"
  ) {
    botDiff = diffSwitch.textContent;
  }

  let botDelay = false;
  let firstTurn = true;

  const pieceDrawOrder = [];

  // init empty board
  for (let i = 0; i < boardSize; i++) {
    board.push(["", "", ""]);
  }

  canvas.addEventListener("click", handleClick);

  const game = () => {
    getBotMove(board);
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

    // bot move
    let noMoveCounter = 0;
    if (!firstTurn) {
      botTurn();
    }
    firstTurn = false;
    function botTurn() {
      const botRow = Math.floor(Math.random() * 3);
      const botCol = Math.floor(Math.random() * 3);

      if (board[botRow][botCol] === "") {
        board[botRow][botCol] = "o";
        pieceDrawOrder.push({ row: botRow, col: botCol });
        nextPiece = "x";
      } else {
        if (noMoveCounter === 1000) return;
        noMoveCounter++;
        botTurn();
      }
    }

    /*for (let boardRow = 0; boardRow < boardSize; boardRow++) {
            for (let boardCol = 0; boardCol < boardSize; boardCol++) {
                if(board[boardRow][boardCol] === 'x') {
                    ctx.drawImage(piece_x, boardCol * tileSize, boardRow * tileSize, tileSize, tileSize);
                }
                else if(board[boardRow][boardCol] === 'o') {
                    ctx.drawImage(piece_o, boardCol * tileSize, boardRow * tileSize, tileSize, tileSize);
                }
            }
        }*/

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
      if (p1Win || p2Win) break;
      p1Check = 0;
      p2Check = 0;

      for (let j = 0; j < boardSize; j++) {
        // column win check
        if (board[j][i] === "x") p1Check++;
        if (board[j][i] === "o") p2Check++;
      }

      if (p1Check === 3) p1Win = true;
      if (p2Check === 3) p2Win = true;
      if (p1Win || p2Win) break;
      p1Check = 0;
      p2Check = 0;

      for (let i = 0; i < boardSize; i++) {
        // diagnol left to right win check
        if (board[i][i] === "x") p1Check++;
        if (board[i][i] === "o") p2Check++;
      }

      if (p1Check === 3) p1Win = true;
      if (p2Check === 3) p2Win = true;
      if (p1Win || p2Win) break;
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
      if (p1Win || p2Win) break;
      p1Check = 0;
      p2Check = 0;
    }
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
    } else tieGame = false;

    // draw pieces
    for (let i = 0; i < pieceDrawOrder.length; i++) {
      if (
        i === pieceDrawOrder.length - 1 &&
        nextPiece !== "o" &&
        !gameActive &&
        (p1Win || (tieGame && nextPiece === "x"))
      )
        break;
      /*if (!gameActive && i === pieceDrawOrder.length - 1 && !p2Win) {
        if (p1Win) break;
        else break;
      }*/
      const tile = pieceDrawOrder[i];
      const drawPiece = () => {
        if (board[tile.row][tile.col] === "x") {
          ctx.drawImage(
            piece_x,
            tile.col * tileSize,
            tile.row * tileSize,
            tileSize,
            tileSize
          );
        } else if (board[tile.row][tile.col] === "o") {
          ctx.drawImage(
            piece_o,
            tile.col * tileSize,
            tile.row * tileSize,
            tileSize,
            tileSize
          );
        }
      };
      if (p1Win || p2Win) drawPiece();
      else if (
        pieceDrawOrder.length - 1 === i &&
        board[tile.row][tile.col] === "o"
      ) {
        setTimeout(() => {
          drawPiece();
          botDelay = false;
        }, 250);
      } else {
        drawPiece();
      }
    }
  };

  function handleClick(e) {
    if (botDelay === true) {
      return;
    }
    col = Math.floor(e.offsetX / tileSize);
    row = Math.floor(e.offsetY / tileSize);

    const tileClicked = board[row][col];
    if (tileClicked === "") {
      if (nextPiece === "x") {
        botDelay = true;
        board[row][col] = "x";
        nextPiece = "o";
        pieceDrawOrder.push({ row: row, col: col });
      }
      /*else if(nextPiece === 'o') {
                board[row][col] = 'o'
                nextPiece = 'x';
            }*/
      if (gameActive) game();
    }
  }
  if (!gameActive) return;
  else game();
};
