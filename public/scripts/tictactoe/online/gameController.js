const socket = io();
import { noRoomExists } from "../play_controls/lobby_controls.js";

// Room stuff
export const joinRoom = (roomId, action) => {
    socket.emit('joinRoom', { roomId: roomId, action: action });
}

socket.on('noRoomExists', (reason) => {
    noRoomExists(reason)
});

// Game stuff
export const placePiece = (piece, tile) => {

}