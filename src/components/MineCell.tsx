import { Button } from "@nextui-org/button";
import * as React from "react";

interface IMineCell {
    isBomb : boolean;
    neighborBombs : number;
    isOpened : boolean;
}

export const MineCell : React.FC<IMineCell> =({
    isBomb,
    neighborBombs,
    isOpened
  }) => (
    <Button color="primary" radius="none" variant={isOpened ? "bordered" : "solid"} className="mineCell">
          {isBomb ? "Bomb" : neighborBombs}
    </Button>
);