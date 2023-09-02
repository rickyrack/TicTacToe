import { badRoom } from "../play_controls/lobby_controls.js";
import { game } from "./main.js";

const socket = io();

// Room stuff
export const joinRoom = (roomId, action) => {
    socket.emit('joinRoom', { roomId: roomId, action: action });
}

socket.on('badRoom', (reason) => {
    badRoom(reason);
});

// Game stuff //

// init game data from joining client
socket.on('startGame', (data) => {
    console.log(data)
    game(data.board, data.currPlayer);
});

export const wrongPlayer = () => {
    socket.emit('waitForTurn');
}

export const placePiece = (piece, tile) => {

}