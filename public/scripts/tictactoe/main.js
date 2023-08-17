window.addEventListener('load', () => {
    const canvas = document.getElementById('play-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 300;
    canvas.height = 300;

    const piece_o = new Image();
    piece_o.src = '/images/piece_o.png';

    const piece_x = new Image();
    piece_x.src = '/images/piece_x.png';

    const tileSize = 100;
    const boardSize = 3;

    let nextPiece = 'x';
    let col = undefined;
    let row = undefined;

    const board = [];
    for (let i = 0; i < boardSize; i++) {
        board.push(['', '', '']);
    }
    
    canvas.addEventListener('click', handleClick);

    const game = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        for (let i = 1; i < boardSize; i++) {
            ctx.beginPath();
            ctx.moveTo(i * tileSize, 0);
            ctx.lineTo(i * tileSize, canvas.height);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(0, i * tileSize);
            ctx.lineTo(canvas.width, i * tileSize);
            ctx.stroke();
        }

        for (let boardRow = 0; boardRow < boardSize; boardRow++) {
            for (let boardCol = 0; boardCol < boardSize; boardCol++) {
                if(board[boardRow][boardCol] === 'x') {
                    ctx.drawImage(piece_x, boardCol * tileSize, boardRow * tileSize, tileSize, tileSize);
                }
                else if(board[boardRow][boardCol] === 'o') {
                    ctx.drawImage(piece_o, boardCol * tileSize, boardRow * tileSize, tileSize, tileSize);
                }
            }
            
        }
    }

    function handleClick(e) {
        col = Math.floor(e.offsetX / tileSize);
        row = Math.floor(e.offsetY / tileSize);

        const tileClicked = board[row][col];
        if (tileClicked === '') {
            if(nextPiece === 'x') {
                board[row][col] = 'x'
                nextPiece = 'o';
            }
            else if(nextPiece === 'o') {
                board[row][col] = 'o'
                nextPiece = 'x';
            }
            game();
        }
    }

    game();
})