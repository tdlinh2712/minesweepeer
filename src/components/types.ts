export enum CellState {
    FLAGGED,
    OPENED,
    UNOPENED,
}

export enum GameState {
    NOT_STARTED,
    STARTED,
    ENDED
}

export enum GameResult {
    UNKNOWN,
    WIN,
    LOSE
}

export interface ICell {
    isBomb: boolean;
    mineNeighbors: number;
    state : CellState;
    flaggedNeighbors: number;
}

export interface IMineSweeper {

}

export interface IMineBoard {
    opened_cells: number;
    row: number;
    col: number;
    mines: number;
    cells: ICell[][];
}