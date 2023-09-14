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
};

const matchData = new Map();
const p1UsernameData = new Map();
const rematchReadyRooms = new Map();
let inGame = [];

// prevents rejoining rooms that were left
const invalidRooms = [];

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

    socket.on("joinRoom", (roomData, username) => {
      const validId = /^[a-zA-Z0-9]{6}$/;
      if (roomData.action === "join") {
        if (
          !io.sockets.adapter.rooms.has(roomData.roomId) ||
          !validId.test(roomData.roomId) ||
          invalidRooms.includes(roomData.roomId)
        ) {
          socket.emit("badRoom", "bad id");
          return;
        } else if (io.sockets.adapter.rooms.get(roomData.roomId).size >= 2) {
          socket.emit("badRoom", "room full");
          return;
          // if room is valid then the room will no longer be valid for duration of server being up
        } else invalidRooms.push(roomData.roomId);
      }
      // extra check to make sure a valid id was sent on create as well
      if (!validId.test(roomData.roomId)) {
        console.log("Invalid Id");
        return;
      }
      socket.join(roomData.roomId);
      if (roomData.action === "create") p1UsernameData.set(roomData.roomId, username);
      const room = io.sockets.adapter.rooms.get(roomData.roomId);
      if (room.size === 2) {
        // init game data from joining client
        matchData.set(roomData.roomId, {
          board: createNewBoard(),
          p1: [...room][0],
          p2: [...room][1],
          p1Name: p1UsernameData.get(roomData.roomId),
          p2Name: username,
          currPlayer: "p1",
          roomId: roomData.roomId,
        });
        if (roomData.action === "join") p1UsernameData.clear(roomData.roomId);
        inGame.push(matchData.get(roomData.roomId).p1);
        inGame.push(matchData.get(roomData.roomId).p2);
        io.to(roomData.roomId).emit(
          "runGame",
          matchData.get(roomData.roomId),
          true
        );
        io.to(matchData.get(roomData.roomId).p1).emit(
          "notifyGame",
          `Opponent: ${matchData.get(roomData.roomId).p2Name} (O)`
        );
        io.to(matchData.get(roomData.roomId).p2).emit(
          "notifyGame",
          `Opponent: ${matchData.get(roomData.roomId).p1Name} (X)`
        );
      }
    });

    socket.on('rematch', () => {
      let roomData = null;
      rematchReadyRooms.forEach((value, key) => {
        if (socket.id === value.p1 || socket.id === value.p2) roomData = rematchReadyRooms.get(key);
      });

      if (rematchReadyRooms.get(roomData.roomId).waiting) {
        rematchReadyRooms.delete(roomData.roomId);
        matchData.set(roomData.roomId, {
          board: createNewBoard(),
          p1: roomData.p1,
          p2: roomData.p2,
          p1Name: roomData.p1Name,
          p2Name: roomData.p2Name,
          currPlayer: "p1",
          roomId: roomData.roomId,
        });
        io.to(roomData.roomId).emit("setupRematch");
        io.to(matchData.get(roomData.roomId).p1).emit(
          "notifyGame",
          `Opponent: ${matchData.get(roomData.roomId).p2Name} (O)`
        );
        io.to(matchData.get(roomData.roomId).p2).emit(
          "notifyGame",
          `Opponent: ${matchData.get(roomData.roomId).p1Name} (X)`
        );
        inGame.push(matchData.get(roomData.roomId).p1);
        inGame.push(matchData.get(roomData.roomId).p2);
        io.to(roomData.roomId).emit(
          "runGame",
          matchData.get(roomData.roomId),
          true
        );
      }
      roomData.waiting = socket.id;
      rematchReadyRooms.set(roomData.roomId, roomData);
    });

    const checkPlayerTurn = (roomId) => {
      let currPlayer;
      try {
        currPlayer = matchData.get(roomId)[matchData.get(roomId).currPlayer];
      } catch (err) {
        console.log(`Error: ${err.message}`);
        return;
      }
      if (currPlayer === socket.id) {
        return true;
      }
      return false;
    };

    const endGame = (roomData, winner, userQuit) => {
      // removes players from active players array
      inGame = inGame.filter(id => id !== roomData.p1 && id !== roomData.p2);

      if (winner === "tie") {
        if (socket.id === roomData.p1) rematchReadyRooms.set(roomData.roomId, { p1: roomData.p2, p2: roomData.p1, waiting: null, roomId: roomData.roomId, p1Name: roomData.p2Name, p2Name: roomData.p1Name });
        io.to(roomData.roomId).emit("tieGame", roomData);
        return;
      }

      const winnerId = roomData[winner];
      const loserId = roomData[winner === "p1" ? "p2" : "p1"];

      if (!userQuit) {
        let p1Name;
        let p2Name;
        if (winner === 'p1') {
          p1Name = roomData.p2Name;
          p2Name = roomData.p1Name;
        }
        else {
          p1Name = roomData.p1Name;
          p2Name = roomData.p2Name;
        }
        rematchReadyRooms.set(roomData.roomId, { p1: loserId, p2: winnerId, waiting: null, roomId: roomData.roomId, p1Name: p1Name, p2Name: p2Name });
      }

      io.to(winnerId).emit("winGame", roomData, userQuit);
      io.to(loserId).emit("loseGame", roomData);
    };

    socket.on("placePiece", (turnData) => {
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

      if (roomData.currPlayer === "p1") roomData.currPlayer = "p2";
      else roomData.currPlayer = "p1";
      matchData.set(roomId, roomData);

      const winner = checkWin(matchData.get(roomId).board);
      let isGameActive = true;
      if (winner) isGameActive = false;

      io.to(roomId).emit("runGame", matchData.get(roomId), isGameActive);

      // draw board, then check win after the last client to place a piece
      if (winner) {
        endGame(matchData.get(roomId), winner, false);
        matchData.delete(roomId);
      }
    });

    const leaveMatch = (socket) => {
      matchData.forEach((room) => {
        // skips active rooms
        if (io.sockets.adapter.rooms.get(room.roomId) < 2) return;

        if (room.p1 === socket.id) {
          console.log(
            `p2: [${room.p2}] wins game: [${room.roomId}] by forfeit.`
          );

          // final draw board and remove click listener
          io.to(room.roomId).emit("runGame", matchData.get(room.roomId), false);
          // display disconnect and run endGame func
          io.to(room.p2).emit("userDisconnected", room.p1Name);
          endGame(matchData.get(room.roomId), "p2", true);
          matchData.delete(room.roomId);
        } else if (room.p2 === socket.id) {
          console.log(
            `p1: [${room.p1}] wins game: [${room.roomId}] by forfeit.`
          );

          // final draw board and remove click listener
          io.to(room.roomId).emit("runGame", matchData.get(room.roomId), false);
          // display disconnect and run endGame func
          io.to(room.p1).emit("userDisconnected", room.p2Name);
          endGame(matchData.get(room.roomId), "p1", true);
          matchData.delete(room.roomId);
        }
      });
    };

    socket.on("quitGame", () => {
      socket.disconnect(true);
    });

    socket.on("disconnect", () => {
      console.log("user disconnected");
      if (inGame.includes(socket.id)) leaveMatch(socket);
    });
  });
};

module.exports = gameSocket;
