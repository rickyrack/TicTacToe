require('dotenv').config();
const port = process.env.SOCKETPORT;
const io = require('socket.io')(port);
const colors = require('colors');

const connectSocket = () => {
    io.on('connection', socket => {
        console.log(socket.id);
      })
      console.log(`Web Socket started on port ${port}`.magenta);
}

module.exports = connectSocket;