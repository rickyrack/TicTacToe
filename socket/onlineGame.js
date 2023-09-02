const colors = require('colors');
const socket = require('socket.io');

const newBoard = [];
const boardSize = 3;

// init empty board
for (let i = 0; i < boardSize; i++) {
  newBoard.push(["", "", ""]);
}

const matchData = new Map();

const gameSocket = (server) => {
  const io = socket(server);
  console.log('Web Socket Opened'.magenta);

  io.on('connection', (socket) => {
    console.log('user connected')

    socket.on("joinRoom", roomData => {
        if(roomData.action === 'join') {
            if(!io.sockets.adapter.rooms.has(roomData.roomId) || roomData.roomId.length > 6) {
                socket.emit('badRoom', 'bad id');
                return;
            }
            else if(io.sockets.adapter.rooms.get(roomData.roomId).size >= 2) {
              socket.emit('badRoom', 'room full');
              return;
          }
        }
        socket.join(roomData.roomId);
        const room = io.sockets.adapter.rooms.get(roomData.roomId);
        if (room.size === 2) {
          // init game data from joining client
          matchData.set(roomData.roomId, { board: [...newBoard], currPlayer: [...room][0] });
          io.to(roomData.roomId).emit("startGame", matchData.get(roomData.roomId));
        }
    });

    //socket.on("runGame")

    socket.on('disconnect', () => {
      console.log('user disconnected');
    })
  })
}

module.exports = gameSocket;