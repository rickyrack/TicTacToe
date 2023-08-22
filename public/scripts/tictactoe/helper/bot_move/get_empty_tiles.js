export const getEmptyTiles = (boardState) => {
    return boardState.filter(i => i !== 'x' && i !== 'o');
}