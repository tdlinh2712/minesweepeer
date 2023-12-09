export enum CellState {
    FLAGGED,
    OPENED,
    UNOPENED,
}

export interface ICell {
    isBomb: boolean;
    mineNeighbors: number;
    state : CellState;
    flaggedNeighbors: number;
}

export interface IMineBoard {
    row: number;
    col: number;
    mines: number;
    cells: ICell[][];
}