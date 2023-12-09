import { Button } from "@nextui-org/button";
import * as React from "react";

import { BombIcon } from "./BombIcon";
import { CellState } from "./types";
import { FlagIcon } from "./FlagIcon";

interface IMineCell {
    row_index: number;
    col_index: number;
    isBomb: boolean;
    neighborBombs: number;
    state: CellState;
    isPlayable: boolean;
    onCellTriggered: (row: number, col: number, new_state: CellState) => void;
}



export const MineCell: React.FC<IMineCell> = ({
    row_index,
    col_index,
    isBomb,
    neighborBombs,
    state,
    onCellTriggered,
    isPlayable
}) => {
    const onOpened = (e : React.MouseEvent ) => {
        if (state === CellState.FLAGGED)
        {
            return;
        }
        onCellTriggered(row_index, col_index, CellState.OPENED);
    };

    const onRightClick = (e : React.MouseEvent) => {
        e.preventDefault();
        if (!isPlayable)
        {
            return;
        }
        if (state === CellState.UNOPENED) {
            onCellTriggered(row_index, col_index, CellState.FLAGGED);
        }
        else if (state === CellState.FLAGGED) {
            onCellTriggered(row_index, col_index, CellState.UNOPENED);
        }

    }

    const getCellContent = () => {
        switch(state)
        {
            case CellState.FLAGGED:
                return (<FlagIcon />);
            case CellState.OPENED:
                return isBomb ? (<BombIcon className="mineCell" />) : (neighborBombs || "");
            case CellState.UNOPENED:
                return "";
        }
    };

    return (
        <Button key={"button_"+row_index+"_"+col_index} isIconOnly color="primary" radius="none" variant={state == CellState.OPENED ? "faded" : "bordered"} className="mineCell" onClick={onOpened} onContextMenu={onRightClick} disabled={!isPlayable}>
            {getCellContent()}
        </Button>
    )
};