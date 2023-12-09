import * as React from "react";
import { MineCell } from "./MineCell";
import { ButtonGroup } from "@nextui-org/react";


const getCells = (row : number, col: number) => {
    let content = [];
    for (let i = 0; i < row; i++) {
      let row_content = [];
      for (let j = 0; j < col; j++) {
        row_content.push(<MineCell isBomb={false} neighborBombs={0} isOpened={false} />)
      }
      content.push(<div>{row_content}</div>);
    }
    return content;
}

export const MineSweeper = (props: PropType) => {
    const row = 9;
    const col = 9;
    return (
        <div className="game-board">
        {getCells(row, col)}
        </div>
    )
}
;