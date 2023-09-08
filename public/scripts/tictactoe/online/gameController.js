import {
  badRoom,
  clearNotify,
  notifyPlayer,
  showLobby,
  userDisconnected,
} from "../play_controls/lobby_controls.js";
import { runGame } from "./main.js";
import { clearUpdateMsg, waitForTurn } from "./updateMessage.js";
import { clearRematch, handleRematch, showRematch } from "./rematch.js";
import { gameOver } from "./gameOver.js";

export let socket = null;

// handles client joining a room
export const joinRoom = (roomId, action, username) => {
    initSocket(true);
    socket.emit("joinRoom", { roomId: roomId, action: action }, username);
  };

export const rematchRoom = () => {
  socket.emit("rematch");
}

// this function prevents socket init on page load
function initSocket(newClient) {
  if (!socket || newClient) {
    socket = io();

    // this file handles functions that have multiple effects

    // Room controller
    socket.on("badRoom", (reason) => {
      badRoom(reason);
    });

    // notify player it is not their turn and run the game again
    socket.on("wrongTurn", () => {
      waitForTurn();
    });

    // remove rematch button
    socket.on("setupRematch", () => {
      handleRematch();
      clearRematch();
    })

    socket.on("runGame", (roomData, isGameActive) => {
      clearUpdateMsg();
      showLobby(roomData.roomId);
      runGame(roomData.board, roomData.roomId, isGameActive);
    });

    socket.on("notifyGame", (msg) => {
      notifyPlayer(msg);
    });

    socket.on("userDisconnected", (playerName) => {
      userDisconnected(playerName);
    });

    // end game
    socket.on("winGame", async (roomData, userQuit) => {
      if (!userQuit) showRematch();
      roomData.tie = false;
      try {
        const res = await axios.post(`/play/${roomData.roomId}`, roomData);
      } catch (err) {
        console.error("Error:", err.message);
      }
      clearNotify();
      gameOver("win");
    });

    socket.on("loseGame", async (roomData) => {
      showRematch();
      clearNotify();
      gameOver("loss");
    });

    socket.on("tieGame", async (roomData) => {
      clearNotify();
      showRematch();
      roomData.tie = true;
      try {
        if (socket.id === roomData.p1) {
          const res = await axios.post(`/play/${roomData.roomId}`, roomData);
        }
      } catch (err) {
        console.error("Error:", err.message);
      }
      gameOver("tie");
    });
  }
};