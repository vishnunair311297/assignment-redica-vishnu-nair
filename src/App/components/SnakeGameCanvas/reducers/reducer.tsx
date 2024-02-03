
// Define types for direction and coordinates
export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
export type Coordinate = {
    x: number;
    y: number;
};

// Define action types
type Action =
    | { type: 'MOVE'; payload: Direction }
    | { type: 'MOVE_SNAKE'; payload: Coordinate[] }
    | { type: 'CREATE_FOOD'; payload: Coordinate }
    | { type: 'GAME_OVER' }
    | { type: 'UPDATE_SCORE' }
    | { type: 'UPDATE_SPEED'; payload: number }

type State = {
    snake: Coordinate[];
    food: Coordinate;
    direction: Direction;
    gameOver: boolean;
    score: number;
    delay: number;
};

// Reducer function for managing state
export const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'MOVE':
            return { ...state, direction: action.payload };
        case 'MOVE_SNAKE':
            return { ...state, snake: action.payload };
        case 'CREATE_FOOD':
            return { ...state, food: action.payload };
        case 'GAME_OVER':
            return { ...state, gameOver: true };
        case 'UPDATE_SCORE':
            return { ...state, score: state.score + 1 };
        case 'UPDATE_SPEED':
            return { ...state, delay: action.payload };
        default:
            return state;
    }
};

