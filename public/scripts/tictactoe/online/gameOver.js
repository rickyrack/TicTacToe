export const gameOver = (endState) => {
    const endGameDiv = document.querySelector(".play-gameOver");
    const canvas = document.getElementById("play-canvas");
  
    canvas.classList.add('canvas-blur-animation');
    endGameDiv.classList.add('game-over-fade-in');

    endGameDiv.innerHTML = `<p>${
      endState === "win"
      ? "You Win!"
      : endState === "loss" 
      ? "You Lose!"
      : "Tie Game!"
    }</p>`;
  };