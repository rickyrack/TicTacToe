import { rematchRoom } from "./gameController.js";

const rematchDiv = document.querySelector(".play-rematch-div");
const rematchButton = document.querySelector(".play-rematch");
const rematchWaitText = document.querySelector(".play-rematch-wait");

rematchButton.addEventListener("click", rematch);

const endGameDiv = document.querySelector(".play-gameOver");

export const showRematch = () => {
  rematchDiv.style.display = "flex";
};

function rematch() {
  rematchWaitText.style.display = "block";
  rematchWaitText.textContent = "Waiting";
  rematchWaitText.classList.add("lobby-loading");

  rematchRoom();
}

export const handleRematch = () => {
  // removes the handleClick listener by recreating the canvas node
  const oldCanvasDiv = document.getElementById("play-canvas");
  const canvasDiv = oldCanvasDiv.cloneNode(true);
  oldCanvasDiv.parentNode.replaceChild(canvasDiv, oldCanvasDiv);

  canvasDiv.classList.remove("canvas-blur-animation");
  endGameDiv.classList.remove("game-over-fade-in");
  endGameDiv.innerHTML = "";

  canvasDiv.style.visibility = "visible";
};

export const clearRematch = () => {
    rematchDiv.style.display = "none";
    rematchWaitText.textContent = "";
    rematchWaitText.classList.remove("lobby-loading");
}
