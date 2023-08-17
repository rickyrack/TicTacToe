window.addEventListener('load', () => {
    const canvas = document.getElementById('play-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 400;
    canvas.height = 400;

    class Game {
        constructor(width, height) {
            this.width = width;
            this.height = height;
        }
    }
})