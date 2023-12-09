import { Button } from "@nextui-org/button";
import * as React from "react";

import { BombIcon } from "./BombIcon";

interface IMineCell {
    row_index: number;
    col_index: number;
    isBomb: boolean;
    neighborBombs: number;
    isOpened: boolean;
    onCellOpened: (row: number, col: number) => void;
}

export const MineCell: React.FC<IMineCell> = ({
    row_index,
    col_index,
    isBomb,
    neighborBombs,
    isOpened: opened,
    onCellOpened
}) => {
    const onOpened = () => {
        if (!opened) {
            onCellOpened(row_index, col_index);
        };
    };
    return (
        <Button isIconOnly color="primary" radius="none" variant={opened ? "bordered" : "solid"} className="mineCell" onClick={onOpened}>
            {opened ? (isBomb ? (<BombIcon className="mineCell" />) : (neighborBombs || "")) : ""}
        </Button>
    )
};