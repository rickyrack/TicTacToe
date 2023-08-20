import { newGame } from "/scripts/tictactoe/main.js";

const endGameDiv = document.querySelector(".play-gameOver");
const canvasDiv = document.getElementById("play-canvas");

const newGameButton = document.querySelector(".play-new-game");
newGameButton.addEventListener('click', handleNewGame);

function handleNewGame() {
  canvasDiv.classList.remove('canvas-blur-animation');
  endGameDiv.classList.remove('game-over-fade-in');
  endGameDiv.innerHTML = "";
  newGame();
}