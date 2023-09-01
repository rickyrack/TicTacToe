const colors = require('colors');
const socket = require('socket.io');

const gameSocket = (server) => {
  const io = socket(server);
  console.log('Web Socket Opened'.magenta);

  io.on('connection', (socket) => {
    console.log('user connected')

    socket.on("joinRoom", roomData => {
        if(roomData.action === 'join') {
            if(!io.sockets.adapter.rooms.has(roomData.roomId) || roomData.roomId.length > 6) {
                if(io.sockets.adapter.rooms.get(roomData.roomId).size >= 2) {
                    socket.emit('badRoom', 'room full');
                    return;
                }
                socket.emit('badRoom', 'bad id');
                return;
            }
        }
        socket.join(roomData.roomId);
        console.log(io.sockets.adapter.rooms);
    });

    socket.on('disconnect', () => {
      console.log('user disconnected');
    })
  })
}

module.exports = gameSocket;