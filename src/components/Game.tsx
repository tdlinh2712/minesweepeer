import { useEffect, useState } from "react";
import { MineSweeper } from "./MineSweeper";
import { GameResult, GameState } from "./types";
import { Button } from "@nextui-org/button";
import {useElapsedTime} from "use-elapsed-time";

export default function Game() {
    const [gameState, setGameState] = useState<GameState>(GameState.NOT_STARTED);
    const [isPlaying, setIsPlaying] = useState(false);
    const { elapsedTime } = useElapsedTime({ isPlaying });

    const onGameEnd = (result : GameResult) => {
        setGameState(GameState.ENDED);
    };

    const onGameStart = () => {
        setGameState(GameState.STARTED);
        // set timer
    }

    useEffect(() => {
        if (gameState === GameState.STARTED)
        {
            setIsPlaying(true);
        } else if (gameState === GameState.ENDED)
        {
            setIsPlaying(false);
        }
    }, [gameState]);

    const handleClick = () => {
        switch (gameState) {
            case GameState.NOT_STARTED:
                setGameState(GameState.STARTED);
            case GameState.STARTED:
                // reset/new game
            case GameState.ENDED:
                setGameState(GameState.NOT_STARTED);
        }
    }
    
    return (
        <div key="container">
            <Button onClick={handleClick} key="game-button">
            {gameState === GameState.ENDED ? "Start" : "New Game"}
            </Button>
            <div style={{ fontSize: 56 }}>{elapsedTime.toFixed(2)}</div>

            <MineSweeper key="MineSweeper" rows={9} cols={9} bombs={10} onGameEnd={onGameEnd} gameState={gameState} onGameStart={onGameStart} />
        </div>
    )
}
