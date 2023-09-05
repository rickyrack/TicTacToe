const colors = require("colors");
const socket = require("socket.io");

const newBoard = [];
const boardSize = 3;

// init empty board
for (let i = 0; i < boardSize; i++) {
  newBoard.push(["", "", ""]);
}

const matchData = new Map();

const getPiece = (player) => {
  if (player === "p1") {
    return "x";
  } else if (player === "p2") {
    return "o";
  }
};

const endGame = () => {

}

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
          board: [...newBoard],
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
    });

    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });
};

module.exports = gameSocket;
