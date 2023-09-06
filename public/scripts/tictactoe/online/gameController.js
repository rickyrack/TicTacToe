import { badRoom } from "../play_controls/lobby_controls.js";
import { runGame } from "./main.js";
import { clearUpdateMsg, waitForTurn } from "./updateMessage.js";
import { socket } from "./main.js";

// this file handles functions that have multiple effects

// Room controller
export const joinRoom = (roomId, action) => {
    socket.emit('joinRoom', { roomId: roomId, action: action });
}

socket.on('badRoom', (reason) => {
    badRoom(reason);
});

// init game data from joining client
/*socket.on('startGame', (roomData) => {
    console.log(roomData.board)
    runGame(roomData.board, roomData.roomId);
});*/

// notify player it is not their turn and run the game again
socket.on('wrongTurn', (roomData) => {
    waitForTurn();
    //runGame(roomData.board, roomData.roomId);
});

socket.on('runGame', (roomData) => {
    clearUpdateMsg();
    runGame(roomData.board, roomData.roomId);

});

// end game
socket.on('winGame', () => {
    console.log('winner!')
});

socket.on('loseGame', () => {
    console.log('loser!')
});

socket.on('tieGame', () => {
    console.log('tie!')
});