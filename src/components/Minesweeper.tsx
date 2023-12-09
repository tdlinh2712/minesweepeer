import * as React from "react";
import { MineCell } from "./MineCell";
import { useState } from "react";
import _ from "lodash";
import { IMineBoard, ICell, CellState } from "./types";

function getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}


const generateMineBoard = (rows: number, cols: number, mines: number): IMineBoard => {
    // pick the mine
    // find number of neighbors
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
        row: rows,
        col: cols,
        mines: mines,
        cells: cells
    };
}

export const MineSweeper = ({ rows, cols, bombs }: { rows: number, cols: number, bombs: number }) => {
    const [game, setGame] = useState(generateMineBoard(rows, cols, bombs));

    const updateGame = () => {
        setGame(_.cloneDeep(game));
      };
    
    const openNeighbors = (row_index : number, col_index : number) => {
        // if (game.cells[row_index][col_index].state !== CellState.UNOPENED) {
        //     return;
        // }
        // game.cells[row_index][col_index].state = CellState.OPENED;
        if (!game.cells[row_index][col_index].isBomb && game.cells[row_index][col_index].mineNeighbors == game.cells[row_index][col_index].flaggedNeighbors)
        {
            for (let i = Math.max(row_index - 1, 0); i <= Math.min(row_index + 1, rows - 1); ++i) {
                for (let j = Math.max(col_index - 1, 0); j <= Math.min(col_index + 1, cols - 1); ++j) {
                    // count flagged neighbors, if num of flags = cell values -> open the rest, otherwise don't open
                    // should put it in a stack?
                    if (!game.cells[i][j].isBomb && (game.cells[i][j].state === CellState.UNOPENED)) {
                        game.cells[i][j].state = CellState.OPENED;
                        openNeighbors(i, j);
                    }
                }
            }
        }
    };

    const updateFlaggedNeighbors = (row_index : number, col_index : number, direction : number ) => {
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
            openNeighbors(row_index, col_index);
        } else {
                    // if flag changed -> update adjacent cells
            if ((current_cell.state === CellState.FLAGGED && new_state === CellState.UNOPENED)) {
                updateFlaggedNeighbors(row_index, col_index, -1);
            } else if ((current_cell.state === CellState.UNOPENED && new_state === CellState.FLAGGED)) {
                updateFlaggedNeighbors(row_index, col_index, 1);
            }
            
            game.cells[row_index][col_index].state = new_state;
            // if flagged state is updated => update neighbor
            if (new_state === CellState.OPENED) {
                openNeighbors(row_index, col_index);
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
                                    <MineCell key={i+"_"+j} isBomb={cell.isBomb} neighborBombs={cell.mineNeighbors} state={cell.state} row_index={i} col_index={j} onCellTriggered={onCellTriggered} />
                                );
                            })}
                        </div>
                    );
                })
            }
        </div>
    )
};