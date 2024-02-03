import { useState, useMemo } from "react";
import { InputFieldsWrapper, FlexContainer, playButton, InputWrapper, startEndGameWrapper, instructionWrapper, SnakeBoardWrapper, fontSizeForSecondaryText, borderForSecondaryText } from "./SnakeGameWrapper.styles";
import SnakeCanvas from "../SnakeGameCanvas/SnakeCanvas";

export const SnakeGameWrapper: React.FC = () => {
    const [gridSize, setGridSize] = useState("");
    const [defaultSpeed, setDefaultSpeed] = useState("");
    const [numberOfGrabs, setNumberOfGrabs] = useState("");
    const [deltaChangeInSpeed, setDeltaChangeInSpeed] = useState("");
    const [gameStatus, setGameStatus] = useState<"not_started" | "in_progress">("not_started");

    // Memoized component
    const MemoizedGameStatus = useMemo(() => {
        if (gameStatus === "not_started") {
            return (
                <div style={startEndGameWrapper}>
                    <button
                        style={playButton}
                        type="button"
                        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                            if (!gridSize || Number(gridSize) <= 0) {
                                alert("Enter a valid grid size.")
                                return;
                            }
                            if (Number(gridSize) < 6) {
                                alert("Enter a grid size of minimum 6 for better experience.")
                                return;
                            }
                            if (!defaultSpeed || Number(defaultSpeed) <= 0) {
                                alert("Enter a valid speed (In seconds).")
                                return;
                            }
                            if (!numberOfGrabs || Number(numberOfGrabs) <= 0) {
                                alert("Enter a valid number for grabs.")
                                return;
                            }
                            if (!deltaChangeInSpeed || Number(deltaChangeInSpeed) <= 0) {
                                alert("Enter a valid delta change value.")
                                return;
                            }
                            if (!Number.isInteger(Number(numberOfGrabs))) {
                                alert("Number of grabs cannot be a decimal value.")
                                return;
                            }
                            setGameStatus("in_progress");
                            e.currentTarget.blur();
                        }}
                    >
                        Start Game
                    </button>
                </div>
            );
        } else if (gameStatus === "in_progress") {
            return (
                <>
                    <div style={startEndGameWrapper}>
                        <input
                            style={playButton}
                            type="button"
                            value="Reset Game"
                            onClick={() => setGameStatus("not_started")}
                        />
                    </div>
                    <div style={instructionWrapper}>
                        Press the arrow keys to change direction of the snake!
                    </div>
                    <div style={SnakeBoardWrapper}>
                        <SnakeCanvas gridSize={gridSize} defaultSpeed={defaultSpeed} numberOfGrabs={numberOfGrabs} deltaChangeInSpeed={deltaChangeInSpeed} />
                    </div>
                </>
            );
        }
    }, [gameStatus, gridSize, defaultSpeed, numberOfGrabs, deltaChangeInSpeed]);

    return (
        <>
            <div style={FlexContainer}>
                <div style={InputFieldsWrapper}>
                    <div style={InputWrapper}>
                        <span style={fontSizeForSecondaryText}>Grid Size:</span>
                        <input
                            type="number"
                            disabled={gameStatus === "in_progress"}
                            value={gridSize}
                            style={borderForSecondaryText}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setGridSize(e.target.value)}
                        />
                    </div>
                    <div style={InputWrapper}>
                        <span style={fontSizeForSecondaryText}>{"Default Snake Speed (s):"}</span>
                        <input
                            type="number"
                            value={defaultSpeed}
                            disabled={gameStatus === "in_progress"}
                            style={borderForSecondaryText}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDefaultSpeed(e.target.value)}
                        />
                    </div>
                    <div style={InputWrapper}>
                        <span style={fontSizeForSecondaryText}>Number of Grabs:</span>
                        <input
                            type="number"
                            value={numberOfGrabs}
                            disabled={gameStatus === "in_progress"}
                            style={borderForSecondaryText}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNumberOfGrabs(e.target.value)}
                        />
                    </div>
                    <div style={InputWrapper}>
                        <span style={fontSizeForSecondaryText}>{"Delta Speed Change (%):"}</span>
                        <input
                            type="number"
                            value={deltaChangeInSpeed}
                            disabled={gameStatus === "in_progress"}
                            style={borderForSecondaryText}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDeltaChangeInSpeed(e.target.value)}
                        />
                    </div>
                </div>
            </div>
            {MemoizedGameStatus}
        </>
    );
};