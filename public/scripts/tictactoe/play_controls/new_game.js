import { newGame } from "/scripts/tictactoe/main.js";

const endGameDiv = document.querySelector(".play-gameOver");

const newGameButton = document.querySelector(".play-new-game");
newGameButton.addEventListener('click', handleNewGame);


export function handleNewGame() {
  // removes the handleClick listener by recreating the canvas node
  const oldCanvasDiv = document.getElementById("play-canvas");
  const canvasDiv = oldCanvasDiv.cloneNode(true);
  oldCanvasDiv.parentNode.replaceChild(canvasDiv, oldCanvasDiv);

  canvasDiv.classList.remove('canvas-blur-animation');
  endGameDiv.classList.remove('game-over-fade-in');
  endGameDiv.innerHTML = "";
  newGame();
}