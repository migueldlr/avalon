import { JOIN_GAME, GameState, GameActionTypes } from './types';

const initialState: GameState = {
    inGame: false,
};

export const gameReducer = (
    state = initialState,
    action: GameActionTypes,
): GameState => {
    switch (action.type) {
        case JOIN_GAME: {
            return { ...state, inGame: true };
        }
        default:
            return state;
    }
};
