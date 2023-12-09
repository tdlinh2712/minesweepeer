import { useEffect, useState } from "react";
import { MineSweeper } from "./MineSweeper";
import { GameLevel, GameResult, GameState } from "./types";
import { Button } from "@nextui-org/button";
import { useElapsedTime } from "use-elapsed-time";
import { DifficultySelection } from "./DifficultySelection";

export default function Game() {
    const [gameState, setGameState] = useState<GameState>(GameState.NOT_STARTED);
    const [isPlaying, setIsPlaying] = useState(false);
    const { elapsedTime, reset } = useElapsedTime({ isPlaying });
    const [gameResult, setGameResult] = useState<GameResult>(GameResult.UNKNOWN);
    const [level, setGameLevel] = useState<GameLevel>(GameLevel.BEGINNER);

    const handleSetGameLevel = (selected: string) => {
        setGameLevel(selected as GameLevel);
    };


    const onGameEnd = (result: GameResult) => {
        setGameState(GameState.ENDED);
        setGameResult(result);
    };

    const onGameStart = () => {
        setGameState(GameState.STARTED);
        // set timer
    }

    useEffect(() => {
        switch (gameState) {
            case GameState.NOT_STARTED:
                setIsPlaying(false);
                setGameResult(GameResult.UNKNOWN);
                reset();
                break;
            case GameState.STARTED:
                setIsPlaying(true);
                setGameResult(GameResult.UNKNOWN);
                break;
            case GameState.ENDED:
                setIsPlaying(false);
                break;
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
            <div className="grid grid-cols-4 gap-2">
                <div className="col-start-1 col-span-2">
                    <DifficultySelection level={level} handleSetGameLevel={handleSetGameLevel} />
                    {gameResult === GameResult.UNKNOWN ? "" : "You " + (gameResult === GameResult.LOSE ? "Lost!" : "Won!")}

                </div>
                <div className="col-start-3 col-span-1">
                    <Button onClick={handleClick} key="game-button">
                        {gameState === GameState.ENDED ? "Start" : "New Game"}
                    </Button>
                    <div style={{ fontSize: 56 }}>{elapsedTime.toFixed(2)}</div>
                </div>

            </div>
            <div className="grid grid-cols-1 gap-4">
            <MineSweeper key="MineSweeper" gameLevel={level} onGameEnd={onGameEnd} gameState={gameState} onGameStart={onGameStart} />
            </div>
        </div>
    )
}
