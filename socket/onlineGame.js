const colors = require("colors");
const socket = require("socket.io");
const checkWin = require("./winCheck");

const boardSize = 3;

// init empty board
const createNewBoard = () => {
  const newBoard = [];
  for (let i = 0; i < boardSize; i++) {
    newBoard.push(["", "", ""]);
  }
  return newBoard;
}

const matchData = new Map();

const getPiece = (player) => {
  if (player === "p1") {
    return "x";
  } else if (player === "p2") {
    return "o";
  }
};

const gameSocket = (server) => {
  const io = socket(server);
  console.log("Web Socket Opened".magenta);

  io.on("connection", (socket) => {
    console.log("user connected");

    socket.on("joinRoom", (roomData) => {
      console.log('joinRoom')
      const validId = /^[a-zA-Z0-9]{6}$/;
      if (roomData.action === "join") {
        if (
          !io.sockets.adapter.rooms.has(roomData.roomId) ||
          !validId.test(roomData.roomId)
        ) {
          socket.emit("badRoom", "bad id");
          return;
        } else if (io.sockets.adapter.rooms.get(roomData.roomId).size >= 2) {
          socket.emit("badRoom", "room full");
          return;
        }
      }
      if (!validId.test(roomData.roomId)) {
        console.log('Invalid Id');
        return;
      }
      socket.join(roomData.roomId);
      const room = io.sockets.adapter.rooms.get(roomData.roomId);
      if (room.size === 2) {
        // init game data from joining client
        matchData.set(roomData.roomId, {
          board: createNewBoard(),
          p1: [...room][0],
          p2: [...room][1],
          currPlayer: 'p1',
          roomId: roomData.roomId,
        });
        io.to(roomData.roomId).emit(
          "runGame",
          matchData.get(roomData.roomId)
        );
        console.log(matchData)
      }
    });

    const checkPlayerTurn = (roomId) => {
      const currPlayer = matchData.get(roomId)[matchData.get(roomId).currPlayer];
      if (currPlayer === socket.id) {
        return true;
      }
      return false;
    }

    const endGame = (roomData, winner) => {
      if (winner === 'tie') {
        io.to(roomData.roomId).emit('tie');
        return;
      }
      const winnerId = roomData[winner];
      const loserId = roomData[winner === 'p1' ? 'p2' : 'p1'];
      io.to(roomData[winnerId]).emit('winGame');
      io.to(roomData[loserId]).emit('loseGame');
    }

    socket.on("placePiece", (turnData) => {
      console.log(socket.id)
      const { row, col, roomId } = turnData;
      const roomData = matchData.get(roomId);

      if (!checkPlayerTurn(roomId)) {
        socket.emit("wrongTurn", matchData.get(roomId));
        return;
      }

      for (let r = 0; r < boardSize; r++) {
        for (let c = 0; c < boardSize; c++) {
          if (r === row && c === col) {
            const piece = getPiece(roomData.currPlayer);
            roomData.board[r][c] = piece;
          }
        }
      }

      if (roomData.currPlayer === 'p1') roomData.currPlayer = 'p2';
      else roomData.currPlayer = 'p1';
      matchData.set(roomId, roomData);

      io.to(roomId).emit('runGame', matchData.get(roomId));

      // draw board, then check win after the last client to place a piece
      const winner = checkWin(matchData.get(roomId).board);
      if (winner) {
        endGame(matchData.get(roomId), winner);
      }
    });

    socket.on("disconnect", () => {
      console.log("user disconnected");
      matchData.forEach(room => {
        if (room.p1 === socket.id) {
          console.log(`p2: [${room.p2}] wins game: [${room.roomId}] by forfeit.`);
          matchData.delete(room.roomId);
        }
        else if (room.p2 === socket.id) {
          console.log(`p2: [${room.p2}] wins game: [${room.roomId}] by forfeit.`);
          matchData.delete(room.roomId);
        }
      })
    });
  });
};

module.exports = gameSocket;
