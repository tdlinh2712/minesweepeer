import * as React from "react";
import { MineCell } from "./MineCell";
import { useState } from "react";
import _ from "lodash";

interface ICell {
    isBomb: boolean;
    mineNeighbors: number;
    isOpened : boolean;
}

interface IMineBoard {
    row: number;
    col: number;
    mines: number;
    cells: ICell[][];
}

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
            row.push({ isBomb: false, mineNeighbors: 0, isOpened : false });
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
        game.cells[row_index][col_index].isOpened = true;
        if (!game.cells[row_index][col_index].isBomb && game.cells[row_index][col_index].mineNeighbors == 0)
        {
            for (let i = Math.max(row_index - 1, 0); i <= Math.min(row_index + 1, rows - 1); ++i) {
                for (let j = Math.max(col_index - 1, 0); j <= Math.min(col_index + 1, cols - 1); ++j) {
                    if (!game.cells[i][j].isBomb && !game.cells[i][j].isOpened) {
                        openNeighbors(i, j);
                    }
                }
            }
        }
    }

    const onCellOpened = (row_index : number, col_index : number) => {
        if (game.cells[row_index][col_index].isOpened)
        {
            return;
        }
        openNeighbors(row_index, col_index);
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
                                    <MineCell isBomb={cell.isBomb} neighborBombs={cell.mineNeighbors} isOpened={cell.isOpened} row_index={i} col_index={j} onCellOpened={onCellOpened} />
                                );
                            })}
                        </div>
                    );
                })
            }
        </div>
    )
};