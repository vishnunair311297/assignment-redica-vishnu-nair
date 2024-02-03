import React, { useReducer, useEffect, useRef, useCallback } from 'react';
import { reducer, Direction, Coordinate } from "./reducers/reducer"
import { FlexContainer, FlexContainerStatus, statusWrapper } from './SnakeCanvas.styles';

interface SnakCanvasProps {
    gridSize: string;
    defaultSpeed: string;
    numberOfGrabs: string;
    deltaChangeInSpeed: string;
};

// Main component for Snake game
const SnakeGameCanvas: React.FC<SnakCanvasProps> = ({ gridSize, defaultSpeed, numberOfGrabs, deltaChangeInSpeed }) => {

    // Define constants for canvas size and square size
    const SQUARE_SIZE = 10;
    const CANVAS_SIZE = Number(gridSize) * SQUARE_SIZE;

    // Initial state
    const initialState = {
        snake: [
            { x: 0, y: 0 },
            { x: 0, y: 1 },
        ] as Coordinate[],
        food: { x: 3, y: 3 } as Coordinate,
        direction: 'RIGHT' as Direction,
        gameOver: false,
        score: 0,
        delay: Number(defaultSpeed) * 1000
    };
    const [state, dispatch] = useReducer(reducer, initialState);
    const { snake, food, direction, gameOver } = state;

    // Ref for canvas context
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Function to create random food
    const createFood = useCallback(() => {
        let newFood: Coordinate;
        do {
            newFood = {
                x: Math.floor(Math.random() * (CANVAS_SIZE / SQUARE_SIZE)),
                y: Math.floor(Math.random() * (CANVAS_SIZE / SQUARE_SIZE)),
            };
        } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));

        dispatch({ type: 'CREATE_FOOD', payload: newFood });
    }, [snake]);

    // Function to update snake position
    const updateSnake = useCallback(() => {
        if (gameOver) return;

        const newSnake = [...snake];
        const head = { ...newSnake[0] };

        // Move the snake based on direction
        switch (direction) {
            case 'UP':
                head.y -= 1;
                break;
            case 'DOWN':
                head.y += 1;
                break;
            case 'LEFT':
                head.x -= 1;
                break;
            case 'RIGHT':
                head.x += 1;
                break;
        }

        // Check if snake collides with walls or itself
        if (
            head.x < 0 ||
            head.x >= CANVAS_SIZE / SQUARE_SIZE ||
            head.y < 0 ||
            head.y >= CANVAS_SIZE / SQUARE_SIZE ||
            snake.some((segment) => segment.x === head.x && segment.y === head.y)
        ) {
            dispatch({ type: 'GAME_OVER' });
            return;
        }

        newSnake.unshift(head);

        // If snake eats food, increase size and create new food
        if (head.x === food.x && head.y === food.y) {
            createFood();
            dispatch({ type: 'UPDATE_SCORE' });
        } else {
            newSnake.pop();
        }

        dispatch({ type: 'MOVE_SNAKE', payload: newSnake });
    }, [snake, food, direction, gameOver, createFood]);

    // Callback For KeyDown Event
    const onKeyDown = useCallback((e: KeyboardEvent) => {
        {
            switch (e.key) {
                case 'ArrowUp':
                    if (state.direction !== "DOWN") dispatch({ type: 'MOVE', payload: 'UP' });
                    break;
                case 'ArrowDown':
                    if (state.direction !== "UP") dispatch({ type: 'MOVE', payload: 'DOWN' });
                    break;
                case 'ArrowLeft':
                    if (state.direction !== "RIGHT") dispatch({ type: 'MOVE', payload: 'LEFT' });
                    break;
                case 'ArrowRight':
                    if (state.direction !== "LEFT") dispatch({ type: 'MOVE', payload: 'RIGHT' });
                    break;
            }
        };

    }, [state.direction]);

    // Add Event Listener to DOM
    useEffect(() => {
        window.addEventListener('keydown', onKeyDown);

        return () => {
            window.removeEventListener('keydown', onKeyDown);
        };
    }, [state.direction])

    useEffect(() => {
        //Update delta speed change for every N number of food grabs
        if (state.score > 0 && (state.score % Number(numberOfGrabs)) === 0) {
            dispatch({ type: 'UPDATE_SPEED', payload: state.delay / (1 + Number(deltaChangeInSpeed) / 100) })
        }
    }, [state.score])

    // Effect to update game state
    useEffect(() => {
        const interval = setInterval(() => {
            window.requestIdleCallback(updateSnake);
        }, state.delay);
        return () => clearInterval(interval);
    }, [updateSnake, state.delay]);

    // Effect to draw on canvas
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext('2d');
        if (!context) return;

        // Clear canvas
        context.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

        // Draw snake
        context.fillStyle = 'green';
        snake.forEach((segment) => {
            context.fillRect(
                segment.x * SQUARE_SIZE,
                segment.y * SQUARE_SIZE,
                SQUARE_SIZE,
                SQUARE_SIZE
            );
        });

        // Draw food
        context.fillStyle = 'red';
        context.fillRect(
            food.x * SQUARE_SIZE,
            food.y * SQUARE_SIZE,
            SQUARE_SIZE,
            SQUARE_SIZE
        );
    }, [snake, food]);

    return (
        <div>
            <div style={FlexContainer}>
                <div style={FlexContainer}>
                    <canvas
                        data-direction={state.direction} // Added this attribute for unit testing
                        tabIndex={0}
                        role='canvas'
                        ref={canvasRef}
                        width={CANVAS_SIZE}
                        height={CANVAS_SIZE}
                        style={{ border: '1px solid black' }} />
                </div>
                <div style={{ ...statusWrapper, flexDirection: "column" }}>
                    <div style={FlexContainerStatus}>{`Your Score: ${state.score}`}</div>
                    <div style={FlexContainerStatus}>{`Current Speed (s): ${(state.delay / 1000).toFixed(3)}`}</div>
                    <div style={FlexContainerStatus}>{`Game Status: ${state.gameOver ? "Over" : "In Progress"}`}</div>
                </div>
            </div>
            <div style={{ ...FlexContainer, marginTop: "2rem" }}>
                {gameOver && <p>Game Over!</p>}
            </div>
        </div>
    );
};

export default SnakeGameCanvas;
