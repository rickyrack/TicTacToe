import { gameOver } from "./game_over.js";
import { getBotMove } from "./helper/bot_move/get_bot_move.js";
import { mainCheck } from "./helper/main_check.js";
import { getDiff } from "./play_controls/computer_diff.js";

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
  let col = null;
  let row = null;

  const board = [];

  // is game being played or did game end, used for game visual improvements
  let gameActive = true;

  // bot vars
  const botDiff = getDiff();

  let botDelay = false;
  let firstTurn = true;

  const pieceDrawOrder = [];

  // init empty board
  for (let i = 0; i < boardSize; i++) {
    board.push(["", "", ""]);
  }

  canvas.addEventListener("click", handleClick);

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

    // bot move
    let noMoveCounter = 0;
    if (!firstTurn) {
      //if(board !== realBoard) board = realBoard;
      botTurn();
    }
    firstTurn = false;
    function botTurn() {
      const botMoveData = getBotMove(board, botDiff);
      // player win check
      if (botMoveData.score === -1 || botMoveData.score === 0) {
        return;
      }
      board[botMoveData.row][botMoveData.col] = 'o';
      pieceDrawOrder.push({ row: botMoveData.row, col: botMoveData.col});
      nextPiece = 'x';
      // randomly select tile to place bot piece
      /*const botRow = Math.floor(Math.random() * 3);
      const botCol = Math.floor(Math.random() * 3);

      if (board[botRow][botCol] === "") {
        board[botRow][botCol] = "o";
        pieceDrawOrder.push({ row: botRow, col: botCol });
        nextPiece = "x";
        // for testing -> getBotMove(board);
      } else {
        if (noMoveCounter === 1000) return;
        noMoveCounter++;
        botTurn();
      }*/
    }

    let p1Win = false;
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