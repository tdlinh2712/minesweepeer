import { IMineBoard, ICell, CellState, GameLevel, IGameDimension } from "./types";

export const getGameDimension = (level : GameLevel) : IGameDimension => {
    switch(level) {
        case GameLevel.BEGINNER:
            return { cols : 9, rows : 9, mines : 10};
        case GameLevel.INTERMMEDIATE:
            return { cols : 16, rows : 16, mines : 40};
        case GameLevel.EXPERT:
            return { cols : 30, rows : 16, mines : 99 };
    }
};

function getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

export const generateMineBoard = (level : GameLevel): IMineBoard => {
    // pick the mine
    // find number of neighbors

    const {rows, cols, mines } = getGameDimension(level);

    let cells: ICell[][] = [];
    for (let i = 0; i < rows; ++i) {
        let row: ICell[] = [];
        for (let j = 0; j < cols; ++j) {
            row.push({ isBomb: false, mineNeighbors: 0, state : CellState.UNOPENED, flaggedNeighbors : 0 });
        }
        cells.push(row);
    };

    let generated_mines = 0;
    while (generated_mines < mines) {
        let random_row = getRandomInt(0, rows);
        let random_col = getRandomInt(0, cols);
        if (!cells[random_row][random_col].isBomb) {
            cells[random_row][random_col].isBomb = true;
            //populate neighbor mines
            for (let i = Math.max(random_row - 1, 0); i <= Math.min(random_row + 1, rows - 1); ++i) {
                for (let j = Math.max(random_col - 1, 0); j <= Math.min(random_col + 1, cols - 1); ++j) {
                    cells[i][j].mineNeighbors++;
                }
            }
            generated_mines++;
        }
    }

    return {
        rows,
        cols,
        mines,
        cells,
        opened_cells : 0
    };
}