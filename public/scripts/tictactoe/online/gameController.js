import { badRoom } from "../play_controls/lobby_controls.js";
import { runGame } from "./main.js";
import { waitForTurn } from "./updateMessage.js";
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
    //game(roomData.board, roomData.roomId);
})

socket.on('runGame', (roomData) => {
    runGame(roomData.board, roomData.roomId);
})