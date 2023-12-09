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

export enum GameLevel {
    BEGINNER = "Beginner",
    INTERMMEDIATE = "Intermmediate",
    EXPERT = "Expert"
}

export interface IGameDimension {
    rows : number;
    cols : number;
    mines : number;
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
    rows: number;
    cols: number;
    mines: number;
    cells: ICell[][];
}

export interface IDifficultySelection {
    level : GameLevel,
    handleSetGameLevel : (selected : string) => void
}
