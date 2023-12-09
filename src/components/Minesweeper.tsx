import * as React from "react";
import { MineCell } from "./MineCell";
import { useEffect, useState } from "react";
import _ from "lodash";
import { CellState, GameState, GameResult, GameLevel } from "./types";
import { generateMineBoard } from "./helpers";

export const MineSweeper = ({ gameLevel, onGameEnd, gameState, onGameStart }: { gameLevel : GameLevel, onGameEnd: (result: GameResult) => void , gameState : GameState, onGameStart: () => void}) => {
    const [game, setGame] = useState(generateMineBoard(gameLevel));
    const [isPlayable, setIsPlayable] = useState<boolean>(true);

    const updateGame = () => {
        setGame(_.cloneDeep(game));
    };

    useEffect(() => {
        if (gameState === GameState.NOT_STARTED) {
            setGame(generateMineBoard(gameLevel));
            setIsPlayable(true);
        }
        else if (gameState === GameState.ENDED)
        {
            setIsPlayable(false);
        }

    }, [gameState, gameLevel])
    
    const openCellAndNeighbors = (row_index : number, col_index : number, open_neighbors : boolean) => {
        // if all cells are opened
        const { rows, cols } = game;
        let previous_state = game.cells[row_index][col_index].state;
        game.cells[row_index][col_index].state = CellState.OPENED;
        if (game.cells[row_index][col_index].isBomb)
        {
            onGameEnd(GameResult.LOSE);
            return;
        }
        else if (previous_state !== CellState.OPENED)
        {
            // if we open a new cell that's not a bomb -> increase number of correctly opened cells.
            // if number of opened cells = number of bombs -> win
            ++game.opened_cells;
            if (game.opened_cells === (game.rows * game.cols - game.mines))
            {
                onGameEnd(GameResult.WIN);
                return;
            }
        }

        if (game.cells[row_index][col_index].mineNeighbors == 0)
        {
            open_neighbors = true;
        }

        if (game.cells[row_index][col_index].mineNeighbors == game.cells[row_index][col_index].flaggedNeighbors && open_neighbors)
        {
            for (let i = Math.max(row_index - 1, 0); i <= Math.min(row_index + 1, rows - 1); ++i) {
                for (let j = Math.max(col_index - 1, 0); j <= Math.min(col_index + 1, cols - 1); ++j) {
                    // count flagged neighbors, if num of flags = cell values -> open the rest, otherwise don't open
                    // should put it in a stack?
                    if (!game.cells[i][j].isBomb && (game.cells[i][j].state === CellState.UNOPENED)) {
                        // game.cells[i][j].state = CellState.OPENED;
                        openCellAndNeighbors(i, j, false);
                    }
                }
            }
        }
    };

    const updateFlaggedNeighbors = (row_index : number, col_index : number, direction : number ) => {
        const { rows, cols } = game;
        for (let i = Math.max(row_index - 1, 0); i <= Math.min(row_index + 1, rows - 1); ++i) {
            for (let j = Math.max(col_index - 1, 0); j <= Math.min(col_index + 1, cols - 1); ++j) {
                if (i !== row_index || j !== col_index) {
                    game.cells[i][j].flaggedNeighbors += direction;
                }
            }
        }
    };

    const onCellTriggered = (row_index : number, col_index : number, new_state : CellState) => {
        let current_cell = game.cells[row_index][col_index];
        if (current_cell.state === CellState.OPENED && new_state == CellState.OPENED && current_cell.mineNeighbors > 0)
        {
            openCellAndNeighbors(row_index, col_index, true);
        } else {
            // if flag changed -> update adjacent cells
            if ((current_cell.state === CellState.FLAGGED && new_state === CellState.UNOPENED)) {
                updateFlaggedNeighbors(row_index, col_index, -1);
            } else if ((current_cell.state === CellState.UNOPENED && new_state === CellState.FLAGGED)) {
                updateFlaggedNeighbors(row_index, col_index, 1);
            }

            // if this is the first cell to open -> start timer, setState
            if (gameState === GameState.NOT_STARTED && current_cell.state === CellState.UNOPENED && new_state === CellState.OPENED)
            {
                onGameStart();
            }
            
            // if flagged state is updated => update neighbor
            if (new_state === CellState.OPENED) {
                openCellAndNeighbors(row_index, col_index, true);
            } else {
                game.cells[row_index][col_index].state = new_state;
            }
        }
        updateGame();
    }

    return (
        <div className="game-board">
            {
                game.cells.map((row, i) => {
                    return (
                        <div className="flex gap-0 items-center">
                            {row.map((cell, j) => {
                                return (
                                    <MineCell key={i + "_" + j} isBomb={cell.isBomb} neighborBombs={cell.mineNeighbors} state={cell.state} row_index={i} col_index={j} onCellTriggered={onCellTriggered} isPlayable={isPlayable} />
                                );
                            })}
                        </div>
                    );
                })
            }
        </div>
    )
};