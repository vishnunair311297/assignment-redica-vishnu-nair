
import { render, fireEvent, waitFor } from '@testing-library/react';
import SnakeGameCanvas from "../App/components/SnakeGameCanvas/SnakeCanvas"

describe('SnakeGameCanvas component', () => {
    // Mock props

    if (!window.requestIdleCallback) {
        window.requestIdleCallback = function (cb: IdleRequestCallback): number {
            // Fallback to setTimeout if requestIdleCallback is not available
            return setTimeout(cb, 0) as any; // Cast setTimeout return value to number
        };
    }

    const props = {
        gridSize: '20',
        defaultSpeed: '0.1',
        numberOfGrabs: '5',
        deltaChangeInSpeed: '20',
    };

    it('renders without crashing', () => {
        render(<SnakeGameCanvas {...props} />);
    });

    it('renders canvas element', () => {
        const { getByRole } = render(<SnakeGameCanvas {...props} />);
        const canvasElement = getByRole('canvas');
        expect(canvasElement).toBeInTheDocument();
    });

    it('renders initial game status', () => {
        const { getByText } = render(<SnakeGameCanvas {...props} />);
        const scoreElement = getByText(/Your Score/i);
        const speedElement = getByText(/Current Speed/i);
        const statusElement = getByText(/Game Status/i);
        expect(scoreElement).toBeInTheDocument();
        expect(speedElement).toBeInTheDocument();
        expect(statusElement).toBeInTheDocument();
    });

    it('detects game over state', async () => {
        const { getByRole, getByText } = render(<SnakeGameCanvas {...props} />);
        const canvasElement = getByRole('canvas');

        // Perform key presses to simulate gameplay
        fireEvent.keyDown(canvasElement, { key: 'ArrowLeft' });
        fireEvent.keyDown(canvasElement, { key: 'ArrowLeft' });
        fireEvent.keyDown(canvasElement, { key: 'ArrowLeft' });
        fireEvent.keyDown(canvasElement, { key: 'ArrowLeft' });

        // Wait for game over state to be updated with a timeout of 5000 milliseconds (5 seconds)
        await waitFor(() => {
            // Check if "Game Over" text is present in any container or split across elements
            const gameOverText = getByText(/Game Over/i);
            expect(gameOverText).toBeInTheDocument();
        }, { timeout: 5000 }); // Set the timeout delay in milliseconds
    });

    it('changes direction on key press', () => {
        const { getByRole } = render(<SnakeGameCanvas {...props} />);
        const canvasElement = getByRole('canvas');

        // Initially, the direction should be 'RIGHT'
        expect(canvasElement).toHaveAttribute('tabindex', '0'); // Ensure the canvas is focusable
        expect(canvasElement).toHaveAttribute('data-direction', 'RIGHT');

        // Change direction with key presses and check after each key press
        fireEvent.keyDown(canvasElement, { key: 'ArrowDown' });
        expect(canvasElement).toHaveAttribute('data-direction', 'DOWN');

        fireEvent.keyDown(canvasElement, { key: 'ArrowLeft' });
        expect(canvasElement).toHaveAttribute('data-direction', 'LEFT');

        fireEvent.keyDown(canvasElement, { key: 'ArrowUp' });
        expect(canvasElement).toHaveAttribute('data-direction', 'UP');

        fireEvent.keyDown(canvasElement, { key: 'ArrowRight' });
        expect(canvasElement).toHaveAttribute('data-direction', 'RIGHT');
    });

});
