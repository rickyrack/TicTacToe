export const gameOver = (winner) => {
  const endGameDiv = document.querySelector(".play-gameOver");
  const canvas = document.getElementById("play-canvas");

  canvas.classList.add('canvas-blur-animation');
  endGameDiv.classList.add('game-over-fade-in');

  endGameDiv.innerHTML = `<p>${
    winner === "p1" ? "X Wins!" : winner === "p2" ? "O Wins!" : "Tie!"
  }</p>`;
};